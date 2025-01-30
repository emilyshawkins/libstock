package com.example.libstock_backend.DTOs;

public class ProfileDTO {

    private String id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;

    public ProfileDTO() {}

    public ProfileDTO(String id, String email, String password, String firstName, String lastName) {
        this.id = id;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
}
