package com.example.libstock_backend.DTOs;

public class JwtDTO {
    private String token;

    // Constructor to initialize the token
    public JwtDTO(String token) {
        this.token = token;
    }

    // Get the token value
    public String getToken() {
        return token;
    }

    // Set a new token value
    public void setToken(String token) {
        this.token = token;
    }
}
