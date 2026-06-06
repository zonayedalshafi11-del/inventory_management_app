package com.invenflow.backend.repository;

import com.invenflow.backend.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Long> {
}
