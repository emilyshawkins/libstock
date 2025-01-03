package com.example.libstock_backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "queues")
public class Queue {
    @Id
    private String id;

    private String userEmail;
    private int ISBN;
    private int position;

    public Queue() {}

    public Queue(String userEmail, int ISBN, int position) {
        this.userEmail = userEmail;
        this.ISBN = ISBN;
        this.position = position;
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

    public int getPosition() {
        return position;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setISBN(int ISBN) {
        this.ISBN = ISBN;
    }

    public void setPosition(int position) {
        this.position = position;
    }
}
