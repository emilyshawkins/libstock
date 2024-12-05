package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.WishlistItem;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface WishlistItemRepository extends MongoRepository<WishlistItem, String> {
    List<WishlistItem> findByUserEmail(String userEmail);
    WishlistItem findByUserEmailAndISBN(String userEmail, int ISBN);
    
}
