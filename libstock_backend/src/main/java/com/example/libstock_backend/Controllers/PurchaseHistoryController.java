package com.example.libstock_backend.Controllers;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.libstock_backend.Models.PurchaseHistory;
import com.example.libstock_backend.Repositories.PurchaseHistoryRepository;
import com.example.libstock_backend.stripe.dto.ProductRequest;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/history")
public class PurchaseHistoryController {

    @Autowired
    PurchaseHistoryRepository purchaseHistoryRepository;
    
    // Create a new purchase history
    @PostMapping("/create")
    public ResponseEntity<Object> create_purchase_history(@RequestParam String userId, @RequestBody ProductRequest productRequest) {
        
        Instant now = Instant.now();

        PurchaseHistory item = new PurchaseHistory(
            now,
            userId,
            productRequest.getName(),
            productRequest.getQuantity(),
            productRequest.getAmount()
        );

        purchaseHistoryRepository.save(item);

        return ResponseEntity.ok(item);
    }

    // Get purchase history by userId
    @PostMapping("/get")
    public ResponseEntity<Object> get_purchase_history(@RequestParam String userId) {
        return ResponseEntity.ok(purchaseHistoryRepository.findByUserId(userId));
    }
    
}
