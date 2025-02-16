package com.example.libstock_backend.DTOs;

// Data Transfer Object for login
public class LoginDTO {

    private String email;
    private String password;

    public LoginDTO() {} 

    public LoginDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
    
}
