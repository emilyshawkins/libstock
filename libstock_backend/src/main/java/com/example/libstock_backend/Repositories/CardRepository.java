package com.example.libstock_backend.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.libstock_backend.Models.Card;
import java.util.List;

public interface CardRepository extends MongoRepository<Card, String> {
    List<Card> findByUserEmail(String userEmail);
    Card findByCardNumber(int cardNumber);
}
