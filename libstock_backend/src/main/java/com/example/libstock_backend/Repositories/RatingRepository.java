package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RatingRepository extends MongoRepository<Rating, String> {
    List<Rating> findByUserEmail(String userEmail); // Get all ratings by a user
    List<Rating> findByISBN(int ISBN); // Get all ratings for a book
    Rating findByUserEmailAndISBN(String userEmail, int ISBN); // Get a rating by a user for a book
}