package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Checkout;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CheckoutRepository extends MongoRepository<Checkout, String> {
    List<Checkout> findByUserEmail(String userEmail); // Find all checkouts by user
    Checkout findByUserEmailAndISBN(String userEmail, int ISBN); // Find a book checked out by a user
}
