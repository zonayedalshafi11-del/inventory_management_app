package com.invenflow.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "app_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;
    private String role; // Admin, Inventory Manager, Warehouse Staff, Accountant

    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'Active'")
    private String status; // Active, Inactive

    private String lastLogin;

    // Permissions (stored as JSON or separate fields)
    private Boolean manageProducts;
    private Boolean manageOrders;
    private Boolean viewReports;
    private Boolean manageUsers;

    public User() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getLastLogin() { return lastLogin; }
    public void setLastLogin(String lastLogin) { this.lastLogin = lastLogin; }
    public Boolean getManageProducts() { return manageProducts; }
    public void setManageProducts(Boolean manageProducts) { this.manageProducts = manageProducts; }
    public Boolean getManageOrders() { return manageOrders; }
    public void setManageOrders(Boolean manageOrders) { this.manageOrders = manageOrders; }
    public Boolean getViewReports() { return viewReports; }
    public void setViewReports(Boolean viewReports) { this.viewReports = viewReports; }
    public Boolean getManageUsers() { return manageUsers; }
    public void setManageUsers(Boolean manageUsers) { this.manageUsers = manageUsers; }
}
