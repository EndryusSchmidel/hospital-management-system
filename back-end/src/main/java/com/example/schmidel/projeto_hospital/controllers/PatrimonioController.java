package com.example.schmidel.projeto_hospital.controllers;

import com.example.schmidel.projeto_hospital.dto_auditoria.PatrimonioRecordDtoAuditoria;
import com.example.schmidel.projeto_hospital.dtos.PatrimonioRecordDto;
import com.example.schmidel.projeto_hospital.models.PatrimonioModel;
import com.example.schmidel.projeto_hospital.services.PatrimonioService;
import io.jsonwebtoken.io.IOException;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/patrimonios")
@CrossOrigin(origins = {"http://localhost:5173", "https://hospital-management-system-gilt-kappa.vercel.app"})
public class PatrimonioController {

    private final
    PatrimonioService patrimonioService;

    public PatrimonioController(PatrimonioService patrimonioService) {

        this.patrimonioService = patrimonioService;
    }

    //Post

    @PostMapping
    public ResponseEntity<PatrimonioModel> savePatrimonio(@RequestBody @Valid PatrimonioRecordDto patrimonioRecordDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patrimonioService.save(patrimonioRecordDto));
    }

    //Get all
    @GetMapping
    public ResponseEntity<Page<PatrimonioModel>> listar(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String busca,
            Pageable pageable
    ) {

        Page<PatrimonioModel> page =
                patrimonioService.listarComFiltro(status, busca, pageable);

        return ResponseEntity.ok(page);
    }
    //Get historico da tabela aud do hibernate
    @GetMapping("/historico-geral")
    public ResponseEntity<Page<PatrimonioRecordDtoAuditoria>> obterHistoricoGeral(
            @RequestParam(required = false) String busca,
            @PageableDefault(size = 10, sort = "dataRevisao", direction = Sort.Direction.DESC)
            Pageable pageable) {

        Page<PatrimonioRecordDtoAuditoria> historico =
                patrimonioService.getHistoricoGeral(pageable, busca);

        return ResponseEntity.ok(historico);
    }




    //Get historico unico
    @GetMapping("/{id}/historico")
    public ResponseEntity<List<PatrimonioRecordDtoAuditoria>> obterHistorico(@PathVariable(value = "id") UUID id) {
        List<PatrimonioRecordDtoAuditoria> historicoUnico = patrimonioService.getHistorico(id);
        return ResponseEntity.ok(historicoUnico);
    }

    //Att patrimônio

    @PutMapping("/{id}")
    public ResponseEntity<Object> updatePatrimonio(@PathVariable UUID id,
                                                   @RequestBody @Valid PatrimonioRecordDto patrimonioRecordDto) {
        return patrimonioService.updatePatrimonio(id, patrimonioRecordDto)
                .<ResponseEntity<Object>>map(p -> ResponseEntity.status(HttpStatus.OK).body(p))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patrimônio não encontrado"));
    }

    //Del
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("{id}")
    public ResponseEntity<Object> deletePatrimonio(@PathVariable UUID id){
        boolean deleted = patrimonioService.deletePatrimonio(id);
        if (!deleted){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Patrimônio não encontrado");
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @RestController
    @RequestMapping("/login")
    public class AuthController {

        @PostMapping
        public ResponseEntity<String> login() {
            return ResponseEntity.ok("Login realizado com sucesso");
        }
    }

    @GetMapping("/relatorio")
    public void gerarRelatorioGeral(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String busca,
            HttpServletResponse response) throws IOException, java.io.IOException {

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=inventario_patrimonio.pdf");

        // Buscamos todos os registros filtrados (sem paginação para o PDF sair completo)
        Pageable total = PageRequest.of(0, Integer.MAX_VALUE);
        List<PatrimonioModel> lista = patrimonioService.listarComFiltro(status, busca, total).getContent();

        patrimonioService.exportarPatrimoniosPdf(response, lista);
        response.flushBuffer();
    }

    @GetMapping("/relatorio-historico")
    public void gerarRelatorioHistorico(
            @RequestParam(required = false) String busca,
            HttpServletResponse response) throws IOException, java.io.IOException {

        response.setContentType("application/pdf");
        String headerKey = "Content-Disposition";
        String headerValue = "attachment; filename=historico_patrimonio.pdf";
        response.setHeader(headerKey, headerValue);

        Pageable total = PageRequest.of(0, Integer.MAX_VALUE);
        List<PatrimonioRecordDtoAuditoria> dadosFiltrados =
                patrimonioService.getHistoricoGeral(total, busca).getContent();

        patrimonioService.exportarHistoricoParaPdf(response, dadosFiltrados);
    }
}
