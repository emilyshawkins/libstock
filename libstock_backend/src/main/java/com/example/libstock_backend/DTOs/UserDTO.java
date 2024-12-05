package com.example.libstock_backend.DTOs;

public class UserDTO {

    private String email;
    private String firstName;
    private String lastName;
    private boolean isAdmin;
    private String address;

    public UserDTO() {}

    public UserDTO(String email, String firstName, String lastName, boolean isAdmin, String address) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isAdmin = isAdmin;
        this.address = address;
    }
}
