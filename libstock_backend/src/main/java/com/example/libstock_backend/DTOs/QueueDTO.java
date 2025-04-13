package com.example.libstock_backend.DTOs;

public class QueueDTO {

    private String bookId; // Book ID
    private String userId; // User ID
    private int position; // Position in the queue

    public QueueDTO() {}

    public QueueDTO(String bookId, String userId, int position) {
        this.bookId = bookId;
        this.userId = userId;
        this.position = position;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getPosition() {
        return position;
    }

    public void setPosition(int position) {
        this.position = position;
    }
    
}
