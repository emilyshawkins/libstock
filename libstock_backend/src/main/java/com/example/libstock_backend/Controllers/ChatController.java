package com.example.libstock_backend.Controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api")
public class ChatController {

    @Value("${gemini.api.key}")
    private String apiKey;

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> request) {
        try {
            String userMessage = (String) request.get("message");

            // Prepare the Gemini API request
            String geminiUrl = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key="
                    + apiKey;

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> contentPart = new HashMap<>();
            contentPart.put("parts", List.of(Map.of("text", userMessage)));

            List<Map<String, Object>> contents = new ArrayList<>();
            contents.add(contentPart);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", contents);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Call Gemini API
            ResponseEntity<Map> geminiResponse = restTemplate.postForEntity(geminiUrl, entity, Map.class);

            // Extract the text response from Gemini
            Map<String, Object> responseData = geminiResponse.getBody();
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseData.get("candidates");
            Map<String, Object> candidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String text = (String) parts.get(0).get("text");

            // Return the response
            Map<String, Object> response = new HashMap<>();
            response.put("message", text);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to process chat request: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}