package com.example.schmidel.projeto_hospital.repositories;

import com.example.schmidel.projeto_hospital.models.PatrimonioModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PatrimonioRepository extends JpaRepository<PatrimonioModel, UUID> {
    List<PatrimonioModel> findByMarca(String marca);
    List<PatrimonioModel> findByNameContainingIgnoreCase(String name);
    List<PatrimonioModel> findByMarcaContainingIgnoreCase(String marca);
    Optional<PatrimonioModel> findByNumeroEtiqueta(String numeroEtiqueta);
}
