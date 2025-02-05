package com.example.libstock_backend.DTOs;

public class JwtDTO {
    private String token;

    // initialize the token
    public JwtDTO(String token) {
        this.token = token;
    }

    // get token value
    public String getToken() {
        return token;
    }

    // to set token value upon refresh or generation
    public void setToken(String token) {
        this.token = token;
    }
}
