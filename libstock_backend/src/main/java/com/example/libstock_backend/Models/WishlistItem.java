package com.example.libstock_backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "wishlist_items")
public class WishlistItem {

    @Id
    private String id;

    private String userId;
    private String BookId;

    public WishlistItem() {}

    public WishlistItem(String userId, String BookId) {
        this.userId = userId;
        this.BookId = BookId;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getBookId() {
        return BookId;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setBookId(String BookId) {
        this.BookId = BookId;
    }
    
}
