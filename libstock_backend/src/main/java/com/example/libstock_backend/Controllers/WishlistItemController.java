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
import com.example.libstock_backend.Models.WishlistItem;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.UserRepository;
import com.example.libstock_backend.Repositories.WishlistItemRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/wishlist")
public class WishlistItemController {
    
    @Autowired
    public WishlistItemRepository wishlistItemRepository;
    @Autowired
    public BookRepository bookRepository;
    @Autowired
    public UserRepository userRepository;

    @PostMapping("/create")
    // Create a new wishlist item
    public ResponseEntity<Object> create_wishlist_item(@RequestBody WishlistItem wishlistItem) {
        if (wishlistItem.getUserId() == null || wishlistItem.getBookId() == null) {
            return ResponseEntity.badRequest().body("User ID and book ID are required.");
        }
        if (bookRepository.findById(wishlistItem.getBookId()).orElse(null) == null) {
            return ResponseEntity.badRequest().body("Book not found.");
        }
        if (userRepository.findById(wishlistItem.getUserId()).orElse(null) == null) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        WishlistItem existingWishlistItem = wishlistItemRepository.findByUserIdAndBookId(wishlistItem.getUserId(), wishlistItem.getBookId());
        if (existingWishlistItem != null) {
            return ResponseEntity.badRequest().body("Wishlist item already exists.");
        }

        wishlistItemRepository.save(wishlistItem);
        return ResponseEntity.ok(wishlistItem);
    }

    @GetMapping("/read")
    // Read a wishlist item by id
    public ResponseEntity<WishlistItem> read_wishlist_item(@RequestParam String id) {
        WishlistItem wishlistItem = wishlistItemRepository.findById(id).orElse(null);
        if (wishlistItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(wishlistItem);
    }

    @PatchMapping("/update")
    // Update a wishlist item, probably not needed
    public ResponseEntity<WishlistItem> update_wishlist_item(@RequestBody WishlistItem wishlistItem) {
        WishlistItem existingWishlistItem = wishlistItemRepository.findById(wishlistItem.getId()).orElse(null);
        if (existingWishlistItem == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (wishlistItem.getUserId() != null) {
            existingWishlistItem.setUserId(wishlistItem.getUserId());
        }
        if (wishlistItem.getBookId() != null) {
            existingWishlistItem.setBookId(wishlistItem.getBookId());
        }

        wishlistItemRepository.save(existingWishlistItem);
        return ResponseEntity.ok(existingWishlistItem);
    }

    @DeleteMapping("/delete")
    // Delete a wishlist item by id
    public ResponseEntity<WishlistItem> delete_wishlist_item(@RequestParam String userId, @RequestParam String bookId) {
        WishlistItem wishlistItem = wishlistItemRepository.findByUserIdAndBookId(userId, bookId);
        if (wishlistItem == null) {
            return ResponseEntity.notFound().build();
        }
        wishlistItemRepository.delete(wishlistItem);
        return ResponseEntity.ok(wishlistItem);
    }

    @GetMapping("/get_wishlist_by_user")
    // Get all wishlist items
    public ResponseEntity<Iterable<Book>> get_all_wishlist_items(@RequestParam String userId) {
        Iterable<WishlistItem> wishlistItems = wishlistItemRepository.findByUserId(userId);
        List<Book> books = new ArrayList<>();
        for (WishlistItem wishlistItem : wishlistItems) {
            Book book = bookRepository.findById(wishlistItem.getBookId()).orElse(null);
            if (book != null) {
                books.add(book);
            }
        }
        return ResponseEntity.ok(books);
    }
}
