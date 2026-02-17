package com.example.schmidel.projeto_hospital.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.hateoas.RepresentationModel;

import java.io.Serial;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "tb_patrimonios")
public class PatrimonioModel extends RepresentationModel<PatrimonioModel> {

    private static final long SerialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID idPatrimonio;
    private String name;
    private String marca;
    @Column(nullable = false, unique = true) // 'unique' impede dois aparelhos com a mesma etiqueta
    private String numeroEtiqueta;
//  private String setorPatrimonio;
}
