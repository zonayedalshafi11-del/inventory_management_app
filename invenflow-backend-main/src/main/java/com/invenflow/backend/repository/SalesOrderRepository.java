package com.invenflow.backend.repository;

import com.invenflow.backend.model.SalesOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalesOrderRepository extends JpaRepository<SalesOrder, Long> {
}
