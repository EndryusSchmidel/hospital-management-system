package com.example.schmidel.projeto_hospital.repositories;

import com.example.schmidel.projeto_hospital.models.PatrimonioModel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.history.RevisionRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatrimonioRepository extends
        JpaRepository<PatrimonioModel, UUID>,
        RevisionRepository<PatrimonioModel, UUID, Integer> {
    Page<PatrimonioModel> findByStatusIgnoreCase(String status, Pageable pageable);
    Page<PatrimonioModel> findByNameContainingIgnoreCase(String name, Pageable pageable);
    Page<PatrimonioModel> findByStatusIgnoreCaseAndNameContainingIgnoreCase(
            String status, String name, Pageable pageable);
}