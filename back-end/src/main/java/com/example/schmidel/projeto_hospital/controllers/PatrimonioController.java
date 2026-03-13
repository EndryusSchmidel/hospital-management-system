package com.example.schmidel.projeto_hospital.controllers;

import com.example.schmidel.projeto_hospital.dto_auditoria.PatrimonioRecordDtoAuditoria;
import com.example.schmidel.projeto_hospital.dtos.PatrimonioRecordDto;
import com.example.schmidel.projeto_hospital.models.PatrimonioModel;
import com.example.schmidel.projeto_hospital.services.PatrimonioService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/patrimonios")
@CrossOrigin(origins = {"http://localhost:5173", "https://seu-projeto.vercel.app"})
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
    public ResponseEntity<List<PatrimonioModel>> getAllPatrimonios(){
        return ResponseEntity.status(HttpStatus.OK).body(patrimonioService.getAllPatrimonios());
    }

    //Get historico da tabela aud do hibernate
    @GetMapping("/historico-geral")
    public ResponseEntity<Page<PatrimonioRecordDtoAuditoria>> obterHistoricoGeral(
            @PageableDefault(size = 10, sort = "dataRevisao", direction = Sort.Direction.DESC)
            Pageable pageable) {

        Page<PatrimonioRecordDtoAuditoria> historico =
                patrimonioService.getHistoricoGeral(pageable);

        return ResponseEntity.ok(historico);
    }

    //Get id
    @GetMapping("/{id}")
    public ResponseEntity<Object> getOnePatrimonio(@PathVariable UUID id){
        var p = patrimonioService.getOnePatrimonio(id);
        //if(p.isEmpty()) {
        //            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patrimônio não encontrado.");
        //        }
        //        return ResponseEntity.status(HttpStatus.OK).body(p.get());
        return p.<ResponseEntity<Object>>map(patrimonioModel -> ResponseEntity.status(HttpStatus.OK).body(patrimonioModel)).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patrimônio não encontrado."));
    }

    //Get name
    @GetMapping("/buscaNome")
    public ResponseEntity<List<PatrimonioModel>> getPatrimoniosByName(@RequestParam(value = "name") String name) {
        return ResponseEntity.status(HttpStatus.OK).body(patrimonioService.buscarPorNome(name));
    }

    //Get marca
    @GetMapping("/buscaMarca")
    public ResponseEntity<List<PatrimonioModel>> getPatrimoniosByMarca(@RequestParam(value = "marca") String marca) {
        return ResponseEntity.status(HttpStatus.OK).body(patrimonioService.buscarPorMarca(marca));
    }

    //Get etiqueta
    @GetMapping("etiqueta/{etiqueta}")
    public ResponseEntity<Object> getByEtiqueta(@PathVariable String etiqueta) {
        var p = patrimonioService.getOneEtiqueta(etiqueta);
        return p.<ResponseEntity<Object>>map(patrimonioModel -> ResponseEntity.status(HttpStatus.OK).body(patrimonioModel)).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patrimônio com esta etiqueta não encontrado."));
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
    @DeleteMapping("{id}")
    public ResponseEntity<Object> deletePatrimonio(@PathVariable UUID id){
        boolean deleted = patrimonioService.deletePatrimonio(id);
        if (!deleted){
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Patrimônio não encontrado");
        }

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
