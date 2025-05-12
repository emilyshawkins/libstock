package com.example.libstock_backend.DTOs;

import java.time.LocalDateTime; // used to keep track of token experation // 

// Data Transfer Object for profile
public class ProfileDTO {

    private String id;
    private String email;
    private String currentPassword;
    private String newPassword;
    private String firstName;
    private String lastName;
    private byte[] image;
    private String resetToken; 
    private LocalDateTime expiration; 


    public ProfileDTO() {}

    public ProfileDTO(String id, String email, String currentPassword, String newPassword, String firstName, String lastName, byte[] image, String resetToken, LocalDateTime expiration) {
        this.id = id;
        this.email = email;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword;
        this.firstName = firstName;
        this.lastName = lastName;
        this.image = image;
        this.resetToken = resetToken;
        this.expiration = expiration;
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

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
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

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getResetToken(String resetToken) {
        return resetToken;
    }

    public void setResetToken(){
        this.resetToken = resetToken;
    }

    public LocalDateTime getExpiration(LocalDateTime expiration) {
        return expiration;
    }
    
    public void setExpiration() {
        this.expiration = expiration;
    }
}