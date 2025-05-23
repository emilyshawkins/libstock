package com.example.libstock_backend.stripe.controller;

import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.PurchaseHistoryRepository;
import com.example.libstock_backend.Repositories.UserRepository;
import com.example.libstock_backend.stripe.dto.ProductRequest;
import com.example.libstock_backend.stripe.dto.StripeResponse;
import com.example.libstock_backend.stripe.service.StripeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/product/v1")
public class ProductCheckoutController {

    private StripeService stripeService;

    @Autowired
    PurchaseHistoryRepository purchaseHistoryRepository; 
    
    @Autowired
    BookRepository bookRepository;

    @Autowired
    UserRepository userRepository;

    public ProductCheckoutController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<StripeResponse> checkoutProducts(@RequestBody ProductRequest productRequest) {
        StripeResponse stripeResponse = stripeService.checkoutProducts(productRequest);

        return ResponseEntity.status(HttpStatus.OK).body(stripeResponse);
    }

}