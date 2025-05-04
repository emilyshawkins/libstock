package com.example.libstock_backend.Models;

import java.math.BigDecimal;
import java.time.Instant;

import org.springframework.data.annotation.Id;

public class PurchaseHistory {

    @Id
    private String id; // For order ID

    private Instant purchaseDate; // Date of purchase
    private Long quantity; // Quantity of books purchased
    private Long cost; // Total cost of the purchase

    private String userId; // User ID of the purchaser
    private String firstName; // Name of the purchaser
    private String lastName; // Name of the purchaser
    private String email; // Email of the purchaser

    private String bookId; // Book ID of the purchased book
    private String isbn; // ISBN of the purchased book
    private String title; // Title of the purchased book
    private BigDecimal unitPrice; // Unit price of the purchased book
    private byte[] cover; // Cover image of the purchased book
    
    public PurchaseHistory() {}

    public PurchaseHistory(Instant purchaseDate, Long quantity, Long cost, String userId, String firstName, String lastName, String email, String bookId, String isbn, String title, BigDecimal unitPrice, byte[] cover) {
        this.purchaseDate = purchaseDate;
        this.quantity = quantity;
        this.cost = cost;
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.bookId = bookId;
        this.isbn = isbn;
        this.title = title;
        this.unitPrice = unitPrice;
        this.cover = cover;
    }

    public String getId() {
        return id;
    }

    public Instant getPurchaseDate() {
        return purchaseDate;
    }

    public Long getQuantity() {
        return quantity;
    }

    public Long getCost() {
        return cost;
    }

    public String getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getBookId() {
        return bookId;
    }

    public String getIsbn() {
        return isbn;
    }

    public String getTitle() {
        return title;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public byte[] getCover() {
        return cover;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setPurchaseDate(Instant purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    public void setCost(Long cost) {
        this.cost = cost;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public void setCover(byte[] cover) {
        this.cover = cover;
    }
    
}
