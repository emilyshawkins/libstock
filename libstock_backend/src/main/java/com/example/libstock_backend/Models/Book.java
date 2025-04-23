package com.example.libstock_backend.Models;

import java.math.BigDecimal;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

// Book model
@Document(collection = "books")
public class Book {
    @Id
    private String id;

    private String ISBN; // International Standard Book Number
    private String title; // Title of the book
    private String summary; // Summary of the book
    private String publicationDate; // Publication date of the book
    private BigDecimal price; // Price of the book
    private Boolean purchasable; // Whether the book is purchasable
    private Integer count; // Number of copies of the book
    private Integer numCheckedOut; // Number of copies of the book that are checked out
    private byte[] cover; // Cover image of the book
    private String addedData; // Additional data related to the book

    public Book() {}

    public Book(String ISBN, String title, String summary, String publicationDate, BigDecimal price, Boolean purchasable, Integer count, Integer numCheckedOut, byte[] cover, String addedData) {
        this.ISBN = ISBN;
        this.title = title;
        this.summary = summary;
        this.publicationDate = publicationDate;
        this.price = price;
        this.purchasable = purchasable;
        this.count = count;
        this.numCheckedOut = numCheckedOut;
        this.cover = cover;
        this.addedData = addedData;
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

    public Boolean getPurchasable() {
        return purchasable;
    }

    public Integer getCount() {
        return count;
    }

    public Integer getNumCheckedOut() {
        return numCheckedOut;
    }

    public byte[] getCover() {
        return cover;
    }

    public String getAddedData() {
        return addedData;
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

    public void setPurchasable(Boolean purchasable) {
        this.purchasable = purchasable;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public void setNumCheckedOut(Integer numCheckedOut) {
        this.numCheckedOut = numCheckedOut;
    }

    public void setCover(byte[] cover) {
        this.cover = cover;
    }

    public void setAddedData(String addedData) {
        this.addedData = addedData;
    }

}
