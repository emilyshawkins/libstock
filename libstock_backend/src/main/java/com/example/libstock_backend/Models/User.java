// Brandon Gascon - modified //
// added reset token handling for password reset //
package com.example.libstock_backend.Models;

import java.util.LocalDateTime; // used to keep track of token experation // 

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    private String email; // Email of the user
    private String firstName; // First name of the user
    private String lastName; // Last name of the user
    private String password; // Password of the user
    private boolean isAdmin; // Whether the user is an admin
    private byte[] image; // Profile image of the user
    private String resetToken; // Used to reset password
    private LocalDateTime expiration; // Tracks resetToken expiration

    public User() {}

    public User(String email, String firstName, String lastName, String password, boolean isAdmin, byte[] image, String resetToken, LocalDateTime expiration) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.isAdmin = isAdmin;
        this.image = image;
        this.resetToken = resetToken;
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

    public String getPassword() {
        return password;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public byte[] getImage() {
        return image;
    }

    public String getResetToken() {
        return resetToken;
    }
    
    public LocalDateTime getExpiration() {
        return experation;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setAdmin(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public void setExpiration(LocalDateTime experation) {
        this.experation = expiration;
    }
}