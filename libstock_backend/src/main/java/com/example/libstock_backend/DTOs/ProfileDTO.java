package com.example.libstock_backend.DTOs;

public class ProfileDTO {

    private String previousEmail;
    private String newEmail;
    private String password;
    private String firstName;
    private String lastName;

    public ProfileDTO() {}

    public ProfileDTO(String previousEmail, String newEmail, String password, String firstName, String lastName) {
        this.newEmail = newEmail;
        this.previousEmail = previousEmail;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getNewEmail() {
        return newEmail;        
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }

    public String getPreviousEmail() {
        return previousEmail;
    }

    public void setPreviousEmail(String previousEmail) {
        this.previousEmail = previousEmail;
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
