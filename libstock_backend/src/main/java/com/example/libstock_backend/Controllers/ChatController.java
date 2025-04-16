package com.example.libstock_backend.Controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Value("${gemini.api.key}")
    private String AIzaSyDb8MhCkCyiTbVOnWKMlwUmOLwAMFafMuI;

    // Replace with the Gemini API endpoint you are targeting.
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

    public static class ChatRequest {
        public String message;
    }

    @PostMapping
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + AIzaSyDb8MhCkCyiTbVOnWKMlwUmOLwAMFafMuI);

        // Build the payload expected by Gemini.
        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "gemini-2.0-flash");
        payload.put("contents", request.message);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(GEMINI_API_URL, entity, String.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error communicating with Gemini API: " + e.getMessage());
        }
    }
}
