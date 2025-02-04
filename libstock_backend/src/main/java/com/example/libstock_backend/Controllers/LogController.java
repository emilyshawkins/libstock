package com.example.libstock_backend.Controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogController {

    @GetMapping("/logs")
    public ResponseEntity<String> getLogs() throws IOException {
        String logFilePath = "spring.log"; // Path to your log file
        String logs = new String(Files.readAllBytes(Paths.get(logFilePath)));
        return ResponseEntity.ok(logs);
    }
}