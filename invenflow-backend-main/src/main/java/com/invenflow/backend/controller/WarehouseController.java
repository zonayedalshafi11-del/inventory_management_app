package com.invenflow.backend.controller;

import com.invenflow.backend.model.Warehouse;
import com.invenflow.backend.service.WarehouseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
@CrossOrigin(origins = "*")
public class WarehouseController {

    private final WarehouseService warehouseService;

    public WarehouseController(WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @GetMapping
    public List<Warehouse> getAllWarehouses() {
        return warehouseService.getAllWarehouses();
    }

    @PostMapping
    public Warehouse addWarehouse(@RequestBody Warehouse warehouse) {
        return warehouseService.addWarehouse(warehouse);
    }

    @PutMapping("/{id}")
    public Warehouse updateWarehouse(@PathVariable Long id, @RequestBody Warehouse warehouse) {
        warehouse.setId(id);
        return warehouseService.updateWarehouse(warehouse);
    }

    @DeleteMapping("/{id}")
    public void deleteWarehouse(@PathVariable Long id) {
        warehouseService.deleteWarehouse(id);
    }
}
