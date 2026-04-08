package com.example.schmidel.projeto_hospital.services;

import com.example.schmidel.projeto_hospital.dtos.PatrimonioRecordDto;
import com.example.schmidel.projeto_hospital.models.PatrimonioModel;
import com.example.schmidel.projeto_hospital.repositories.PatrimonioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class) // Habilita o uso do Mockito com JUnit 5
class PatrimonioServiceTest {

    @Mock
    private PatrimonioRepository patrimonioRepository; // "Finge" o repositório

    @InjectMocks
    private PatrimonioService patrimonioService; // Injeta o mock acima dentro do service

    @Test
    @DisplayName("Deve salvar um patrimônio com sucesso")
    void deveSalvarPatrimonioComSucesso() {
        // ARRANGE (Preparação)
        PatrimonioRecordDto dto = new PatrimonioRecordDto(
                "Monitor Dell", "Dell", "DET-123", "TI", "ativo", new BigDecimal("1200.00")
        );

        PatrimonioModel modelSalvo = new PatrimonioModel();
        modelSalvo.setIdPatrimonio(UUID.randomUUID());
        modelSalvo.setName(dto.name());
        modelSalvo.setEtiqueta(dto.etiqueta());

        // Quando o repository.save for chamado com qualquer objeto, retorne o modelSalvo
        when(patrimonioRepository.save(any(PatrimonioModel.class))).thenReturn(modelSalvo);

        // ACT (Ação)
        PatrimonioModel resultado = patrimonioService.save(dto);

        // ASSERT (Verificação)
        assertNotNull(resultado);
        assertEquals(dto.name(), resultado.getName());
        assertNotNull(resultado.getIdPatrimonio());

        // Verifica se o método save do repository foi chamado exatamente 1 vez
        verify(patrimonioRepository, times(1)).save(any(PatrimonioModel.class));
    }

    @Test
    @DisplayName("Deve retornar true ao deletar um patrimônio existente")
    void deveDeletarPatrimonioComSucesso() {
        // ARRANGE
        UUID id = UUID.randomUUID();
        PatrimonioModel p = new PatrimonioModel();
        p.setIdPatrimonio(id);

        when(patrimonioRepository.findById(id)).thenReturn(Optional.of(p));
        doNothing().when(patrimonioRepository).delete(p);

        // ACT
        boolean deletado = patrimonioService.deletePatrimonio(id);

        // ASSERT
        assertTrue(deletado);
        verify(patrimonioRepository, times(1)).delete(p);
    }

    @Test
    @DisplayName("Deve retornar false ao tentar deletar um patrimônio que não existe")
    void deveRetornarFalseAoDeletarInexistente() {
        // ARRANGE
        UUID id = UUID.randomUUID();
        when(patrimonioRepository.findById(id)).thenReturn(Optional.empty());

        // ACT
        boolean deletado = patrimonioService.deletePatrimonio(id);

        // ASSERT
        assertFalse(deletado);
        // Garante que o método delete NUNCA foi chamado, já que o ID não existia
        verify(patrimonioRepository, never()).delete(any());
    }

    @Test
    @DisplayName("Deve atualizar um patrimônio existente com sucesso")
    void deveAtualizarPatrimonioComSucesso() {
        UUID id = UUID.randomUUID();
        PatrimonioRecordDto dtoAtualizado = new PatrimonioRecordDto(
                "Monitor Gamer", "LG", "LG-999", "TI", "ativo", new BigDecimal("1500.00")
        );

        PatrimonioModel patrimonioExistente = new PatrimonioModel();
        patrimonioExistente.setIdPatrimonio(id);
        patrimonioExistente.setName("Monitor Antigo");
        patrimonioExistente.setEtiqueta("LG-000");

        when(patrimonioRepository.findById(id)).thenReturn(Optional.of(patrimonioExistente));

        when(patrimonioRepository.save(any(PatrimonioModel.class))).thenAnswer(i -> i.getArguments()[0]);

        Optional<PatrimonioModel> resultado = patrimonioService.updatePatrimonio(id, dtoAtualizado);

        assertTrue(resultado.isPresent());
        assertEquals("Monitor Gamer", resultado.get().getName());
        assertEquals("LG-999", resultado.get().getEtiqueta());

        verify(patrimonioRepository, times(1)).findById(id);
        verify(patrimonioRepository, times(1)).save(any(PatrimonioModel.class));
    }

    @Test
    @DisplayName("Deve retornar vazio ao tentar atualizar patrimônio inexistente")
    void deveRetornarVazioAoAtualizarInexistente() {
        // ARRANGE
        UUID id = UUID.randomUUID();
        PatrimonioRecordDto dto = new PatrimonioRecordDto(
                "Nome", "Marca", "Etiq", "Setor", "ativo", BigDecimal.ZERO
        );

        when(patrimonioRepository.findById(id)).thenReturn(Optional.empty());

        // ACT
        Optional<PatrimonioModel> resultado = patrimonioService.updatePatrimonio(id, dto);

        // ASSERT
        assertTrue(resultado.isEmpty());
        // Importante: Se não achou, o método save NUNCA deve ser chamado
        verify(patrimonioRepository, never()).save(any());
    }
}