package com.invenflow.backend.service;

import com.invenflow.backend.model.Payment;
import com.invenflow.backend.model.PurchaseOrder;
import com.invenflow.backend.model.SalesOrder;
import com.invenflow.backend.repository.PaymentRepository;
import com.invenflow.backend.repository.PurchaseOrderRepository;
import com.invenflow.backend.repository.SalesOrderRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PurchaseOrderRepository purchaseOrderRepository;
    private final SalesOrderRepository salesOrderRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          PurchaseOrderRepository purchaseOrderRepository,
                          SalesOrderRepository salesOrderRepository) {
        this.paymentRepository = paymentRepository;
        this.purchaseOrderRepository = purchaseOrderRepository;
        this.salesOrderRepository = salesOrderRepository;
    }

    public List<Map<String, Object>> getAllPayments() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Payment p : paymentRepository.findAll()) {
            result.add(toMap(p));
        }
        return result;
    }

    public List<Map<String, Object>> getPurchasePayments() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Payment p : paymentRepository.findAll()) {
            if (p.getPurchaseOrder() != null) {
                result.add(toMap(p));
            }
        }
        return result;
    }

    public List<Map<String, Object>> getSalesPayments() {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Payment p : paymentRepository.findAll()) {
            if (p.getSalesOrder() != null) {
                result.add(toMap(p));
            }
        }
        return result;
    }

    public Map<String, Object> createPayment(Map<String, Object> body) {
        Payment payment = new Payment();
        payment.setAmount(((Number) body.get("amount")).doubleValue());
        payment.setMethod((String) body.get("method"));
        payment.setPaymentDate(new Date());

        Object poId = body.get("purchaseOrderId");
        Object soId = body.get("salesOrderId");

        if (poId != null) {
            Long id = ((Number) poId).longValue();
            PurchaseOrder po = purchaseOrderRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Purchase order not found: " + id));
            payment.setPurchaseOrder(po);
        }

        if (soId != null) {
            Long id = ((Number) soId).longValue();
            SalesOrder so = salesOrderRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException(
                            "Sales order not found: " + id));
            payment.setSalesOrder(so);
        }

        return toMap(paymentRepository.save(payment));
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }

    private Map<String, Object> toMap(Payment p) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", p.getId());
        map.put("amount", p.getAmount());
        map.put("method", p.getMethod());
        map.put("paymentDate",
                p.getPaymentDate() != null ? p.getPaymentDate().toString() : null);

        if (p.getPurchaseOrder() != null) {
            PurchaseOrder po = p.getPurchaseOrder();
            map.put("purchaseOrderId", po.getId());
            map.put("supplier", po.getSupplier());
            map.put("type", "PURCHASE");
            List<String> products = new ArrayList<>();
            if (po.getItems() != null) {
                for (var item : po.getItems()) {
                    products.add(item.getProductName());
                }
            }
            map.put("products", products);
        }

        if (p.getSalesOrder() != null) {
            SalesOrder so = p.getSalesOrder();
            map.put("salesOrderId", so.getId());
            map.put("customerName", so.getCustomerName());
            map.put("type", "SALES");
            List<String> products = new ArrayList<>();
            if (so.getItems() != null) {
                for (var item : so.getItems()) {
                    products.add(item.getProductName());
                }
            }
            map.put("products", products);
        }

        return map;
    }
}