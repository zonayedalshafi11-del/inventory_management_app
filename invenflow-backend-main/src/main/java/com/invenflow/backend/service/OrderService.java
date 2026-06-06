package com.invenflow.backend.service;

import com.invenflow.backend.model.PurchaseOrder;
import com.invenflow.backend.model.PurchaseOrderItem;
import com.invenflow.backend.model.Product;
import com.invenflow.backend.model.SalesOrder;
import com.invenflow.backend.model.SalesOrderItem;
import com.invenflow.backend.repository.ProductRepository;
import com.invenflow.backend.repository.PurchaseOrderRepository;
import com.invenflow.backend.repository.SalesOrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;

@Service
public class OrderService {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SalesOrderRepository salesOrderRepository;
    private final ProductRepository productRepository;

    public OrderService(PurchaseOrderRepository purchaseOrderRepository,
                        SalesOrderRepository salesOrderRepository,
                        ProductRepository productRepository) {
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.salesOrderRepository = salesOrderRepository;
        this.productRepository = productRepository;
    }

    // ─── Purchase Orders ──────────────────────────────────────────────────────

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return purchaseOrderRepository.findAll();
    }

    @Transactional
    public PurchaseOrder createPurchaseOrder(PurchaseOrder order) {
        PurchaseOrder saved = purchaseOrderRepository.save(order);

        // If created directly as "Received", add stock immediately
        if ("RECEIVED".equals(normalizeStatus(saved.getStatus()))) {
            applyInventoryForPurchase(saved.getItems(), true);
        }

        return saved;
    }

    @Transactional
    public PurchaseOrder updatePurchaseOrder(Long id, PurchaseOrder updatedOrder) {
        PurchaseOrder existing = purchaseOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Purchase order not found: " + id));

        String oldStatus = normalizeStatus(existing.getStatus());
        String newStatus = normalizeStatus(updatedOrder.getStatus());

        // Stock increases when status changes TO "Received"
        if (!oldStatus.equals("RECEIVED") && "RECEIVED".equals(newStatus)) {
            applyInventoryForPurchase(updatedOrder.getItems(), true);
        }

        // Stock decreases if status changes FROM "Received" back to something else
        // (e.g. admin corrects a mistake)
        if ("RECEIVED".equals(oldStatus) && !"RECEIVED".equals(newStatus)) {
            applyInventoryForPurchase(existing.getItems(), false);
        }

        existing.setSupplier(updatedOrder.getSupplier());
        existing.setOrderDate(updatedOrder.getOrderDate());
        existing.setExpectedDelivery(updatedOrder.getExpectedDelivery());
        existing.setTotalAmount(updatedOrder.getTotalAmount());
        existing.setStatus(updatedOrder.getStatus());
        existing.setItems(updatedOrder.getItems());

        return purchaseOrderRepository.save(existing);
    }

    public void deletePurchaseOrder(Long id) {
        purchaseOrderRepository.deleteById(id);
    }

    // ─── Sales Orders ─────────────────────────────────────────────────────────

    public List<SalesOrder> getAllSalesOrders() {
        return salesOrderRepository.findAll();
    }

    @Transactional
    public SalesOrder createSalesOrder(SalesOrder order) {
        // Deduct stock when a sale is created
        if (!"CANCELLED".equals(normalizeStatus(order.getStatus()))) {
            applyInventoryForSale(order.getItems(), false);
        }
        return salesOrderRepository.save(order);
    }

    @Transactional
    public SalesOrder updateSalesOrder(Long id, SalesOrder updatedOrder) {
        SalesOrder existing = salesOrderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Sales order not found: " + id));

        String oldStatus = normalizeStatus(existing.getStatus());
        String newStatus = normalizeStatus(updatedOrder.getStatus());

        // Restore stock if order is cancelled or refunded
        if (!oldStatus.equals(newStatus) &&
                ("CANCELLED".equals(newStatus) || "REFUNDED".equals(newStatus))) {
            applyInventoryForSale(existing.getItems(), true);
        }

        // Deduct stock again if re-activating a previously cancelled order
        if (("CANCELLED".equals(oldStatus) || "REFUNDED".equals(oldStatus)) &&
                "COMPLETED".equals(newStatus)) {
            applyInventoryForSale(updatedOrder.getItems(), false);
        }

        existing.setCustomerName(updatedOrder.getCustomerName());
        existing.setOrderDate(updatedOrder.getOrderDate());
        existing.setTotalAmount(updatedOrder.getTotalAmount());
        existing.setStatus(updatedOrder.getStatus());
        existing.setItems(updatedOrder.getItems());

        return salesOrderRepository.save(existing);
    }

    public void deleteSalesOrder(Long id) {
        salesOrderRepository.deleteById(id);
    }

    // ─── Stock helpers ────────────────────────────────────────────────────────

    /**
     * Adds or removes stock based on purchase order items.
     * add=true  → stock increases (order received)
     * add=false → stock decreases (order un-received / corrected)
     */
    private void applyInventoryForPurchase(List<PurchaseOrderItem> items, boolean add) {
        if (items == null) return;

        for (PurchaseOrderItem item : items) {
            if (item == null || item.getProductId() == null ||
                    item.getQuantity() == null || item.getQuantity() <= 0) continue;

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Product not found: " + item.getProductId()));

            int current = product.getStock() == null ? 0 : product.getStock();
            int updated = add ? current + item.getQuantity()
                    : Math.max(0, current - item.getQuantity());

            product.setStock(updated);
            productRepository.save(product);
        }
    }

    /**
     * Adds or removes stock based on sales order items.
     * isRefund=false → stock decreases (sale made)
     * isRefund=true  → stock increases  (sale refunded/cancelled)
     */
    private void applyInventoryForSale(List<SalesOrderItem> items, boolean isRefund) {
        if (items == null) return;

        for (SalesOrderItem item : items) {
            if (item == null || item.getProductId() == null ||
                    item.getQuantity() == null || item.getQuantity() <= 0) continue;

            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Product not found: " + item.getProductId()));

            int current = product.getStock() == null ? 0 : product.getStock();
            int updated = isRefund ? current + item.getQuantity()
                    : current - item.getQuantity();

            if (updated < 0) {
                throw new IllegalArgumentException(
                        "Not enough stock for product: " + product.getName() +
                                ". Available: " + current + ", requested: " + item.getQuantity());
            }

            product.setStock(updated);
            productRepository.save(product);
        }
    }

    private String normalizeStatus(String status) {
        return status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
    }
}