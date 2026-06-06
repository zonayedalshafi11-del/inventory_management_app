package com.invenflow.backend.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "payment")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;
    private Date paymentDate;
    private String method; // CASH, CARD, TRANSFER

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = true)
    private PurchaseOrder purchaseOrder;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sales_order_id", nullable = true)
    private SalesOrder salesOrder;

    public Payment() {}

    public Payment(Long id, Double amount, Date paymentDate, String method,
                   PurchaseOrder purchaseOrder, SalesOrder salesOrder) {
        this.id = id;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.method = method;
        this.purchaseOrder = purchaseOrder;
        this.salesOrder = salesOrder;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public Date getPaymentDate() { return paymentDate; }
    public void setPaymentDate(Date paymentDate) { this.paymentDate = paymentDate; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public PurchaseOrder getPurchaseOrder() { return purchaseOrder; }
    public void setPurchaseOrder(PurchaseOrder purchaseOrder) { this.purchaseOrder = purchaseOrder; }

    public SalesOrder getSalesOrder() { return salesOrder; }
    public void setSalesOrder(SalesOrder salesOrder) { this.salesOrder = salesOrder; }
}