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
import com.example.libstock_backend.Models.User;
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
    public ResponseEntity<Object> create_wishlist_item(@RequestParam String userId, @RequestParam String bookId) {
        if (userId == null || bookId == null) {
            return ResponseEntity.badRequest().body("User ID and book ID are required.");
        }
        if (bookRepository.findById(bookId).orElse(null) == null) {
            return ResponseEntity.badRequest().body("Book not found.");
        }
        if (userRepository.findById(userId).orElse(null) == null) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        WishlistItem existingWishlistItem = wishlistItemRepository.findByUserId(userId);
        if (existingWishlistItem == null) {
            ArrayList<String> books = new ArrayList<>();
            books.add(bookId);
            existingWishlistItem = new WishlistItem(userId, books);
        }
        else {
            if (existingWishlistItem.getBooks() == null) {
                existingWishlistItem.setBooks(new ArrayList<>());
            }
            if (!existingWishlistItem.getBooks().contains(bookId)) {
                existingWishlistItem.getBooks().add(bookId);
            } else {
                return ResponseEntity.badRequest().body("Book already in wishlist.");
            }
        }

        wishlistItemRepository.save(existingWishlistItem);
        return ResponseEntity.ok(existingWishlistItem);
    }

    @GetMapping("/get")
    // Read a wishlist item by id
    public ResponseEntity<WishlistItem> read_wishlist_item(@RequestParam String userId) {
        WishlistItem wishlistItem = wishlistItemRepository.findByUserId(userId);
        if (wishlistItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(wishlistItem);
    }

    // @PatchMapping("/update")
    // // Update a wishlist item, probably not needed
    // public ResponseEntity<WishlistItem> update_wishlist_item(@RequestBody WishlistItem wishlistItem) {
    //     WishlistItem existingWishlistItem = wishlistItemRepository.findById(wishlistItem.getId()).orElse(null);
    //     if (existingWishlistItem == null) {
    //         return ResponseEntity.notFound().build();
    //     }
        
    //     if (wishlistItem.getUserId() != null) {
    //         existingWishlistItem.setUserId(wishlistItem.getUserId());
    //     }
    //     if (wishlistItem.getBookId() != null) {
    //         existingWishlistItem.setBookId(wishlistItem.getBookId());
    //     }

    //     wishlistItemRepository.save(existingWishlistItem);
    //     return ResponseEntity.ok(existingWishlistItem);
    // }

    @DeleteMapping("/delete")
    // Delete a wishlist item by id
    public ResponseEntity<Object> delete_wishlist_item(@RequestParam String userId, @RequestParam String bookId) {
        WishlistItem wishlistItem = wishlistItemRepository.findByUserId(userId);
        if (wishlistItem == null) {
            return ResponseEntity.ok().body("Wishlist item not found.");
        }
        
        wishlistItem.getBooks().remove(bookId);
        wishlistItemRepository.save(wishlistItem); // Save wishlist item to database

        return ResponseEntity.ok(wishlistItem);
    }

    @GetMapping("/get_wishlist_by_user")
    // Get all wishlist items
    public ResponseEntity<Iterable<Book>> get_all_wishlist_items(@RequestParam String userId) {
        WishlistItem wishlist = wishlistItemRepository.findByUserId(userId);
        List<Book> books = new ArrayList<>();
        for (String bookId : wishlist.getBooks()) {
            Book book = bookRepository.findById(bookId).orElse(null);
            if (book != null) {
                books.add(book);
            }
        }
        return ResponseEntity.ok(books);
    }

    @GetMapping("/share")
    // Share a wishlist item by id
    public ResponseEntity<Object> share_wishlist_item(@RequestParam String id) {
        WishlistItem wishlist = wishlistItemRepository.findById(id).orElse(null);
        if (wishlist == null) {
            return ResponseEntity.notFound().build();
        }

        List<Book> books = new ArrayList<>();
        for (String bookId : wishlist.getBooks()) {
            Book book = bookRepository.findById(bookId).orElse(null);
            if (book != null) {
                books.add(book);
            }
        }

        User user = userRepository.findById(wishlist.getUserId()).orElse(null);

        return ResponseEntity.ok(new ShareDTO(user.getFirstName(), user.getLastName(), books));
    }
}
