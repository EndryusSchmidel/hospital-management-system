package com.example.schmidel.projeto_hospital.config;

import com.example.schmidel.projeto_hospital.security.JwtAuthFilter;
import com.example.schmidel.projeto_hospital.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;


@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public JwtAuthFilter jwtAuthFilter(
            JwtService jwtService,
            UserDetailsService userDetailsService
    ) {
        return new JwtAuthFilter(jwtService, userDetailsService);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // 🚀 Swagger e Docs - Unificado
                        .requestMatchers(
                                "/v3/api-docs",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()

                        // 🔓 Rotas Públicas
                        .requestMatchers("/auth/login", "/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/health").permitAll()

                        // 🔒 Rotas de Patrimônio (Acesso público para leitura conforme seu código anterior)
                        .requestMatchers(HttpMethod.GET, "/patrimonios/**").permitAll()

                        .anyRequest().authenticated()
                )
                // ... restante da configuração de exceptionHandling e sessionManagement
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 🔑 Necessário para autenticação no login
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    // 🔐 Encoder de senha (obrigatório no Spring moderno)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 👥 Usuários em memória
    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {

        UserDetails admin = User.builder()
                .username("admin@admin.com")
                .password(encoder.encode("141808"))
                .roles("ADMIN")
                .build();

        UserDetails teste = User.builder()
                .username("teste@teste.com")
                .password(encoder.encode("1234"))
                .roles("TESTE")
                .build();

        return new InMemoryUserDetailsManager(admin, teste);
    }
}



