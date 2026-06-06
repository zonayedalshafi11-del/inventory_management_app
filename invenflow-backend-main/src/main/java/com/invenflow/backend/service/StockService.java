package com.invenflow.backend.service;

import com.invenflow.backend.model.Product;
import com.invenflow.backend.model.PurchaseOrder;
import com.invenflow.backend.model.PurchaseOrderItem;
import com.invenflow.backend.model.SalesOrder;
import com.invenflow.backend.model.SalesOrderItem;
import com.invenflow.backend.repository.ProductRepository;
import com.invenflow.backend.repository.PurchaseOrderRepository;
import com.invenflow.backend.repository.SalesOrderRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class StockService {

    private final ProductRepository productRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SalesOrderRepository salesOrderRepository;

    public StockService(ProductRepository productRepository,
                        PurchaseOrderRepository purchaseOrderRepository,
                        SalesOrderRepository salesOrderRepository) {
        this.productRepository = productRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.salesOrderRepository = salesOrderRepository;
    }

    /**
     * Returns one row per product with:
     * id, name, category, currentStock, reorderLevel, status
     */
    public List<Map<String, Object>> getStockSummary() {
        return productRepository.findAll().stream().map(p -> {
            Map<String, Object> row = new HashMap<>();
            row.put("id", p.getId());
            row.put("name", p.getName());
            row.put("sku", p.getSku());
            row.put("category", p.getCategory());
            row.put("currentStock", p.getStock() != null ? p.getStock() : 0);
            row.put("reorderLevel", p.getReorderLevel() != null ? p.getReorderLevel() : 0);
            row.put("supplier", p.getSupplier());

            // Derive status
            int stock = p.getStock() != null ? p.getStock() : 0;
            int reorder = p.getReorderLevel() != null ? p.getReorderLevel() : 0;
            String status;
            if (stock == 0) {
                status = "Out of Stock";
            } else if (stock <= reorder) {
                status = "Low Stock";
            } else {
                status = "In Stock";
            }
            row.put("stockStatus", status);
            return row;
        }).toList();
    }

    /**
     * Builds a transaction log from purchase orders (IN) and sales orders (OUT).
     * Each received PO creates IN transactions per item.
     * Each completed SO creates OUT transactions per item.
     */
    public List<Map<String, Object>> getStockTransactions() {
        List<Map<String, Object>> transactions = new ArrayList<>();

        // IN transactions from received purchase orders
        for (PurchaseOrder po : purchaseOrderRepository.findAll()) {
            if (!"RECEIVED".equalsIgnoreCase(po.getStatus())) continue;
            if (po.getItems() == null) continue;

            for (PurchaseOrderItem item : po.getItems()) {
                if (item.getProductId() == null) continue;
                Map<String, Object> tx = new HashMap<>();
                tx.put("type", "IN");
                tx.put("productId", item.getProductId());
                tx.put("productName", item.getProductName());
                tx.put("quantity", item.getQuantity());
                tx.put("reference", "PO #" + po.getId());
                tx.put("counterparty", po.getSupplier());
                tx.put("date", po.getOrderDate() != null
                        ? po.getOrderDate().toString() : "N/A");
                transactions.add(tx);
            }
        }

        // OUT transactions from completed/pending sales orders
        for (SalesOrder so : salesOrderRepository.findAll()) {
            String status = so.getStatus() != null
                    ? so.getStatus().toUpperCase() : "";
            if ("CANCELLED".equals(status)) continue;
            if (so.getItems() == null) continue;

            for (SalesOrderItem item : so.getItems()) {
                if (item.getProductId() == null) continue;
                Map<String, Object> tx = new HashMap<>();
                tx.put("type", "OUT");
                tx.put("productId", item.getProductId());
                tx.put("productName", item.getProductName());
                tx.put("quantity", item.getQuantity());
                tx.put("reference", "SO #" + so.getId());
                tx.put("counterparty", so.getCustomerName());
                tx.put("date", so.getOrderDate() != null
                        ? so.getOrderDate().toString() : "N/A");
                transactions.add(tx);
            }
        }

        // Sort by date descending (most recent first)
        transactions.sort((a, b) -> {
            String da = (String) a.get("date");
            String db = (String) b.get("date");
            return db.compareTo(da);
        });

        return transactions;
    }

    /**
     * Returns all IN/OUT movements for a specific product.
     */
    public List<Map<String, Object>> getStockMovements(Long productId) {
        return getStockTransactions().stream()
                .filter(tx -> productId.equals(tx.get("productId")))
                .toList();
    }
}