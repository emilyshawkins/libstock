package com.example.libstock_backend.stripe.controller;

import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.PurchaseHistory;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.PurchaseHistoryRepository;
import com.example.libstock_backend.Repositories.UserRepository;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/stripe/webhook")
public class WebhookController {

    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    private static final String STRIPE_WEBHOOK_SECRET = "whsec_yrPD9WABprI2CKzOJUiOo09TEMFyXMrA"; // Replace with your actual webhook secret

    @PostMapping
    public ResponseEntity<String> handleStripeWebhook(
        @RequestBody String payload,
        @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        try {
            // Verify the event using the webhook secret
            Event event = Webhook.constructEvent(payload, sigHeader, STRIPE_WEBHOOK_SECRET);

            if ("checkout.session.completed".equals(event.getType())) {
                EventDataObjectDeserializer deserializer = event.getDataObjectDeserializer();

                // Check if the object is present
                if (deserializer.getObject().isPresent()) {
                    Session session = (Session) deserializer.getObject().get();

                    Map<String, String> metadata = session.getMetadata();
                    if (metadata == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing metadata");
                    }

                    String userId = metadata.get("userId");
                    String bookId = metadata.get("bookId");
                    String quantityStr = metadata.get("quantity");
                    Long amount = session.getAmountTotal();

                    if (userId == null || bookId == null || quantityStr == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing metadata fields");
                    }

                    Long quantity = Long.parseLong(quantityStr);
                    User user = userRepository.findById(userId).orElse(null);
                    Book book = bookRepository.findById(bookId).orElse(null);

                    if (user == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("User not found");
                    }

                    if (book == null) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Book not found");
                    }

                    // Save purchase history
                    PurchaseHistory purchaseHistory = new PurchaseHistory(
                        Instant.now(),
                        quantity,
                        amount,
                        userId,
                        user.getFirstName(),
                        user.getLastName(),
                        user.getEmail(),
                        bookId,
                        book.getISBN(),
                        book.getTitle(),
                        book.getPrice(),
                        book.getCover()
                    );

                    purchaseHistoryRepository.save(purchaseHistory);
                    return ResponseEntity.ok("Session processed successfully");
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Session deserialization failed");
                }
            }

            return ResponseEntity.ok("Unhandled event type");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Webhook error: " + e.getMessage());
        }
    }

}