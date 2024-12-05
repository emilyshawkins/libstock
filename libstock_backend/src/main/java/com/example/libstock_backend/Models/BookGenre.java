package com.example.libstock_backend.Models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document(collection = "book_genres")
public class BookGenre {
    @Id
    private String id;

    private String genreName;
    private int ISBN;

    public BookGenre() {}

    public BookGenre(String genreName, int ISBN) {
        this.genreName = genreName;
        this.ISBN = ISBN;
    }

    public String getId() {
        return id;
    }

    public String getGenreName() {
        return genreName;
    }

    public int getISBN() {
        return ISBN;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setGenreName(String genreName) {
        this.genreName = genreName;
    }

    public void setISBN(int ISBN) {
        this.ISBN = ISBN;
    }
}
