package com.example.libstock_backend.Models;

import java.time.Instant;

public class PurchaseHistory {

    private Instant purchaseDate;
    private String userId;
    private String bookId;
    private Long quantity;
    private Long cost;
    
    public PurchaseHistory(Instant purchaseDate, String userId, String bookId, Long quantity, Long cost) {
        this.purchaseDate = purchaseDate;
        this.userId = userId;
        this.bookId = bookId;
        this.quantity = quantity;
        this.cost = cost;
    }

    public Instant getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(Instant purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    public Long getCost() {
        return cost;
    }

    public void setCost(Long cost) {
        this.cost = cost;
    }
}
