package com.example.schmidel.projeto_hospital.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "API do Sistema Hospitalar - HMS",
                description = "Documentação completa da API de Gestão de Patrimônios Hospitalares. Contempla autenticação JWT, auditoria com Envers e geração de PDFs.",
                version = "1.0",
                contact = @Contact(
                        name = "Endryus Schmidel",
                        url = "https://github.com/EndryusSchmidel"
                )
        ),
        servers = {
                @Server(url = "http://localhost:8080", description = "Ambiente de Desenvolvimento (Local)"),
                @Server(url = "https://hospital-management-system-7gyi.onrender.com", description = "Ambiente de Produção (Render)")
        }
)
@SecurityScheme(
        name = "bearerAuth",
        description = "Autenticação JWT. Faça o login em /auth/login para pegar o token, digite Bearer [espaço] e cole o token aqui.",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
}