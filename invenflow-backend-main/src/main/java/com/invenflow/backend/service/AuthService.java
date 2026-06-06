package com.invenflow.backend.service;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    public Map<String, Object> login(String email, String password) {
        if (email == null || email.isBlank() || password == null || password.length() < 4) {
            throw new RuntimeException("Invalid credentials");
        }

        String role = email.toLowerCase().contains("admin") ? "Admin" : "Inventory Manager";

        // Use HashMap instead of Map.of() to avoid the 10-entry limit
        // and nested-map serialization issues
        Map<String, Object> permissions = new HashMap<>();
        if ("Admin".equals(role)) {
            permissions.put("manageProducts", true);
            permissions.put("manageOrders", true);
            permissions.put("viewReports", true);
            permissions.put("manageUsers", true);
        } else {
            permissions.put("manageProducts", true);
            permissions.put("manageOrders", true);
            permissions.put("viewReports", true);
            permissions.put("manageUsers", false);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("id", "u-" + Math.abs(email.toLowerCase().hashCode()));
        response.put("name", email.split("@")[0]);
        response.put("email", email);
        response.put("role", role);
        response.put("status", "Active");
        response.put("lastLogin", "Just now");
        response.put("permissions", permissions);
        response.put("token", "fake-jwt-token-" + Instant.now().toEpochMilli());

        return response;
    }
}