package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Rating;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RatingRepository extends MongoRepository<Rating, String> {
    List<Rating> findByUserId(String userId); // Get all ratings by a user
    List<Rating> findByBookId(String bookId); // Get all ratings for a book
    Rating findByUserIdAndBookId(String userId, String bookId); // Get a rating by a user for a book
}