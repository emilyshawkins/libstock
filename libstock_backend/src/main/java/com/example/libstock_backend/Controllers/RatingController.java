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
import com.example.libstock_backend.Repositories.RatingRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/rating")
public class RatingController {
    
    @Autowired
    RatingRepository ratingRepository;

    @PostMapping("/create")
    public ResponseEntity<Rating> create_rating(@RequestBody Rating rating) {
        Rating existingRating = ratingRepository.findByUserIdAndBookId(rating.getUserId(), rating.getBookId());
        if (existingRating != null) {
            return ResponseEntity.badRequest().body(null);
        }
        ratingRepository.save(rating);
        return ResponseEntity.ok(rating);
    }

    @GetMapping("/read")
    public ResponseEntity<Rating> read_rating(@RequestParam String id) {
        Rating rating = ratingRepository.findById(id).orElse(null);
        if (rating == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(rating);
    }

    @PatchMapping("/update")
    public ResponseEntity<Rating> update_rating(@RequestBody Rating rating) {
        Rating existingRating = ratingRepository.findById(rating.getId()).orElse(null);
        if (existingRating == null) {
            return ResponseEntity.notFound().build();
        }
        existingRating.setStars(rating.getStars());
        existingRating.setComment(rating.getComment());
        ratingRepository.save(existingRating);
        return ResponseEntity.ok(existingRating);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Rating> delete_rating(@RequestParam String id) {
        Rating rating = ratingRepository.findById(id).orElse(null);
        if (rating == null) {
            return ResponseEntity.notFound().build();
        }
        ratingRepository.delete(rating);
        return ResponseEntity.ok(rating);
    }

}
