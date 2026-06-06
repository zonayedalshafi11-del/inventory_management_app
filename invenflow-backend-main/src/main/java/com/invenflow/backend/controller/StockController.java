package com.invenflow.backend.controller;

import com.invenflow.backend.service.StockService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "*")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    // Summary per product: current stock, category, status
    @GetMapping("/summary")
    public List<Map<String, Object>> getStockSummary() {
        return stockService.getStockSummary();
    }

    // Recent IN/OUT transactions derived from purchase & sales orders
    @GetMapping("/transactions")
    public List<Map<String, Object>> getStockTransactions() {
        return stockService.getStockTransactions();
    }

    // Stock movement for a specific product
    @GetMapping("/movements/{productId}")
    public List<Map<String, Object>> getStockMovements(
            @PathVariable Long productId) {
        return stockService.getStockMovements(productId);
    }
}