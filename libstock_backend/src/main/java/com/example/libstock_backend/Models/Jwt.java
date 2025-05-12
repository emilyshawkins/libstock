// Brandon Gascon - wrote //
// This is the model for the JWT token, used to authenticate user and user session //
package com.example.libstock_backend.Models;

import java.time.LocalDateTime; // used to keep track of token experation // 

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Jwt")
public class Jwt {
    @Id   
    private String id; // mongo-db unique identifier for token //
    private String token; // the token itself //
    private String userId; // refrence user with a token //
    private LocalDateTime expiration; // keeps track of refresh token expiration //

    public Jwt(String token, String userId, LocalDateTime expiration) {
        this.token = token;
        this.userId = userId;
        this.expiration = expiration;
    }

    public String getId() {
        return id;
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    public String getUser() {
        return userId;
    }
    public void setUser(String userId) {
        this.userId = userId;
    }

    public LocalDateTime getExpiration() {
        return expiration;
    }
    public void setExpiration(LocalDateTime expiration) {
        this.expiration = expiration;
    }
}