// Brandon Gascon - wrote //
// This is the model for the JWT token, used to authenticate user and user session //
package com.example.libstock_backend.Models;

import java.util.Date; // used to keep track of token experation // 

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Jwt")
public class Jwt {
    @Id   
    private String id; // mongo-db unique identifier for token //
    private String token; // the token itself //
    private String user; // refrence user with a token //
    private Date expiration; // keeps track of refresh token expiration //

    public Jwt(String token, String user, Date expiration) {
        this.token = token;
        this.user = user;
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
        return user;
    }
    public void setUser(String user) {
        this.user = user;
    }

    public Date getExpiration() {
        return expiration;
    }
    public void setExpiration(Date expiration) {
        this.expiration = expiration;
    }
}