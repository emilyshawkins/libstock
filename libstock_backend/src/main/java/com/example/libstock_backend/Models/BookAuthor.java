package com.example.libstock_backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "book_authors")
public class BookAuthor {
    @Id
    private String id;

    private String authorID;
    private int ISBN;

    public BookAuthor() {}

    public BookAuthor(String authorID, int ISBN) {
        this.authorID = authorID;
        this.ISBN = ISBN;
    }

    public String getId() {
        return id;
    }

    public String getAuthorID() {
        return authorID;
    }

    public int getISBN() {
        return ISBN;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setAuthorID(String authorID) {
        this.authorID = authorID;
    }

    public void setISBN(int ISBN) {
        this.ISBN = ISBN;
    }

}
