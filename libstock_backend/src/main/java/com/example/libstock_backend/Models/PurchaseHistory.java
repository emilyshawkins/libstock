package com.example.libstock_backend.Models;

import java.math.BigDecimal;

public class PurchaseHistory {

    private String purchaseDate;
    private String userId;
    private String bookId;
    private Integer quantity;
    private BigDecimal cost;
    
    public PurchaseHistory(String purchaseDate, String userId, String bookId, Integer quantity, BigDecimal cost) {
        this.purchaseDate = purchaseDate;
        this.userId = userId;
        this.bookId = bookId;
        this.quantity = quantity;
        this.cost = cost;
    }

    public String getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(String purchaseDate) {
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

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }
}
