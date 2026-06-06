package com.invenflow.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sales_order")
public class SalesOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;

    private LocalDate orderDate = LocalDate.now();
    private Double totalAmount;
    private String status = "COMPLETED";

    @ElementCollection
    @CollectionTable(name = "sales_order_item", joinColumns = @JoinColumn(name = "sales_order_id"))
    private List<SalesOrderItem> items;

    @JsonIgnore
    @OneToMany(mappedBy = "salesOrder", cascade = CascadeType.ALL)
    private List<Payment> payments;

    public SalesOrder() {
        this.items = new ArrayList<>();
    }

    public SalesOrder(Long id, String customerName, LocalDate orderDate, Double totalAmount, String status,
                      List<SalesOrderItem> items, List<Payment> payments) {
        this.id = id;
        this.customerName = customerName;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.items = items;
        this.payments = payments;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<SalesOrderItem> getItems() {
        return items;
    }

    public void setItems(List<SalesOrderItem> items) {
        this.items = items;
    }

    public List<Payment> getPayments() {
        return payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }
}
