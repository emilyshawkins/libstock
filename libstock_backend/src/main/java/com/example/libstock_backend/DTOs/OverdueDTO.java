package com.example.libstock_backend.DTOs;

import java.time.Instant;

public class OverdueDTO {
    private String id;

    private String userId; // ID of the user
    private String bookId; // ID of the book
    
    private Instant checkoutDate; // Date of checkout
    private Instant dueDate; // Due date of the book

    private Double fee; // Fee for overdue

    public OverdueDTO() {}

    public OverdueDTO(String id, String userId, String bookId, Instant checkoutDate, Instant dueDate, Double fee) {
        this.id = id;
        this.userId = userId;
        this.bookId = bookId;
        this.checkoutDate = checkoutDate;
        this.dueDate = dueDate;
        this.fee = fee;
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

    public Instant getCheckoutDate() {
        return checkoutDate;
    }

    public Instant getDueDate() {
        return dueDate;
    }

    public Double getFee() {
        return fee;
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

    public void setCheckoutDate(Instant checkoutDate) {
        this.checkoutDate = checkoutDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public void setFee(Double fee) {
        this.fee = fee;
    }

}
