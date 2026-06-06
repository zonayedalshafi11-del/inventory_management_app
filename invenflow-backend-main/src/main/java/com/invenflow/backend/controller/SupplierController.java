package com.invenflow.backend.controller;

import com.invenflow.backend.model.Supplier;
import com.invenflow.backend.service.SupplierService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierService.getAllSuppliers();
    }

    @PostMapping
    public Supplier addSupplier(@RequestBody Supplier supplier) {
        return supplierService.addSupplier(supplier);
    }

    @PutMapping("/{id}")
    public Supplier updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        supplier.setId(id);
        return supplierService.addSupplier(supplier);  // Reuse save method
    }

    @DeleteMapping("/{id}")
    public void deleteSupplier(@PathVariable Long id) {
        // Add delete method to SupplierService first
         supplierService.deleteSupplier(id);
    }

}
