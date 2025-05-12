package com.example.libstock_backend.Models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.time.*;

@Document(collection = "checkouts")
public class Checkout {
    @Id
    private String id;

    private String userId; // ID of the user
    private String bookId; // ID of the book
    
    private Instant checkoutDate; // Date of checkout
    private Instant dueDate; // Due date of the book
    private Instant returnDate; // Date of return
    private String status; // Status of the checkout

    public Checkout() {}

    public Checkout(String userId, String bookId, Instant checkoutDate, Instant dueDate, Instant returnDate, String status) {
        this.userId = userId;
        this.bookId = bookId;
        this.checkoutDate = checkoutDate;
        this.dueDate = dueDate;
        this.returnDate = returnDate;
        this.status = status;
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

    public Instant getReturnDate() {
        return returnDate;
    }

    public String getStatus() {
        return status;
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

    public void setReturnDate(Instant returnDate) {
        this.returnDate = returnDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setId(String id) {
        this.id = id;
    }
}
