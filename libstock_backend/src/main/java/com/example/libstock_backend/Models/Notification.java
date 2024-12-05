package com.example.libstock_backend.Models;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    private String userID; // user that the notification is for

    private LocalDateTime date;
    private String message;
    private boolean read;

    public Notification() {}

    public Notification(String userID, LocalDateTime date, String message, boolean read) {
        this.userID = userID;
        this.date = date;
        this.message = message;
        this.read = read;
    }

    public String getId() {
        return id;
    }

    public String getUserID() {
        return userID;
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

    public void setUserID(String userID) {
        this.userID = userID;
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
