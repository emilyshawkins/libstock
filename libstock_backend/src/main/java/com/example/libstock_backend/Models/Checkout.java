package com.example.libstock_backend.Models;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;
import java.util.Date;

@Document(collection = "checkouts")
public class Checkout {
    @Id
    private String id;

    private String userEmail;
    private int ISBN;
    
    private Date checkoutDate;
    private Date dueDate;
    private String status;

    public Checkout() {}

    public Checkout(String userEmail, int ISBN, Date checkoutDate, Date dueDate, String status) {
        this.userEmail = userEmail;
        this.ISBN = ISBN;
        this.checkoutDate = checkoutDate;
        this.dueDate = dueDate;
        this.status = status;
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

    public Date getCheckoutDate() {
        return checkoutDate;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setISBN(int ISBN) {
        this.ISBN = ISBN;
    }

    public void setCheckoutDate(Date checkoutDate) {
        this.checkoutDate = checkoutDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setId(String id) {
        this.id = id;
    }
}
