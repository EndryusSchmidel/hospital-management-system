package com.example.schmidel.projeto_hospital.services;

import com.example.schmidel.projeto_hospital.controllers.PatrimonioController;
import com.example.schmidel.projeto_hospital.dtos.PatrimonioRecordDto;
import com.example.schmidel.projeto_hospital.models.PatrimonioModel;
import com.example.schmidel.projeto_hospital.repositories.PatrimonioRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

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

    //Get all
    public List<PatrimonioModel> getAllPatrimonios(){
        List<PatrimonioModel> patrimonioList = patrimonioRepository.findAll();
        if (!patrimonioList.isEmpty()) {
            for (PatrimonioModel patrimonio : patrimonioList){
                patrimonio.add(linkTo(methodOn(PatrimonioController.class).getOnePatrimonio(patrimonio.getIdPatrimonio())).withSelfRel());
            }
        }
        return patrimonioList;
    }

    //Get por id
    public Optional<PatrimonioModel> getOnePatrimonio(@PathVariable UUID id){
        Optional<PatrimonioModel> patrimonioO = patrimonioRepository.findById(id);
        patrimonioO.ifPresent(p -> p.add(linkTo(methodOn(PatrimonioController.class).getAllPatrimonios()).withRel("Lista de Patrimônios")));
        return patrimonioO;
    }

    //Get por nome
    public List<PatrimonioModel> buscarPorNome(String name) {
        List<PatrimonioModel> resultados = patrimonioRepository.findByNameContainingIgnoreCase(name);
        resultados.forEach(p -> p.add(linkTo(methodOn(PatrimonioController.class).getOnePatrimonio(p.getIdPatrimonio())).withSelfRel()));
        return resultados;
    }

    //Get por marca
    public List<PatrimonioModel> buscarPorMarca(String marca) {
        List<PatrimonioModel> resultados = patrimonioRepository.findByMarcaContainingIgnoreCase(marca);
        resultados.forEach(p -> p.add(linkTo(methodOn(PatrimonioController.class).getOnePatrimonio(p.getIdPatrimonio())).withSelfRel()));
        return resultados;
    }

    //Get por etiqueta
    public Optional<PatrimonioModel> getOneEtiqueta(@PathVariable String numeroEtiqueta){
        Optional<PatrimonioModel> patrimonioO = patrimonioRepository.findByNumeroEtiqueta(numeroEtiqueta);
        patrimonioO.ifPresent(p -> p.add(linkTo(methodOn(PatrimonioController.class).getAllPatrimonios()).withRel("Lista de Patrimônios")));
        return patrimonioO;
    }

    //Update no Service
    public Optional<PatrimonioModel> update(UUID id, PatrimonioRecordDto patrimonioRecordDto) {
        Optional<PatrimonioModel> patrimonioO = patrimonioRepository.findById(id);
        if (patrimonioO.isPresent()) {
            var patrimonioModel = patrimonioO.get();
            BeanUtils.copyProperties(patrimonioRecordDto, patrimonioModel);
            PatrimonioModel atualizado = patrimonioRepository.save(patrimonioModel);
            atualizado.add(linkTo(methodOn(PatrimonioController.class).getOnePatrimonio(id)).withSelfRel());
            return Optional.of(atualizado);
        }
        return Optional.empty();
    }

}
