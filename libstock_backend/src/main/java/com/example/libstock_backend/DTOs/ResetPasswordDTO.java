package com.example.libstock_backend.DTOs;

public class ResetPasswordDTO {
    private String newPassword;
    private String resetToken;
    
    public ResetPasswordDTO() {}

    public ResetPasswordDTO(String newPassword, String resetToken) {
        this.newPassword = newPassword;
        this.resetToken = resetToken;
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
