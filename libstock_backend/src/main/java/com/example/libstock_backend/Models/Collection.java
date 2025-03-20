package com.example.libstock_backend.Models;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "collections")
public class Collection {

    @Id
    private String id;

    private String userId; // User ID of the collection owner
    private String name; // Name of the collection
    private String description; // Description of the collection
    private Boolean visible;
    private ArrayList<String> books; // List of books in the collection

    public Collection() {}

    public Collection(String userId, String name, String description, Boolean visible, ArrayList<String> books) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.visible = visible;
        this.books = books;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getVisible() {
        return visible;
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

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setVisible(Boolean visible) {
        this.visible = visible;
    }

    public void setBooks(ArrayList<String> books) {
        this.books = books;
    }

    public void addBook(String bookId) {
        this.books.add(bookId);
    }

    public void removeBook(String bookId) {
        this.books.remove(bookId);
    }

    public void clearBooks() {
        this.books.clear();
    }
    
}
