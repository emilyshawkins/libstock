package com.example.libstock_backend.Controllers;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController {

    private String stripeApiKey = "sk_test_51Qx1ss2eFvgnA4OIJIDAKZ8SK9MUT9KqAXkCLPJ5eHWbJa0A4HD7YqsugEM4HqipfZ3Hwgh77rZiqkpyvuila24U00ddVE4o1q";;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<String> createCheckoutSession() throws StripeException {
        // Set your secret key: remember to switch to your live secret key in production!
        Stripe.apiKey = stripeApiKey;

        // Build session parameters
        SessionCreateParams params =
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("https://your-domain.com/success?session_id={CHECKOUT_SESSION_ID}")
                        .setCancelUrl("https://your-domain.com/cancel")
                        .addLineItem(
                                SessionCreateParams.LineItem.builder()
                                        .setQuantity(1L)
                                        .setPriceData(
                                                SessionCreateParams.LineItem.PriceData.builder()
                                                        .setCurrency("usd")
                                                        .setUnitAmount(2000L) // amount in cents
                                                        .setProductData(
                                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                        .setName("Sample Product")
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .build();

        // Create session
        Session session = Session.create(params);

        // Return the URL for redirecting the user
        return ResponseEntity.ok(session.getUrl());
    }
}
