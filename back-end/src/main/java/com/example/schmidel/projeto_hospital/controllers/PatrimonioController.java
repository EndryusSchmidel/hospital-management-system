package com.example.schmidel.projeto_hospital.controllers;

import com.example.schmidel.projeto_hospital.dto_auditoria.PatrimonioRecordDtoAuditoria;
import com.example.schmidel.projeto_hospital.dtos.PatrimonioRecordDto;
import com.example.schmidel.projeto_hospital.models.PatrimonioModel;
import com.example.schmidel.projeto_hospital.services.PatrimonioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/patrimonios")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "https://hospital-management-system-gilt-kappa.vercel.app"
})
@Tag(name = "Patrimônios", description = "Endpoints para gestão de bens hospitalares")
public class PatrimonioController {

    private final PatrimonioService patrimonioService;

    public PatrimonioController(PatrimonioService patrimonioService) {
        this.patrimonioService = patrimonioService;
    }

    @Operation(summary = "Cadastrar novo patrimônio")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    public ResponseEntity<PatrimonioModel> savePatrimonio(@RequestBody @Valid PatrimonioRecordDto patrimonioRecordDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patrimonioService.save(patrimonioRecordDto));
    }

    @Operation(summary = "Listar patrimônios com filtro e paginação")
    @GetMapping
    public ResponseEntity<Page<PatrimonioModel>> listar(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String busca,
            Pageable pageable
    ) {
        return ResponseEntity.ok(patrimonioService.listarComFiltro(status, busca, pageable));
    }

    @Operation(summary = "Obter histórico geral de auditoria (Hibernate Envers)")
    @GetMapping("/historico-geral")
    public ResponseEntity<Page<PatrimonioRecordDtoAuditoria>> obterHistoricoGeral(
            @RequestParam(required = false) String busca,
            @PageableDefault(size = 10, sort = "dataRevisao", direction = Sort.Direction.DESC)
            Pageable pageable) {
        return ResponseEntity.ok(patrimonioService.getHistoricoGeral(pageable, busca));
    }

    @Operation(summary = "Obter histórico de um patrimônio específico")
    @GetMapping("/{id}/historico")
    public ResponseEntity<List<PatrimonioRecordDtoAuditoria>> obterHistorico(@PathVariable(value = "id") UUID id) {
        return ResponseEntity.ok(patrimonioService.getHistorico(id));
    }

    @Operation(summary = "Atualizar dados de um patrimônio")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<Object> updatePatrimonio(@PathVariable UUID id,
                                                   @RequestBody @Valid PatrimonioRecordDto patrimonioRecordDto) {
        return patrimonioService.updatePatrimonio(id, patrimonioRecordDto)
                .<ResponseEntity<Object>>map(p -> ResponseEntity.status(HttpStatus.OK).body(p))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patrimônio não encontrado"));
    }

    @Operation(summary = "Deletar um patrimônio (Apenas ADMIN)")
    @SecurityRequirement(name = "bearerAuth")
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deletePatrimonio(@PathVariable UUID id){
        boolean deleted = patrimonioService.deletePatrimonio(id);
        if (!deleted){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patrimônio não encontrado");
        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Operation(summary = "Gerar PDF do inventário atual")
    @GetMapping("/relatorio")
    public void gerarRelatorioGeral(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String busca,
            HttpServletResponse response) throws IOException {

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=inventario_patrimonio.pdf");

        Pageable total = PageRequest.of(0, Integer.MAX_VALUE);
        List<PatrimonioModel> lista = patrimonioService.listarComFiltro(status, busca, total).getContent();

        patrimonioService.exportarPatrimoniosPdf(response, lista);
        response.flushBuffer();
    }

    @Operation(summary = "Gerar PDF do histórico de movimentações")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/relatorio-historico")
    public void gerarRelatorioHistorico(
            @RequestParam(required = false) String busca,
            HttpServletResponse response) throws IOException {

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=historico_patrimonio.pdf");

        Pageable total = PageRequest.of(0, Integer.MAX_VALUE);
        List<PatrimonioRecordDtoAuditoria> dadosFiltrados =
                patrimonioService.getHistoricoGeral(total, busca).getContent();

        patrimonioService.exportarHistoricoParaPdf(response, dadosFiltrados);
    }
}