package com.example.libstock_backend.Models;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "wishlist_items")
public class WishlistItem {

    @Id
    private String id;

    private String userId; // ID of the user
    private ArrayList<String> books; // ID of the book

    public WishlistItem() {}

    public WishlistItem(String userId, ArrayList<String> books) {
        this.userId = userId;
        this.books = books;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public ArrayList<String> getBooks() {
        return books;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setBooks(ArrayList<String> books) {
        this.books = books;
    }
    
}
