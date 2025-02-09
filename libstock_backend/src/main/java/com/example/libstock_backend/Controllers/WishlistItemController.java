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

import com.example.libstock_backend.Models.WishlistItem;
import com.example.libstock_backend.Repositories.WishlistItemRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/wishlist_items")
public class WishlistItemController {
    
    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    @PostMapping("/create")
    public ResponseEntity<WishlistItem> create_wishlist_item(@RequestBody WishlistItem wishlistItem) {
        WishlistItem existingWishlistItem = wishlistItemRepository.findByUserIdAndBookId(wishlistItem.getUserId(), wishlistItem.getBookId());
        if (existingWishlistItem != null) {
            return null;
        }
        wishlistItemRepository.save(wishlistItem);
        return ResponseEntity.ok(wishlistItem);
    }

    @GetMapping("/read")
    public ResponseEntity<WishlistItem> read_wishlist_item(@RequestParam String id) {
        WishlistItem wishlistItem = wishlistItemRepository.findById(id).orElse(null);
        if (wishlistItem == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(wishlistItem);
    }

    @PatchMapping("/update")
    public ResponseEntity<WishlistItem> update_wishlist_item(@RequestBody WishlistItem wishlistItem) {
        WishlistItem existingWishlistItem = wishlistItemRepository.findById(wishlistItem.getId()).orElse(null);
        if (existingWishlistItem == null) {
            return ResponseEntity.notFound().build();
        }
        existingWishlistItem.setUserId(wishlistItem.getUserId());
        existingWishlistItem.setBookId(wishlistItem.getBookId());
        wishlistItemRepository.save(existingWishlistItem);
        return ResponseEntity.ok(existingWishlistItem);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<WishlistItem> delete_wishlist_item(@RequestParam String id) {
        WishlistItem wishlistItem = wishlistItemRepository.findById(id).orElse(null);
        if (wishlistItem == null) {
            return ResponseEntity.notFound().build();
        }
        wishlistItemRepository.delete(wishlistItem);
        return ResponseEntity.ok(wishlistItem);
    }
}
