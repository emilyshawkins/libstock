// Brandon Gascon - wrote //
// Authenticaion DTO to retrieve info from frontend for validation, token and user info //
package com.example.libstock_backend.DTOs;
import java.time.LocalDateTime; // used to keep track of token experation // 

public class AuthenticationDTO {

    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private boolean isAdmin;
    private String image;

    private String token;
    private LocalDateTime expiration;

    public AuthenticationDTO() {}

    public AuthenticationDTO(String id, String email, String firstName, String lastName, boolean isAdmin, String image, String token, LocalDateTime expiration) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isAdmin = isAdmin;
        this.image = image;
        this.token = token;
        this.expiration = expiration;
    }

    public String getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public String getImage() {
        return image;
    }

    // get token value
    public final String getToken() {
        return token;
    }
    // get expiration value
    public LocalDateTime getExpiration() {
        return expiration;
    } 
}