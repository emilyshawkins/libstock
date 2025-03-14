// Brandon Gascon - wrote //
// JWT DTO to retrieve token info from frontend //
package com.example.libstock_backend.DTOs;

public class JwtDTO {
    private final String token;
    private Date expiration;

    // initialize the token
    public JwtDTO(String token, Date expiration) {
        this.token = token;
        this.expiration = expiration;
    }

    // get token value
    public String getToken() {
        return token;
    }
    // get expiration value
    public String getExpiration() {
        return expiration;
    }    
}
