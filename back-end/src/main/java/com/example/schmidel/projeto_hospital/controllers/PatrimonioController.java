package com.example.schmidel.projeto_hospital.controllers;

import com.example.schmidel.projeto_hospital.dtos.PatrimonioRecordDto;
import com.example.schmidel.projeto_hospital.models.PatrimonioModel;
import com.example.schmidel.projeto_hospital.repositories.PatrimonioRepository;
import com.example.schmidel.projeto_hospital.services.PatrimonioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@RestController
@RequestMapping("/patrimonios")
@CrossOrigin(origins = "*")
public class PatrimonioController {

    private final
    PatrimonioRepository patrimonioRepository;

    private final
    PatrimonioService patrimonioService;

    public PatrimonioController(PatrimonioRepository patrimonioRepository, PatrimonioService patrimonioService) {
        this.patrimonioRepository = patrimonioRepository;
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
    public ResponseEntity<List<PatrimonioModel>> getPatrimoniosByName(@RequestParam(value = "nome") String name) {
        return ResponseEntity.status(HttpStatus.OK).body(patrimonioService.buscarPorNome(name));
    }

    //Get marca
    @GetMapping("/buscaMarca")
    public ResponseEntity<List<PatrimonioModel>> getPatrimoniosByMarca(@RequestParam(value = "marca") String marca) {
        return ResponseEntity.status(HttpStatus.OK).body(patrimonioService.buscarPorMarca(marca));
    }

    //Get etiqueta
    @GetMapping("etiqueta/{numeroEtiqueta}")
    public ResponseEntity<Object> getByEtiqueta(@PathVariable String numeroEtiqueta) {
        var p = patrimonioService.getOneEtiqueta(numeroEtiqueta);
        return p.<ResponseEntity<Object>>map(patrimonioModel -> ResponseEntity.status(HttpStatus.OK).body(patrimonioModel)).orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patrimônio com esta etiqueta não encontrado."));
    }

    //Att patrimônio
    @PutMapping("/{id}")
    public ResponseEntity<Object> updatePatrimonio(@PathVariable UUID id,
                                                   @RequestBody @Valid PatrimonioRecordDto patrimonioRecordDto) {
        return patrimonioService.update(id, patrimonioRecordDto)
                .<ResponseEntity<Object>>map(p -> ResponseEntity.status(HttpStatus.OK).body(p))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patrimônio não encontrado"));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Object> deletePatrimonio(@PathVariable UUID id){
        Optional<PatrimonioModel> patrimonio0 = patrimonioRepository.findById(id);
        if(patrimonio0.isEmpty()){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patrimônio não encontrado");
        }
        patrimonioRepository.delete((patrimonio0.get()));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
