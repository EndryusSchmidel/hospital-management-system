package com.example.schmidel.projeto_hospital.services;

import com.example.schmidel.projeto_hospital.controllers.PatrimonioController;
import com.example.schmidel.projeto_hospital.dto_auditoria.PatrimonioRecordDtoAuditoria;
import com.example.schmidel.projeto_hospital.dtos.PatrimonioRecordDto;
import com.example.schmidel.projeto_hospital.models.PatrimonioModel;
import com.example.schmidel.projeto_hospital.repositories.PatrimonioRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;

import java.math.BigDecimal;
import java.time.ZoneId;
import java.util.*;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@Transactional
@Service
public class PatrimonioService {

    private final
    PatrimonioRepository patrimonioRepository;

    public PatrimonioService(PatrimonioRepository patrimonioRepository) {
        this.patrimonioRepository = patrimonioRepository;
    }

    //Post
    public PatrimonioModel save(PatrimonioRecordDto patrimonioRecordDto) {
        var patrimonioModel = new PatrimonioModel();
        BeanUtils.copyProperties(patrimonioRecordDto, patrimonioModel);
        return patrimonioRepository.save(patrimonioModel);
    }


    //Update no Service
    public Optional<PatrimonioModel> updatePatrimonio(UUID id, PatrimonioRecordDto dto) {
        return patrimonioRepository.findById(id)
                .map(patrimonio -> {
                    BeanUtils.copyProperties(dto, patrimonio);
                    return patrimonioRepository.save(patrimonio);
                });
    }

    //Delete
    @Transactional
    public boolean deletePatrimonio(UUID id) {
        Optional<PatrimonioModel> patrimonioO = patrimonioRepository.findById(id);
        if (patrimonioO.isEmpty()) {
            return false;
        }
        patrimonioRepository.delete(patrimonioO.get());
        return true;
    }

    //Get all
    @Transactional(readOnly = true)
    public Page<PatrimonioModel> listarComFiltro(
            String status,
            String busca,
            Pageable pageable
    ) {
        return patrimonioRepository.buscarComFiltro(status, busca, pageable);
    }



    // Get historico geral
    @Transactional(readOnly = true)
    public Page<PatrimonioRecordDtoAuditoria> getHistoricoGeral(Pageable pageable) {

        AuditReader reader = AuditReaderFactory.get(entityManager);

        List<Object[]> resultados = reader.createQuery()
                .forRevisionsOfEntity(PatrimonioModel.class, false, true)
                .getResultList();

        List<PatrimonioRecordDtoAuditoria> historico = new ArrayList<>();

        for (Object[] row : resultados) {

            PatrimonioModel p = (PatrimonioModel) row[0];
            org.hibernate.envers.DefaultRevisionEntity revEntity =
                    (org.hibernate.envers.DefaultRevisionEntity) row[1];
            org.hibernate.envers.RevisionType tipo =
                    (org.hibernate.envers.RevisionType) row[2];

            if (tipo == org.hibernate.envers.RevisionType.DEL && p != null) {
                int revAnterior = revEntity.getId() - 1;
                try {
                    PatrimonioModel estadoAnterior =
                            reader.find(PatrimonioModel.class, p.getIdPatrimonio(), revAnterior);

                    if (estadoAnterior != null) {
                        p = estadoAnterior;
                    }
                } catch (Exception ignored) {}
            }

            historico.add(new PatrimonioRecordDtoAuditoria(
                    (p != null) ? p.getIdPatrimonio() : null,
                    (p != null) ? p.getName() : "Patrimônio Excluído",
                    (p != null) ? p.getMarca() : "---",
                    (p != null) ? p.getEtiqueta() : "---",
                    (p != null) ? p.getSetor() : "---",
                    (p != null) ? p.getStatus() : "---",
                    (p != null) ? p.getValor() : BigDecimal.ZERO,
                    reader.getRevisionDate(revEntity.getId())
                            .toInstant()
                            .atZone(ZoneId.systemDefault())
                            .toLocalDateTime(),
                    tipo.ordinal()
            ));
        }

        Collections.reverse(historico);

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), historico.size());

        List<PatrimonioRecordDtoAuditoria> pageContent =
                historico.subList(start, end);

        return new PageImpl<>(pageContent, pageable, historico.size());
    }


    @PersistenceContext
    private EntityManager entityManager;
    @Transactional(readOnly = true)
    public List<PatrimonioRecordDtoAuditoria> getHistorico(UUID id) {
        AuditReader reader = AuditReaderFactory.get(entityManager);

        // Busca todas as revisões desse UUID específico
        List<Number> revisoes = reader.getRevisions(PatrimonioModel.class, id);
        List<PatrimonioRecordDtoAuditoria> historicoUnico = new ArrayList<>();

        for (Number rev : revisoes) {
            // Busca o estado do patrimônio naquela revisão
            PatrimonioModel p = reader.find(PatrimonioModel.class, id, rev);
            // Busca a data da revisão
            Date data = reader.getRevisionDate(rev);

            historicoUnico.add(new PatrimonioRecordDtoAuditoria(
                    p.getIdPatrimonio(), // Pegando do seu campo idPatrimonio
                    p.getName(),
                    p.getMarca(),
                    p.getEtiqueta(),
                    p.getSetor(),
                    p.getStatus(),
                    p.getValor(),
                    data.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(),
                    rev.intValue()
            ));
        }
        return historicoUnico;
    }
}
