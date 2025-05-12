package com.example.libstock_backend.DTOs;

public class ResetPasswordDTO {
    private String id;
    private String newPassword;
    private String resetToken;
    
    public ResetPasswordDTO() {}

    public ResetPasswordDTO(String id, String newPassword, String resetToken) {
        this.id = id;
        this.newPassword = newPassword;
        this.resetToken = resetToken;
    }

    public String getId() {
        return id;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

}
