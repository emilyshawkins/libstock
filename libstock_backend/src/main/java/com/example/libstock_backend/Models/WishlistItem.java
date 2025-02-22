package com.example.libstock_backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "wishlist_items")
public class WishlistItem {

    @Id
    private String id;

    private String userId; // ID of the user
    private String bookId; // ID of the book

    public WishlistItem() {}

    public WishlistItem(String userId, String bookId) {
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
