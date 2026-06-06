package com.invenflow.backend.controller;

import com.invenflow.backend.model.PurchaseOrder;
import com.invenflow.backend.model.SalesOrder;
import com.invenflow.backend.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/purchase")
    public List<PurchaseOrder> getAllPurchaseOrders() {
        return orderService.getAllPurchaseOrders();
    }

    @PostMapping("/purchase")
    public PurchaseOrder createPurchaseOrder(@RequestBody PurchaseOrder order) {
        return orderService.createPurchaseOrder(order);
    }

    @PutMapping("/purchase/{id}")
    public PurchaseOrder updatePurchaseOrder(@PathVariable Long id, @RequestBody PurchaseOrder order) {
        return orderService.updatePurchaseOrder(id, order);
    }

    @DeleteMapping("/purchase/{id}")
    public void deletePurchaseOrder(@PathVariable Long id) {
        orderService.deletePurchaseOrder(id);
    }

    @GetMapping("/sales")
    public List<SalesOrder> getAllSalesOrders() {
        return orderService.getAllSalesOrders();
    }

    @PostMapping("/sales")
    public SalesOrder createSalesOrder(@RequestBody SalesOrder order) {
        return orderService.createSalesOrder(order);
    }

    @PutMapping("/sales/{id}")
    public SalesOrder updateSalesOrder(@PathVariable Long id, @RequestBody SalesOrder order) {
        return orderService.updateSalesOrder(id, order);
    }

    @DeleteMapping("/sales/{id}")
    public void deleteSalesOrder(@PathVariable Long id) {
        orderService.deleteSalesOrder(id);
    }
}
