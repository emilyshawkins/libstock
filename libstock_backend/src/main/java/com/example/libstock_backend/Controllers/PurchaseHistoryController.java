package com.example.libstock_backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
    @GetMapping("/get")
    public ResponseEntity<Object> get_purchase_history(@RequestParam String userId) {
        return ResponseEntity.ok(purchaseHistoryRepository.findByUserId(userId));
    }

    // Get all receipts
    @GetMapping("/get_receipts")
    public ResponseEntity<Object> get_all_receipts(@RequestParam String userId) {
        return ResponseEntity.ok(purchaseHistoryRepository.findByUserId(userId));
    }

    // Get individual receipt by id
    @GetMapping("/get_receipt")
    public ResponseEntity<Object> get_receipt_by_id(@RequestParam String id) {
        return ResponseEntity.ok(purchaseHistoryRepository.findById(id));
    }
    
}
