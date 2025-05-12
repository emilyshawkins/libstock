package com.example.libstock_backend.Models;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//Ratings for books
@Document(collection = "ratings")
public class Rating {
    @Id
    private String id;

    private String userId; // ID of the user
    private String bookId; // ID of the book

    private Integer stars;
    private String comment;
    private Instant date;

    public Rating() {}

    public Rating(String userId, String bookId, Integer stars, String comment, Instant date) {
        this.userId = userId;
        this.bookId = bookId;
        this.stars = stars;
        this.comment = comment;
        this.date = date;
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

    public Integer getStars() {
        return stars;
    }

    public String getComment() {
        return comment;
    }

    public Instant getDate() {
        return date;
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

    public void setStars(Integer stars) {
        this.stars = stars;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public void setDate(Instant date) {
        this.date = date;
    }
}
