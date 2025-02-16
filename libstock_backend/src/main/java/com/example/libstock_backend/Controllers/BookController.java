package com.example.libstock_backend.Controllers;

import java.io.IOException;
import java.util.Base64;

import org.apache.catalina.connector.Response;
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
import org.springframework.web.multipart.MultipartFile;

import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Repositories.BookAuthorRepository;
import com.example.libstock_backend.Repositories.BookGenreRepository;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.CheckoutRepository;
import com.example.libstock_backend.Repositories.FavoriteRepository;
import com.example.libstock_backend.Repositories.QueueRepository;
import com.example.libstock_backend.Repositories.RatingRepository;
import com.example.libstock_backend.Repositories.WishlistItemRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/book")
public class BookController {

    @Autowired
    BookRepository BookRepository;
    @Autowired
    BookAuthorRepository BookAuthorRepository;
    @Autowired
    BookGenreRepository BookGenreRepository;
    @Autowired
    CheckoutRepository CheckoutRepository;
    @Autowired
    FavoriteRepository FavoriteRepository;
    @Autowired
    QueueRepository QueueRepository;
    @Autowired
    RatingRepository RatingRepository;
    @Autowired
    WishlistItemRepository WishlistItemRepository;

    @PostMapping("/create")
    // Create a new book
    public ResponseEntity<Book> create_book(@RequestBody Book book) {
        if (book.getISBN() == null || book.getTitle() == null || book.getSummary() == null || book.getPublicationDate() == null || book.getPrice() == null || book.getPurchaseable() == null || book.getCover() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Book existingBook = BookRepository.findByISBN(book.getISBN());
        if (existingBook != null) {
            return ResponseEntity.badRequest().body(null);
        }
        if (book.getCount() < 0 || book.getNumCheckedOut() < 0) { // Check if the count or numCheckedOut is less than 0
            book.setCount(0);
            book.setNumCheckedOut(0);
        }
        BookRepository.save(book);
        return ResponseEntity.ok(book); 
    }

    @GetMapping("/read")
    // Read a book
    public ResponseEntity<Book> read_book(@RequestParam String id) {
        Book book = BookRepository.findById(id).orElse(null);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(book);
    }

    @PatchMapping("/update")
    // Update a book
    public ResponseEntity<Book> update_book(@RequestBody Book book) {
        Book existingBook = BookRepository.findById(book.getId()).orElse(null);
        if (existingBook == null) {
            return ResponseEntity.notFound().build();
        }
        existingBook.setISBN(book.getISBN());
        existingBook.setTitle(book.getTitle());
        existingBook.setSummary(book.getSummary());
        existingBook.setPublicationDate(book.getPublicationDate());
        existingBook.setPrice(book.getPrice());
        existingBook.setPurchaseable(book.getPurchaseable());
        existingBook.setCount(book.getCount());
        existingBook.setNumCheckedOut(book.getNumCheckedOut());
        existingBook.setCover(book.getCover());
        BookRepository.save(existingBook);
        return ResponseEntity.ok(existingBook);
    }

    @DeleteMapping("/delete")
    // Delete a book
    public ResponseEntity<Book> delete_book(@RequestParam String id) {
        Book existingBook = BookRepository.findById(id).orElse(null);
        if (existingBook == null) {
            return ResponseEntity.notFound().build();
        }
        // Delete all related entities
        BookAuthorRepository.deleteAllByBookId(id); 
        BookGenreRepository.deleteAllByBookId(id);
        CheckoutRepository.deleteAllByBookId(id);
        FavoriteRepository.deleteAllByBookId(id);
        QueueRepository.deleteAllByBookId(id);
        RatingRepository.deleteAllByBookId(id);
        WishlistItemRepository.deleteAllByBookId(id);
        BookRepository.delete(existingBook);
        return ResponseEntity.ok(existingBook);
    }

    @GetMapping("/get_all")
    // Get all books
    public ResponseEntity<Iterable<Book>> get_all() {
        return ResponseEntity.ok(BookRepository.findAll());
    }

    @PostMapping("/set_cover")
    // Set the cover of a book
    public ResponseEntity<String> set_cover(@RequestParam String id, @RequestParam("cover") MultipartFile cover) {
        Book existingBook = BookRepository.findById(id).orElse(null);
        if (existingBook == null) {
            return ResponseEntity.notFound().build();
        }
        try {
            existingBook.setCover(cover.getBytes());
        } catch (IOException e) {
            return ResponseEntity.status(Response.SC_INTERNAL_SERVER_ERROR).body(null);
        }        
        BookRepository.save(existingBook);
        
        String cover_img = Base64.getEncoder().encodeToString(existingBook.getCover());
        return ResponseEntity.ok(cover_img);
    }

    @GetMapping("/get_cover")
    // Get the cover of a book
    public ResponseEntity<String> get_cover(@RequestParam String id) {
        Book existingBook = BookRepository.findById(id).orElse(null);
        if (existingBook == null) {
            return ResponseEntity.notFound().build();
        }
        String cover_img = Base64.getEncoder().encodeToString(existingBook.getCover());
        return ResponseEntity.ok(cover_img);
    }

}