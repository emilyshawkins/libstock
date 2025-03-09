package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Checkout;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface CheckoutRepository extends MongoRepository<Checkout, String> {
    List<Checkout> findByUserId(String userId); // Find all checkouts by user
    Checkout findByUserIdAndBookIdAndStatus(String userId, String bookId, String status); // Find a book checked out by a user
    void deleteAllByBookId(String bookId); // Delete all checkouts for a book
    void deleteAllByUserId(String userId); // Delete all checkouts for a user
    List<Checkout> findByUserIdAndStatus(String userId, String status); // Find all checkouts by user with a specific status
    List<Checkout> findByStatus(String status); // Find all checkouts with a specific status
}
