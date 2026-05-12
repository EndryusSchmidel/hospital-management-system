package com.example.schmidel.projeto_hospital.services;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TelegramService {

    // 🚨 SUBSTITUA PELOS SEUS DADOS REAIS
    private final String BOT_TOKEN = "8612177012:AAFFPUYcpyVghHBJjAn1UiOKVYoBQAQwaok";
    private final String CHAT_ID = "7193248811";

    public void sendAlert(String message) {
        String url = "https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage?chat_id=" + CHAT_ID + "&text=" + message;

        try {
            RestTemplate restTemplate = new RestTemplate();
            restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            System.err.println("Erro ao enviar alerta para o Telegram: " + e.getMessage());
        }
    }
}