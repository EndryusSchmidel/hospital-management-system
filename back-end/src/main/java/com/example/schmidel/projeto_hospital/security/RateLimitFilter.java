package com.example.schmidel.projeto_hospital.security;

import com.example.schmidel.projeto_hospital.services.TelegramService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    // 🧠 Mapa para guardar: IP -> Quantidade de tentativas
    private final ConcurrentHashMap<String, AtomicInteger> attempts = new ConcurrentHashMap<>();
    private final int MAX_ATTEMPTS = 5;
    private static final Logger logger = LoggerFactory.getLogger(RateLimitFilter.class);

    @Autowired
    private TelegramService telegramService;


    @Scheduled(fixedDelay = 900000) //
    public void clearAttempts() {
        attempts.clear();
        logger.info("Memória de Rate Limit limpa com sucesso.");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        logger.info("Rota: [{}]", path);
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty()){
            clientIp = request.getRemoteAddr();
        } else {
            clientIp = clientIp.split(",")[0];
        }

        boolean isAuthRoute = "/auth/login".equals(path) || "/auth/register".equals(path);
        // 🎯 Alvo: Apenas a rota de login
        if (isAuthRoute) {
            attempts.putIfAbsent(clientIp, new AtomicInteger(0));
            int currentAttempts = attempts.get(clientIp).incrementAndGet();

            if (currentAttempts > MAX_ATTEMPTS) {
                if (currentAttempts == MAX_ATTEMPTS + 1) {
                    // 🚫 BLOQUEIO: Retorna 429 Too Many Requests
                    String action = path.contains("login") ? "LOGIN" : "REGISTRO";
                    String msg = "Alerta: Tentativa de brute force detectada! IP: " + clientIp + " foi banido temporariamente por excesso de tentativas!";
                    telegramService.sendAlert(msg);
                    logger.error("!!! ALERTA DE SEGURANÇA: Possível Brute Force detectado do IP: {} na rota: {}", clientIp, path);

                }
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Muitas tentativas. Seu IP foi bloqueado.\"}");
                return; // Mata a requisição aqui, ela nem chega no Spring Security
            }
        }

        filterChain.doFilter(request, response);
    }
}