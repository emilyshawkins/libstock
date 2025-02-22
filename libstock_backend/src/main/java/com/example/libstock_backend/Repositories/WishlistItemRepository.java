package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.WishlistItem;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface WishlistItemRepository extends MongoRepository<WishlistItem, String> {
    List<WishlistItem> findByUserId(String userId); // Find wishlist items by user id
    WishlistItem findByUserIdAndBookId(String userId, String bookId); // Find wishlist item by user id and book id
    void deleteAllByBookId(String bookId); // Delete all wishlist items by book id
    void deleteAllByUserId(String userId); // Delete all wishlist items by user id
}
