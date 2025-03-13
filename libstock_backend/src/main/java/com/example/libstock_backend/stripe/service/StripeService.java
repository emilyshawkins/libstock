package com.example.libstock_backend.stripe.service;

import com.example.libstock_backend.stripe.dto.ProductRequest;
import com.example.libstock_backend.stripe.dto.StripeResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

        @Value("${stripe.secretKey}")
        private String secretKey;

        // stripe -API
        // -> productName , amount , quantity , currency
        // -> return sessionId and url

        public StripeResponse checkoutProducts(ProductRequest productRequest) {
                // Set your secret key. Remember to switch to your live secret key in
                // production!
                Stripe.apiKey = "sk_test_51Qx1ss2eFvgnA4OIJIDAKZ8SK9MUT9KqAXkCLPJ5eHWbJa0A4HD7YqsugEM4HqipfZ3Hwgh77rZiqkpyvuila24U00ddVE4o1q";

                // Create a PaymentIntent with the order amount and currency
                SessionCreateParams.LineItem.PriceData.ProductData productData = SessionCreateParams.LineItem.PriceData.ProductData
                                .builder()
                                .setName(productRequest.getName())
                                .build();

                // Create new line item with the above product data and associated price
                SessionCreateParams.LineItem.PriceData priceData = SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency(productRequest.getCurrency() != null ? productRequest.getCurrency()
                                                : "USD")
                                .setUnitAmount(productRequest.getAmount())
                                .setProductData(productData)
                                .build();

                // Create new line item with the above price data
                SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                                .setQuantity(productRequest.getQuantity())
                                .setPriceData(priceData)
                                .build();

                // Create new session with the line items
                SessionCreateParams params = SessionCreateParams.builder()
                                .setMode(SessionCreateParams.Mode.PAYMENT)
                                .setSuccessUrl("http://localhost:3000/success")
                                .setCancelUrl("http://localhost:3000/cancel")
                                .addLineItem(lineItem)
                                .build();

                // Create new session
                Session session = null;
                try {
                        session = Session.create(params);
                } catch (StripeException e) {
                        // log the error
                }

                return StripeResponse
                                .builder()
                                .status("SUCCESS")
                                .message("Payment session created ")
                                .sessionId(session.getId())
                                .sessionUrl(session.getUrl())
                                .build();
        }

}