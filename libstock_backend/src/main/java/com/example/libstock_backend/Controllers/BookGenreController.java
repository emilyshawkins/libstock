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
import org.springframework.web.service.annotation.PatchExchange;

import com.example.libstock_backend.Models.BookGenre;
import com.example.libstock_backend.Repositories.BookGenreRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/bookgenre")
public class BookGenreController {
    @Autowired
    BookGenreRepository bookgenreRepository;

    @PostMapping("/create")
    public ResponseEntity<BookGenre> create_bookgenre(@RequestBody BookGenre bookGenre) {
        BookGenre existingBookGenre = bookgenreRepository.findByGenreNameAndISBN(bookGenre.getGenreName(), bookGenre.getISBN());
        if (existingBookGenre != null) {
            return ResponseEntity.badRequest().body(null);
        }
        bookgenreRepository.save(bookGenre);
        return ResponseEntity.ok(bookGenre);
    }

    @GetMapping("/read")
    public ResponseEntity<BookGenre> read_bookgenre(@RequestParam String id) {
        BookGenre existingBookGenre = bookgenreRepository.findById(id).orElse(null);
        if (existingBookGenre == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(existingBookGenre);
    }

    @PatchMapping("/update")
    public ResponseEntity<BookGenre> update_bookgenre(@RequestBody BookGenre bookGenre) {
        BookGenre existingBookGenre = bookgenreRepository.findById(bookGenre.getId()).orElse(null);
        if (existingBookGenre == null) {
            return ResponseEntity.notFound().build();
        }
        existingBookGenre.setGenreName(bookGenre.getGenreName());
        existingBookGenre.setISBN(bookGenre.getISBN());
        bookgenreRepository.save(existingBookGenre);
        return ResponseEntity.ok(existingBookGenre);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<BookGenre> delete_bookgenre(@RequestParam String id) {
        BookGenre existingBookGenre = bookgenreRepository.findById(id).orElse(null);
        if (existingBookGenre == null) {
            return ResponseEntity.notFound().build();
        }
        bookgenreRepository.delete(existingBookGenre);
        return ResponseEntity.ok(existingBookGenre);
    }
}
