package com.invenflow.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "purchase_order")
public class PurchaseOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String supplier;

    private LocalDate orderDate = LocalDate.now();
    private LocalDate expectedDelivery = LocalDate.now();
    private Double totalAmount;
    private String status = "Pending";
    private String invoiceAttachment;

    @ElementCollection
    @CollectionTable(name = "purchase_order_item", joinColumns = @JoinColumn(name = "purchase_order_id"))
    private List<PurchaseOrderItem> items;

    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL)
    private List<Payment> payments;

    public PurchaseOrder() {
        this.items = new ArrayList<>();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }
    public LocalDate getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDate orderDate) { this.orderDate = orderDate; }
    public LocalDate getExpectedDelivery() { return expectedDelivery; }
    public void setExpectedDelivery(LocalDate expectedDelivery) { this.expectedDelivery = expectedDelivery; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getInvoiceAttachment() { return invoiceAttachment; }
    public void setInvoiceAttachment(String invoiceAttachment) { this.invoiceAttachment = invoiceAttachment; }
    public List<PurchaseOrderItem> getItems() { return items; }
    public void setItems(List<PurchaseOrderItem> items) { this.items = items; }
    public List<Payment> getPayments() { return payments; }
    public void setPayments(List<Payment> payments) { this.payments = payments; }
}
