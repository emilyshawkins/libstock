package com.example.libstock_backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.libstock_backend.Repositories.PurchaseHistoryRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/history")
public class PurchaseHistoryController {

    @Autowired
    PurchaseHistoryRepository purchaseHistoryRepository;
    
    // Get purchase history by userId
    @PostMapping("/get")
    public ResponseEntity<Object> get_purchase_history(@RequestParam String userId) {
        return ResponseEntity.ok(purchaseHistoryRepository.findByUserId(userId));
    }
    
}
