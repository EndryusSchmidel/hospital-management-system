package com.example.schmidel.projeto_hospital.dtos;

import com.example.schmidel.projeto_hospital.models.Role;
import lombok.Data;

@Data
public class RegistroRequest {
    private String email;
    private String password;
}