package com.example.libstock_backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Jwt")
public class Jwt {
    @Id   
    private String token;

    public Jwt(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
}