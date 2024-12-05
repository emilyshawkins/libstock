package com.example.libstock_backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "wishlist_items")
public class WishlistItem {

    @Id
    private String id;

    private String userEmail;
    private int ISBN;

    public WishlistItem() {}

    public WishlistItem(String userEmail, int ISBN) {
        this.userEmail = userEmail;
        this.ISBN = ISBN;
    }

    public String getId() {
        return id;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public int getISBN() {
        return ISBN;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setISBN(int ISBN) {
        this.ISBN = ISBN;
    }
    
}
