package com.invenflow.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String sku;
    private String category;
    private Double costPrice;
    private Double sellPrice;
    private Integer stock;
    private Integer reorderLevel;
    private String status;
    private String supplier;

    public Product() {}

    public Product(Long id, String name, String sku, String category,
                   Double costPrice, Double sellPrice, Integer stock,
                   Integer reorderLevel, String status, String supplier) {
        this.id = id;
        this.name = name;
        this.sku = sku;
        this.category = category;
        this.costPrice = costPrice;
        this.sellPrice = sellPrice;
        this.stock = stock;
        this.reorderLevel = reorderLevel;
        this.status = status;
        this.supplier = supplier;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Double getCostPrice() { return costPrice; }
    public void setCostPrice(Double costPrice) { this.costPrice = costPrice; }

    public Double getSellPrice() { return sellPrice; }
    public void setSellPrice(Double sellPrice) { this.sellPrice = sellPrice; }

    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }

    public Integer getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(Integer reorderLevel) { this.reorderLevel = reorderLevel; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSupplier() { return supplier; }
    public void setSupplier(String supplier) { this.supplier = supplier; }
}