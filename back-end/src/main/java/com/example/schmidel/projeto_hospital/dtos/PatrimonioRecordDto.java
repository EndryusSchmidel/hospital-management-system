package com.example.schmidel.projeto_hospital.dtos;

import jakarta.validation.constraints.NotBlank;

public record PatrimonioRecordDto(
        @NotBlank(message = "O nome do patrimônio é obrigatório.")
        String name,
        @NotBlank(message = "A marca deve ser informada.")
        String marca,
        @NotBlank(message = "O número da etiqueta não pode estar em branco.")
        String numeroEtiqueta
) {
}
