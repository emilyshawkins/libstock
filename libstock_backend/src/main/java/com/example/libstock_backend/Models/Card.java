package com.example.libstock_backend.Models;

import java.time.YearMonth;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cards")
public class Card {

    @Id
    private String id;

    private String userId; // ID of the user

    private int cardNumber; // Card number
    private int cvv; // Card verification value
    private YearMonth expirationDate; // Expiration date of the card

    public Card() {}

    public Card(int cardNumber, String userId, int cvv, YearMonth expirationDate) {
        this.cardNumber = cardNumber;
        this.userId = userId;
        this.cvv = cvv;
        this.expirationDate = expirationDate;
    }

    public String getId() {
        return id;
    }

    public int getCardNumber() {
        return cardNumber;
    }

    public String getUserId() {
        return userId;
    }

    public int getCvv() {
        return cvv;
    }

    public YearMonth getExpirationDate() {
        return expirationDate;
    }

    public void setId(String id) {
        this.id = id;
    }

    public void setCardNumber(int cardNumber) {
        this.cardNumber = cardNumber;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setCvv(int cvv) {
        this.cvv = cvv;
    }

    public void setExpirationDate(YearMonth expirationDate) {
        this.expirationDate = expirationDate;
    }
    
}