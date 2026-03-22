package com.example.schmidel.projeto_hospital.controllers;

import com.example.schmidel.projeto_hospital.dtos.AuthRequest;
import com.example.schmidel.projeto_hospital.dtos.AuthResponse;
import com.example.schmidel.projeto_hospital.security.JwtService;

import com.example.schmidel.projeto_hospital.services.PatrimonioService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*") // permite acesso do React
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        // 🔐 1️⃣ Autenticar usuário
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
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

    @GetMapping("/me")
    public ResponseEntity<?> usuarioLogado(Authentication authentication) {

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        return ResponseEntity.ok(Map.of(
                "username", userDetails.getUsername(),
                "roles", userDetails.getAuthorities()
        ));
    }
}
