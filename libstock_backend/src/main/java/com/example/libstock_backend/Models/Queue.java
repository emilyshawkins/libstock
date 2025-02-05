package com.example.libstock_backend.Models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "queues")
public class Queue {
    @Id
    private String id;

    private String userId;
    private String bookId;
    private int position;

    public Queue() {}

    public Queue(String userId, String bookId, int position) {
        this.userId = userId;
        this.bookId = bookId;
        this.position = position;
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

    public int getPosition() {
        return position;
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

    public void setPosition(int position) {
        this.position = position;
    }
}
