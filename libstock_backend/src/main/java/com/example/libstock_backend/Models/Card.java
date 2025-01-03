package com.example.libstock_backend.Models;

import java.time.YearMonth;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "cards")
public class Card {

    @Id
    private String id;

    private String userEmail;

    private int cardNumber;
    private int cvv;
    private YearMonth expirationDate;

    public Card() {}

    public Card(int cardNumber, String userEmail, int cvv, YearMonth expirationDate) {
        this.cardNumber = cardNumber;
        this.userEmail = userEmail;
        this.cvv = cvv;
        this.expirationDate = expirationDate;
    }

    public String getId() {
        return id;
    }

    public int getCardNumber() {
        return cardNumber;
    }

    public String getUserEmail() {
        return userEmail;
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

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public void setCvv(int cvv) {
        this.cvv = cvv;
    }

    public void setExpirationDate(YearMonth expirationDate) {
        this.expirationDate = expirationDate;
    }
    
}
