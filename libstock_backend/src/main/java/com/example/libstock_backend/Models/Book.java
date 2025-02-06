package com.example.libstock_backend.Models;

import java.math.BigDecimal;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "books")
public class Book {
    @Id
    private String id;

    private String ISBN;
    private String title;
    private String summary;
    private String publicationDate;
    private BigDecimal price;
    private Boolean purchaseable;
    private int count;
    private int numCheckedOut;
    private byte[] cover;

    public Book() {}

    public Book(String ISBN, String title, String summary, String publicationDate, BigDecimal price, Boolean purchaseable, int count, int numCheckedOut, byte[] cover) {
        this.ISBN = ISBN;
        this.title = title;
        this.summary = summary;
        this.publicationDate = publicationDate;
        this.price = price;
        this.purchaseable = purchaseable;
        this.count = count;
        this.numCheckedOut = numCheckedOut;
        this.cover = cover;
    }

    public String getId() {
        return id;
    }

    public String getISBN() {
        return ISBN;
    }

    public String getTitle() {
        return title;
    }

    public String getSummary() {
        return summary;
    }

    public String getPublicationDate() {
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

    public byte[] getCover() {
        return cover;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setISBN(String ISBN) {
        this.ISBN = ISBN;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public void setPublicationDate(String publicationDate) {
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

    public void setCover(byte[] cover) {
        this.cover = cover;
    }

}
