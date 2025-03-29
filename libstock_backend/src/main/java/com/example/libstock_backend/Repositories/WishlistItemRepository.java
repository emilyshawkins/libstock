package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.WishlistItem;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface WishlistItemRepository extends MongoRepository<WishlistItem, String> {
    WishlistItem findByUserId(String userId); // Find wishlist items by user id
    void deleteAllByUserId(String userId); // Delete all wishlist items by user id
}
