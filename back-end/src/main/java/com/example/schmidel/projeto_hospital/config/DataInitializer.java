package com.example.schmidel.projeto_hospital.config;

import com.example.schmidel.projeto_hospital.models.Role;
import com.example.schmidel.projeto_hospital.models.Usuario;
import com.example.schmidel.projeto_hospital.repositories.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // 🛡️ Pegando as credenciais seguras do Render/IntelliJ
    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.test.username}")
    private String testUsername;

    @Value("${app.test.password}")
    private String testPassword;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Verifica se o banco de dados já tem o admin
        if (usuarioRepository.findByEmail(adminUsername).isEmpty()) {

            Usuario admin = Usuario.builder()
                    .email(adminUsername)
                    .senha(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .build();

            usuarioRepository.save(admin);
            System.out.println("✅ [SECURITY] Usuário ADMIN semeado no banco de dados com sucesso.");
        } else {
            System.out.println("ℹ️ [SECURITY] Usuário ADMIN já existe no banco. Pulando criação.");
        }

        if (usuarioRepository.findByEmail(testUsername).isEmpty()) {
            Usuario teste = Usuario.builder()
                    .email(testUsername)
                    .senha(passwordEncoder.encode(testPassword))
                    .role(Role.USER)
                    .build();
            usuarioRepository.save(teste);
            System.out.println("✅ [SECURITY] Usuário TESTE semeado no banco de dados com sucesso.\"");
        } else {
            System.out.println("ℹ️ [SECURITY] Usuário de TESTE já existe.");
        }
    }
}