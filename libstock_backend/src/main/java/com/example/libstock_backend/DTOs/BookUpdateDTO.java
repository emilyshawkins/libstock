package com.example.libstock_backend.DTOs;

import java.math.BigDecimal;
import java.sql.Date;

public class BookUpdateDTO {

    private int currentISBN;
    private int newISBN;
    private String title;
    private String summary;
    private Date publicationDate;
    private BigDecimal price;
    private Boolean purchaseable;
    private int count;
    private int numCheckedOut;

    public BookUpdateDTO() {}

    public BookUpdateDTO(int currentISBN, int newISBN, String title, String summary, Date publicationDate, BigDecimal price, Boolean purchaseable, int count, int numCheckedOut) {
        this.currentISBN = currentISBN;
        this.newISBN = newISBN;
        this.title = title;
        this.summary = summary;
        this.publicationDate = publicationDate;
        this.price = price;
        this.purchaseable = purchaseable;
        this.count = count;
        this.numCheckedOut = numCheckedOut;
    }

    public int getCurrentISBN() {
        return currentISBN;
    }

    public int getNewISBN() {
        return newISBN;
    }

    public String getTitle() {
        return title;
    }

    public String getSummary() {
        return summary;
    }

    public Date getPublicationDate() {
        return publicationDate;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Boolean getPurchaseable() {
        return purchaseable;
    }

    public int getCount() {
        return count;
    }

    public int getNumCheckedOut() {
        return numCheckedOut;
    }

    public void setCurrentISBN(int currentISBN) {
        this.currentISBN = currentISBN;
    }

    public void setNewISBN(int newISBN) {
        this.newISBN = newISBN;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public void setPublicationDate(Date publicationDate) {
        this.publicationDate = publicationDate;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public void setPurchaseable(Boolean purchaseable) {
        this.purchaseable = purchaseable;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public void setNumCheckedOut(int numCheckedOut) {
        this.numCheckedOut = numCheckedOut;
    }

}
