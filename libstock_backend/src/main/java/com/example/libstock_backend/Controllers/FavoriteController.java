package com.example.libstock_backend.Controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.libstock_backend.DTOs.ShareDTO;
import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.Favorite;
import com.example.libstock_backend.Models.User;
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
    public ResponseEntity<Object> create_favorite(@RequestParam String userId, @RequestParam String bookId) {
        if (userId == null || userId == null) { // Check if user ID and book ID are provided
            return ResponseEntity.badRequest().body("User ID and Book ID are required.");
        }
        if(bookRepository.findById(bookId).orElse(null) == null) { // Check if book exists
            return ResponseEntity.badRequest().body("Book not found.");
        }
        if(userRepository.findById(userId).orElse(null) == null) { // Check if user exists
            return ResponseEntity.badRequest().body("User not found.");
        }
        Favorite existingFavorite = favoriteRepository.findByUserId(userId); // Check if favorite already exists
        if (existingFavorite == null) { // Create a new favorite if it doesn't exist
            ArrayList<String> books = new ArrayList<>();
            books.add(bookId);
            existingFavorite = new Favorite(userId, books);
        }
        else { // Add book to existing favorite
            if (existingFavorite.getBooks() == null) {
                existingFavorite.setBooks(new ArrayList<>());
            }
            if (!existingFavorite.getBooks().contains(bookId)) {
                existingFavorite.getBooks().add(bookId);
            } else {
                return ResponseEntity.badRequest().body("Book already in favorites.");
            }
        }
        
        favoriteRepository.save(existingFavorite); // Save favorite to database
        return ResponseEntity.ok(existingFavorite); // Return favorite
    }

    @GetMapping("/get")
    // Read a favorite
    public ResponseEntity<Favorite> read_favorite(@RequestParam String userId) { 
        Favorite favorite = favoriteRepository.findByUserId(userId); // Find favorite by user ID
        if (favorite == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(favorite);
    }

    // @PatchMapping("/update")
    // // Update a favorite
    // public ResponseEntity<Favorite> update_favorite(@RequestBody Favorite favorite) { // Delete will probably be a better option
    //     Favorite existingFavorite = favoriteRepository.findById(favorite.getId()).orElse(null);
    //     if (existingFavorite == null) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     if (favorite.getUserId() != null) {
    //         existingFavorite.setUserId(favorite.getUserId());
    //     }
    //     if (favorite.getBookId() != null) {
    //         existingFavorite.setBookId(favorite.getBookId());
    //     }

    //     favoriteRepository.save(favorite);
    //     return ResponseEntity.ok(favorite);
    // }

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
    public ResponseEntity<Object> delete_favorite_by_ids(@RequestParam String userId, @RequestParam String bookId) {
        Favorite favorite = favoriteRepository.findByUserId(userId); // Find favorite by user ID
        if (favorite == null) {
            return ResponseEntity.ok().body("Favorite not found.");
        }

        favorite.getBooks().remove(bookId); // Remove book from favorites
        favoriteRepository.save(favorite); // Save favorite to database
        
        return ResponseEntity.ok(favorite);
    }

    @GetMapping("/get_favorites_by_user")
    // Get all favorites by user
    public ResponseEntity<Iterable<Book>> get_favorites_by_user(@RequestParam String userId) {
        Favorite favorite = favoriteRepository.findByUserId(userId);
        List<Book> books = new ArrayList<>();
        for (String bookId : favorite.getBooks()) { // Get all books from favorites
            Book book = bookRepository.findById(bookId).orElse(null);
            if (book != null) {
                books.add(book);
            }
        }

        return ResponseEntity.ok(books);
    }

    @GetMapping("/share")
    // Share a favorite by ID
    public ResponseEntity<Object> share_favorite(@RequestParam String id) {
        Favorite favorite = favoriteRepository.findById(id).orElse(null);
        if (favorite == null) {
            return ResponseEntity.notFound().build();
        }

        List<Book> books = new ArrayList<>();
        for (String bookId : favorite.getBooks()) { // Get all books from favorites
            Book book = bookRepository.findById(bookId).orElse(null);
            if (book != null) {
                books.add(book);
            }
        }

        User user = userRepository.findById(favorite.getUserId()).orElse(null);

        return ResponseEntity.ok(new ShareDTO(user.getFirstName(), user.getLastName(), books)); // Return shared favorite
    }
    
}
