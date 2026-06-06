package com.invenflow.backend.controller;

import com.invenflow.backend.service.PaymentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<Map<String, Object>> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/purchase")
    public List<Map<String, Object>> getPurchasePayments() {
        return paymentService.getPurchasePayments();
    }

    @GetMapping("/sales")
    public List<Map<String, Object>> getSalesPayments() {
        return paymentService.getSalesPayments();
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPayment(
            @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(paymentService.createPayment(body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}