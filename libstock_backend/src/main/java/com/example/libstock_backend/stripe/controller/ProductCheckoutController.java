package com.example.libstock_backend.stripe.controller;

import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.PurchaseHistory;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.PurchaseHistoryRepository;
import com.example.libstock_backend.Repositories.UserRepository;
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
    
    @Autowired
    BookRepository bookRepository;

    @Autowired
    UserRepository userRepository;

    public ProductCheckoutController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<StripeResponse> checkoutProducts(@RequestParam String userId, @RequestParam String bookId, @RequestBody ProductRequest productRequest) {
        StripeResponse stripeResponse = stripeService.checkoutProducts(productRequest);

        Instant now = Instant.now();

        Book book = bookRepository.findById(bookId).orElse(null);
        User user = userRepository.findById(userId).orElse(null);

        if (book == null || user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        PurchaseHistory item = new PurchaseHistory(
            now, // purchase date
            productRequest.getQuantity(), // quantity of books purchased
            productRequest.getAmount(), // total cost of the purchase
            userId, // user ID of the purchaser
            user.getFirstName(), // name of the purchaser
            user.getLastName(), // name of the purchaser
            user.getEmail(), // email of the purchaser
            bookId, // book ID of the purchased book
            book.getISBN(), // ISBN of the purchased book
            book.getTitle(), // title of the purchased book
            book.getPrice(), // unit price of the purchased book
            book.getCover() != null ? book.getCover() : null // cover image of the purchased book
        );

        purchaseHistoryRepository.save(item);

        // TODO: Email + notification to user

        return ResponseEntity.status(HttpStatus.OK).body(stripeResponse);
    }

}