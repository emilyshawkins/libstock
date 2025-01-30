package com.example.libstock_backend.DTOs;

public class UserDTO {

    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private boolean isAdmin;

    public UserDTO() {}

    public UserDTO(String id, String email, String firstName, String lastName, boolean isAdmin) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isAdmin = isAdmin;
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
}
