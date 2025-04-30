package com.example.libstock_backend.stripe.controller;

import com.example.libstock_backend.Models.PurchaseHistory;
import com.example.libstock_backend.Repositories.PurchaseHistoryRepository;
import com.example.libstock_backend.stripe.dto.ProductRequest;
import com.example.libstock_backend.stripe.dto.StripeResponse;
import com.example.libstock_backend.stripe.service.StripeService;

import java.time.Instant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/product/v1")
public class ProductCheckoutController {

    private StripeService stripeService;

    @Autowired
    PurchaseHistoryRepository purchaseHistoryRepository;    

    public ProductCheckoutController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<StripeResponse> checkoutProducts(@RequestParam String userId, @RequestBody ProductRequest productRequest) {
        StripeResponse stripeResponse = stripeService.checkoutProducts(productRequest);

        Instant now = Instant.now();

        PurchaseHistory item = new PurchaseHistory(
            now,
            userId,
            productRequest.getName(),
            productRequest.getQuantity(),
            productRequest.getAmount()
        );

        purchaseHistoryRepository.save(item);

        return ResponseEntity.status(HttpStatus.OK).body(stripeResponse);
    }

}