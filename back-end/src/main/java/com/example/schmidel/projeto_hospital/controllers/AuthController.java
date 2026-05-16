package com.example.schmidel.projeto_hospital.controllers;

import com.example.schmidel.projeto_hospital.dtos.AuthRequest;
import com.example.schmidel.projeto_hospital.dtos.AuthResponse;
import com.example.schmidel.projeto_hospital.dtos.RegistroRequest;
import com.example.schmidel.projeto_hospital.models.Role;
import com.example.schmidel.projeto_hospital.models.Usuario;
import com.example.schmidel.projeto_hospital.repositories.UsuarioRepository;
import com.example.schmidel.projeto_hospital.security.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // permite acesso do React
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    @Operation(summary = "Realizar login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        // 🔐 1️⃣ Autenticar usuário
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 📌 2️⃣ Pegar dados do usuário autenticado
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 🎟️ 3️⃣ Gerar token JWT
        String token = jwtService.generateToken(userDetails);

        // 📤 4️⃣ Retornar token
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegistroRequest request) {
        // 🛡️ SEGURANÇA: Verifica se o e-mail já existe
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Erro: E-mail já cadastrado!");
        }

        Usuario novoUsuario = Usuario.builder()
                .email(request.getEmail())
                .senha(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        usuarioRepository.save(novoUsuario);
        return ResponseEntity.ok("Usuário registrado com sucesso!");
    }

    @GetMapping("/me")
    @Operation(summary = "Verificar dados do usuário logado")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<?> usuarioLogado(Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        return ResponseEntity.ok(Map.of(
                "username", userDetails.getUsername(),
                "roles", userDetails.getAuthorities()
        ));
    }
}
