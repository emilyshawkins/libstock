package com.example.libstock_backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// Favorite model for user's favorite books
@Document(collection = "favorites")
public class Favorite {
    @Id
    private String id;

    private String userId; // ID of the user
    private String bookId; // ID of the book

    public Favorite() {}

    public Favorite(String userId, String bookId) {
        this.userId = userId;
        this.bookId = bookId;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getBookId() {
        return bookId;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }
}