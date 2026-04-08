package com.example.schmidel.projeto_hospital.dtos;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record PatrimonioRecordDto(
        @NotBlank(message = "O nome do patrimônio é obrigatório.")
        String name,
        @NotBlank(message = "A marca deve ser informada.")
        String marca,
        @NotBlank(message = "O número da etiqueta não pode estar em branco.")
        String etiqueta,
        @NotBlank String setor,
        @NotBlank String status,
        BigDecimal valor
) {
}
