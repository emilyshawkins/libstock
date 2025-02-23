package com.example.libstock_backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.libstock_backend.Models.Rating;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.RatingRepository;
import com.example.libstock_backend.Repositories.UserRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/rating")
public class RatingController {
    
    @Autowired
    RatingRepository ratingRepository;
    @Autowired
    BookRepository bookRepository;
    @Autowired
    UserRepository userRepository;

    @PostMapping("/create")
    // Create a new rating
    public ResponseEntity<Object> create_rating(@RequestBody Rating rating) {
        System.out.println("Creating rating");
        if (rating.getUserId() == null || rating.getBookId() == null) { // Check if required fields are present
            return ResponseEntity.badRequest().body("User ID and Book ID are required fields.");
        }
        if (userRepository.findById(rating.getUserId()).orElse(null) == null) { // Check if user exists
            return ResponseEntity.badRequest().body("User does not exist.");
        }
        if (bookRepository.findById(rating.getBookId()).orElse(null) == null) { // Check if book exists
            return ResponseEntity.badRequest().body("Book does not exist.");
        }
        if (rating.getStars() == null) { // Check if stars are provided
            return ResponseEntity.badRequest().body("Stars are required.");
        }
        if (rating.getStars() < 1 || rating.getStars() > 5) { // Check if stars are between 1 and 5
            return ResponseEntity.badRequest().body("Stars must be between 1 and 5.");
        }

        Rating existingRating = ratingRepository.findByUserIdAndBookId(rating.getUserId(), rating.getBookId());
        if (existingRating != null) { // Check if rating already exists
            return ResponseEntity.badRequest().body("Rating already exists.");
        }

        ratingRepository.save(rating);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/read")
    // Read a rating by id
    public ResponseEntity<Rating> read_rating(@RequestParam String id) {
        Rating rating = ratingRepository.findById(id).orElse(null);
        if (rating == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(rating);
    }

    @PatchMapping("/update")
    // Update a rating
    public ResponseEntity<Object> update_rating(@RequestBody Rating rating) { // Can only update stars and comment
        Rating existingRating = ratingRepository.findById(rating.getId()).orElse(null);
        if (existingRating == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (rating.getStars() != null) {
            if (rating.getStars() < 1 || rating.getStars() > 5) { // Check if stars are between 1 and 5
                return ResponseEntity.badRequest().body("Stars must be between 1 and 5.");
            }
            existingRating.setStars(rating.getStars());
        }
        if (rating.getComment() != null) {
            existingRating.setComment(rating.getComment());
        }

        ratingRepository.save(existingRating);
        return ResponseEntity.ok(existingRating);
    }

    @DeleteMapping("/delete")
    // Delete a rating
    public ResponseEntity<Rating> delete_rating(@RequestParam String id) {
        Rating rating = ratingRepository.findById(id).orElse(null);
        if (rating == null) {
            return ResponseEntity.notFound().build();
        }
        ratingRepository.delete(rating);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/get_ratings_by_user")
    // Get all ratings for a user
    public ResponseEntity<Iterable<Rating>> get_ratings_by_user(@RequestParam String userId) {
        Iterable<Rating> ratings = ratingRepository.findByUserId(userId);
        return ResponseEntity.ok(ratings);
    }

    @GetMapping("/get_ratings_by_book")
    // Get all ratings for a book
    public ResponseEntity<Iterable<Rating>> get_ratings_by_book(@RequestParam String bookId) {
        Iterable<Rating> ratings = ratingRepository.findByBookId(bookId);
        return ResponseEntity.ok(ratings);
    }

}
