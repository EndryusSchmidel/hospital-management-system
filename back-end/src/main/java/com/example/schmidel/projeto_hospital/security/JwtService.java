package com.example.schmidel.projeto_hospital.security;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    // 🔐 Chave secreta para assinar o token
    private static final String SECRET_KEY =
            "minha-chave-super-secreta-para-assinar-token-jwt-123456";

    // 🔑 Converte a chave String em chave criptográfica
    private Key getSignKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    // 🚀 Gerar token
    public String generateToken(UserDetails userDetails) {

        return Jwts.builder()
                .setSubject(userDetails.getUsername()) // email do usuário
                .claim("role", userDetails.getAuthorities())
                .setIssuedAt(new Date()) // data de criação
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hora
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 📌 Extrair username do token
    public String extractUsername(String token) {

        return extractAllClaims(token).getSubject();
    }

    // 📦 Extrair todas as informações do token
    private Claims extractAllClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // 🔹 Verificar se token é válido
    public boolean isTokenValid(String token, UserDetails userDetails) {

        final String username = extractUsername(token);

        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // ⏳ Verificar se token expirou
    public boolean isTokenExpired(String token) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }
}
