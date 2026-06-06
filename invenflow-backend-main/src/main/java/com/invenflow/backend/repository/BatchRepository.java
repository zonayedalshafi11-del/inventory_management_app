package com.invenflow.backend.repository;

import com.invenflow.backend.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BatchRepository extends JpaRepository<Batch, Long> {
}
