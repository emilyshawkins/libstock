package com.example.libstock_backend.Models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

// BookGenre model
@Document(collection = "book_genres")
public class BookGenre {
    @Id
    private String id;

    private String genreId; // ID of the genre
    private String bookId; //   ID of the book

    public BookGenre() {}

    public BookGenre(String genreId, String bookId) {
        this.genreId = genreId;
        this.bookId = bookId;
    }

    public String getId() {
        return id;
    }

    public String getGenreId() {
        return genreId;
    }

    public String getBookId() {
        return bookId;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setGenreId(String genreId) {
        this.genreId = genreId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }
}
