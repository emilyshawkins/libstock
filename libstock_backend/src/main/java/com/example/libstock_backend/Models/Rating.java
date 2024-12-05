package com.example.libstock_backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "ratings")
public class Rating {
    @Id
    private String id;

    private String userEmail;
    private int ISBN;

    private int stars;
    private String comment;

    public Rating() {}

    public Rating(String userEmail, int ISBN, int stars, String comment) {
        this.userEmail = userEmail;
        this.ISBN = ISBN;
        this.stars = stars;
        this.comment = comment;
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

    public int getStars() {
        return stars;
    }

    public String getComment() {
        return comment;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setStars(int stars) {
        this.stars = stars;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
