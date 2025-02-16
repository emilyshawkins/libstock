// Brandon Gascon - wrote //
// JWT DTO to retrieve token info from frontend //
package com.example.libstock_backend.DTOs;

public class JwtDTO {
    private final String token;

    // initialize the token
    public JwtDTO(String token) {
        this.token = token;
    }

    // get token value
    public String getToken() {
        return token;
    }
}
