package com.example.schmidel.projeto_hospital.dto_auditoria;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PatrimonioRecordDtoAuditoria(
    UUID idPatrimonio,
    String name,
    String marca,
    String etiqueta,
    String setor,
    String status,
    BigDecimal valor,
    LocalDateTime dataRevisao,
    int revisaoNumero
) {}
