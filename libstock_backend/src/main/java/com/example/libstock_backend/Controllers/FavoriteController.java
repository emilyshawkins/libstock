package com.example.libstock_backend.Controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/favorite")
public class FavoriteController {

    @Autowired
    FavoriteRepository favoriteRepository;
    @Autowired
    BookRepository bookRepository;

    @PostMapping("/create")
    public ResponseEntity<Favorite> create_favorite(@RequestBody Favorite favorite) {
        if (favorite.getUserId() == null || favorite.getBookId() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Favorite existingFavorite = favoriteRepository.findByUserIdAndBookId(favorite.getUserId(), favorite.getBookId());
        if (existingFavorite != null) {
            return ResponseEntity.badRequest().body(null);
        }
        favoriteRepository.save(favorite);
        return ResponseEntity.ok(favorite);
    }

    @GetMapping("/read")
    public ResponseEntity<Favorite> read_favorite(@RequestParam String id) {
        Favorite favorite = favoriteRepository.findById(id).orElse(null);
        if (favorite == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(favorite);
    }

    @PatchMapping("/update")
    public ResponseEntity<Favorite> update_favorite(@RequestBody Favorite favorite) {
        Favorite existingFavorite = favoriteRepository.findById(favorite.getId()).orElse(null);
        if (existingFavorite == null) {
            return ResponseEntity.notFound().build();
        }
        favoriteRepository.save(favorite);
        return ResponseEntity.ok(favorite);
    }

    @PostMapping("/delete")
    public ResponseEntity<Favorite> delete_favorite(@RequestParam String id) {
        Favorite favorite = favoriteRepository.findById(id).orElse(null);
        if (favorite == null) {
            return ResponseEntity.notFound().build();
        }
        favoriteRepository.delete(favorite);
        return ResponseEntity.ok(favorite);
    }

    @GetMapping("/get_favorites_by_user")
    public ResponseEntity<Iterable<Book>> get_favorites_by_user(@RequestParam String userId) {
        Iterable<Favorite> favorites = favoriteRepository.findByUserId(userId);
        List<Book> books = new ArrayList<>();
        for (Favorite favorite : favorites) {
            Book book = bookRepository.findById(favorite.getBookId()).orElse(null);
            if (book != null) {
                books.add(book);
            }
        }

        return ResponseEntity.ok(books);
    }

    
}
