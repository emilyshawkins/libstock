package com.example.libstock_backend.Models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    private String userId; // user that the notification is for

    private LocalDateTime date;
    private String message;
    private boolean read;

    public Notification() {}

    public Notification(String userId, LocalDateTime date, String message, boolean read) {
        this.userId = userId;
        this.date = date;
        this.message = message;
        this.read = read;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public String getMessage() {
        return message;
    }

    public boolean isRead() {
        return read;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}
