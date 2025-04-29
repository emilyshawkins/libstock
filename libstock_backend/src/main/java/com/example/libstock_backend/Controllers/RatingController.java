package com.example.libstock_backend.Controllers;

import java.time.Instant;
import java.util.ArrayList;

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

import com.example.libstock_backend.DTOs.RatingDTO;
import com.example.libstock_backend.Models.Rating;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.RatingRepository;
import com.example.libstock_backend.Repositories.UserRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/rating")
public class RatingController {
    
    @Autowired
    public RatingRepository ratingRepository;
    @Autowired
    public BookRepository bookRepository;
    @Autowired
    public UserRepository userRepository;

    @PostMapping("/create")
    // Create a new rating
    public ResponseEntity<Object> create_rating(@RequestBody Rating rating) {
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

        rating.setDate(Instant.now()); // Set the date to now 

        ratingRepository.save(rating);

        User user = userRepository.findById(rating.getUserId()).orElse(null);

        RatingDTO ratingDTO = new RatingDTO(
            rating.getId(),
            rating.getUserId(),
            user != null ? user.getFirstName() + " " + user.getLastName() : null,
            rating.getBookId(),
            rating.getStars(),
            rating.getComment(),
            rating.getDate().toString()
        );

        return ResponseEntity.ok(ratingDTO); // Return the created rating
    }

    @GetMapping("/read")
    // Read a rating by id
    public ResponseEntity<Object> read_rating(@RequestParam String id) {
        Rating rating = ratingRepository.findById(id).orElse(null);
        if (rating == null) {
            return ResponseEntity.notFound().build();
        }

        User user = userRepository.findById(rating.getUserId()).orElse(null);

        RatingDTO ratingDTO = new RatingDTO(
            rating.getId(),
            rating.getUserId(),
            user != null ? user.getFirstName() + " " + user.getLastName() : null,
            rating.getBookId(),
            rating.getStars(),
            rating.getComment(),
            rating.getDate().toString()
        );

        return ResponseEntity.ok(ratingDTO); // Return the rating
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

        existingRating.setDate(Instant.now()); // Update the date to now

        User user = userRepository.findById(existingRating.getUserId()).orElse(null);
        RatingDTO ratingDTO = new RatingDTO(
            existingRating.getId(),
            existingRating.getUserId(),
            user != null ? user.getFirstName() + " " + user.getLastName() : null,
            existingRating.getBookId(),
            existingRating.getStars(),
            existingRating.getComment(),
            existingRating.getDate().toString()
        );

        ratingRepository.save(existingRating);
        return ResponseEntity.ok(ratingDTO); // Return the updated rating
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
    public ResponseEntity<Iterable<RatingDTO>> get_ratings_by_user(@RequestParam String userId) {
        Iterable<Rating> ratings = ratingRepository.findByUserId(userId);
        
        ArrayList<RatingDTO> ratingDTOs = new ArrayList<>();
        for (Rating rating : ratings) {
            User user = userRepository.findById(rating.getUserId()).orElse(null);
            RatingDTO ratingDTO = new RatingDTO(
                rating.getId(),
                rating.getUserId(),
                user != null ? user.getFirstName() + " " + user.getLastName() : null,
                rating.getBookId(),
                rating.getStars(),
                rating.getComment(),
                rating.getDate().toString()
            );
            ratingDTOs.add(ratingDTO);
        }

        return ResponseEntity.ok(ratingDTOs); // Return the ratings
    }

    @GetMapping("/get_ratings_by_book")
    // Get all ratings for a book
    public ResponseEntity<Iterable<RatingDTO>> get_ratings_by_book(@RequestParam String bookId) {
        Iterable<Rating> ratings = ratingRepository.findByBookId(bookId);
        
        ArrayList<RatingDTO> ratingDTOs = new ArrayList<>();

        for (Rating rating : ratings) {
            User user = userRepository.findById(rating.getUserId()).orElse(null);
            RatingDTO ratingDTO = new RatingDTO(
                rating.getId(),
                rating.getUserId(),
                user != null ? user.getFirstName() + " " + user.getLastName() : null,
                rating.getBookId(),
                rating.getStars(),
                rating.getComment(),
                rating.getDate().toString()
            );
            ratingDTOs.add(ratingDTO);
        }
        return ResponseEntity.ok(ratingDTOs); // Return the ratings
    }

}
