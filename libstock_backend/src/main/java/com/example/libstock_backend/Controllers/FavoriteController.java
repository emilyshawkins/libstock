package com.example.libstock_backend.Controllers;

import java.util.ArrayList;
import java.util.List;

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

import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.Favorite;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.FavoriteRepository;
import com.example.libstock_backend.Repositories.UserRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/favorite")
public class FavoriteController {

    @Autowired
    public FavoriteRepository favoriteRepository;
    @Autowired
    public BookRepository bookRepository;
    @Autowired
    public UserRepository userRepository;

    @PostMapping("/create")
    // Create a new favorite
    public ResponseEntity<Object> create_favorite(@RequestBody Favorite favorite) {
        if (favorite.getUserId() == null || favorite.getBookId() == null) { // Check if user ID and book ID are provided
            return ResponseEntity.badRequest().body("User ID and Book ID are required.");
        }
        if(bookRepository.findById(favorite.getBookId()).orElse(null) == null) { // Check if book exists
            return ResponseEntity.badRequest().body("Book not found.");
        }
        if(userRepository.findById(favorite.getUserId()).orElse(null) == null) { // Check if user exists
            return ResponseEntity.badRequest().body("User not found.");
        }
        Favorite existingFavorite = favoriteRepository.findByUserIdAndBookId(favorite.getUserId(), favorite.getBookId());
        if (existingFavorite != null) { // Check if favorite already exists
            return ResponseEntity.badRequest().body("Favorite already exists.");
        }
        favoriteRepository.save(favorite);
        return ResponseEntity.ok(favorite);
    }

    @GetMapping("/read")
    // Read a favorite
    public ResponseEntity<Favorite> read_favorite(@RequestParam String id) { 
        Favorite favorite = favoriteRepository.findById(id).orElse(null);
        if (favorite == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(favorite);
    }

    @PatchMapping("/update")
    // Update a favorite
    public ResponseEntity<Favorite> update_favorite(@RequestBody Favorite favorite) { // Delete will probably be a better option
        Favorite existingFavorite = favoriteRepository.findById(favorite.getId()).orElse(null);
        if (existingFavorite == null) {
            return ResponseEntity.notFound().build();
        }

        if (favorite.getUserId() != null) {
            existingFavorite.setUserId(favorite.getUserId());
        }
        if (favorite.getBookId() != null) {
            existingFavorite.setBookId(favorite.getBookId());
        }

        favoriteRepository.save(favorite);
        return ResponseEntity.ok(favorite);
    }

    // @DeleteMapping("/delete")
    // // Delete a favorite
    // public ResponseEntity<Favorite> delete_favorite(@RequestParam String id) {
    //     Favorite favorite = favoriteRepository.findById(id).orElse(null);
    //     if (favorite == null) {
    //         return ResponseEntity.notFound().build();
    //     }
    //     favoriteRepository.delete(favorite);
    //     return ResponseEntity.ok(favorite);
    // }

    @DeleteMapping("/delete")
    // Delete a favorite by user and book ID
    public ResponseEntity<Favorite> delete_favorite_by_ids(@RequestParam String userId, @RequestParam String bookId) {
        Favorite favorite = favoriteRepository.findByUserIdAndBookId(userId, bookId);
        if (favorite == null) {
            return ResponseEntity.notFound().build();
        }
        favoriteRepository.delete(favorite);
        return ResponseEntity.ok(favorite);
    }

    @GetMapping("/get_favorites_by_user")
    // Get all favorites by user
    public ResponseEntity<Iterable<Book>> get_favorites_by_user(@RequestParam String userId) {
        Iterable<Favorite> favorites = favoriteRepository.findByUserId(userId);
        List<Book> books = new ArrayList<>();
        for (Favorite favorite : favorites) { // Get all books from favorites
            Book book = bookRepository.findById(favorite.getBookId()).orElse(null);
            if (book != null) {
                books.add(book);
            }
        }

        return ResponseEntity.ok(books);
    }

    
}
