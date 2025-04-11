package com.example.libstock_backend.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.libstock_backend.Models.PurchaseHistory;

public interface PurchaseHistoryRepository extends MongoRepository<PurchaseHistory, String> {
    
}
