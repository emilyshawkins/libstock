package com.example.libstock_backend.Repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.libstock_backend.Models.PurchaseHistory;

public interface PurchaseHistoryRepository extends MongoRepository<PurchaseHistory, String> {

    List<PurchaseHistory> findByUserId(String userId); // Method to find purchase history by userId
    
}
