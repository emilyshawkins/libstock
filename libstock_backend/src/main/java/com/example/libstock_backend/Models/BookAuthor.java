package com.example.libstock_backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// BookAuthor model
@Document(collection = "book_authors")
public class BookAuthor {
    @Id
    private String id;

    private String authorId; // ID of the author
    private String bookId; // ID of the book

    public BookAuthor() {}

    public BookAuthor(String authorId, String bookId) {
        this.authorId = authorId;
        this.bookId = bookId;
    }

    public String getId() {
        return id;
    }

    public String getAuthorId() {
        return authorId;
    }

    public String getBookId() {
        return bookId;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setAuthorId(String authorId) {
        this.authorId = authorId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

}