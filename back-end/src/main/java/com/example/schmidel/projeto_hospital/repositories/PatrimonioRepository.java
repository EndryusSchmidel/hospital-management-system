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
    @Query("""
    SELECT p FROM PatrimonioModel p
    WHERE (:status IS NULL OR :status = '' OR LOWER(p.status) = LOWER(:status))
    AND (
        :busca IS NULL OR :busca = '' OR
        LOWER(p.name) LIKE LOWER(CONCAT('%', :busca, '%')) OR
        LOWER(p.marca) LIKE LOWER(CONCAT('%', :busca, '%')) OR
        LOWER(p.etiqueta) LIKE LOWER(CONCAT('%', :busca, '%')) OR
        LOWER(p.setor) LIKE LOWER(CONCAT('%', :busca, '%'))
    )
""")
    Page<PatrimonioModel> buscarComFiltro(
            @Param("status") String status,
            @Param("busca") String busca,
            Pageable pageable
    );}