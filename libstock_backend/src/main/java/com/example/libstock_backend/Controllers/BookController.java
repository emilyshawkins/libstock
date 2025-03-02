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
    public BookRepository BookRepository;
    @Autowired
    public BookAuthorRepository BookAuthorRepository;
    @Autowired
    public BookGenreRepository BookGenreRepository;
    @Autowired
    public CheckoutRepository CheckoutRepository;
    @Autowired
    public FavoriteRepository FavoriteRepository;
    @Autowired
    public QueueRepository QueueRepository;
    @Autowired
    public RatingRepository RatingRepository;
    @Autowired
    public WishlistItemRepository WishlistItemRepository;

    @PostMapping("/create")
    // Create a new book
    public ResponseEntity<Object> create_book(@RequestBody Book book) {
        
        if (book.getISBN() != null && !book.getISBN().isBlank() && book.getISBN() != "") {

            Book existingBook = BookRepository.findByISBN(book.getISBN());
            if (existingBook != null) { // Check if the ISBN already exists
                return ResponseEntity.badRequest().body("ISBN already exists");
            }

            if(book.getTitle() != null && !book.getTitle().isBlank() && book.getTitle() != "") {}  
            else { // Check if the title is empty
                book.setTitle("Untitled");
            }
            if(book.getSummary() != null && !book.getSummary().isBlank() && book.getSummary() != "") {} 
            else { // Check if the summary is empty
                book.setSummary("No summary available");
            }
            if(book.getPublicationDate() != null && !book.getPublicationDate().isBlank() && book.getPublicationDate() != "") {} 
            else { // Check if the publication date is empty
                book.setPublicationDate("Unknown");
            }
            if(book.getPrice() != null) {} 
            else { // Check if the price is empty
                book.setPrice(new java.math.BigDecimal("0.00"));
            }
            if(book.getPurchasable() != null) {} 
            else { // Check if the purchasable property is empty
                book.setPurchasable(false);
            }
            if(book.getCount() != null) {} 
            else { // Check if the count is empty
                book.setCount(0);
            }
            if(book.getNumCheckedOut() != null) {} 
            else { // Check if the numCheckedOut is empty
                book.setNumCheckedOut(0);
            }
            if(book.getCover() != null) {} 
            else { // Check if the cover is empty
                book.setCover(null);
            }

            BookRepository.save(book);
            return ResponseEntity.ok(book);
        }
        else {
            return ResponseEntity.badRequest().body("ISBN is required");
        }
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
    public ResponseEntity<Object> update_book(@RequestBody Book book) {
        Book existingBook = BookRepository.findById(book.getId()).orElse(null);
        if (existingBook == null) { // Check if the book exists
            return ResponseEntity.notFound().build();
        }
        if (BookRepository.findByISBN(book.getISBN()) != null) { // Check if the ISBN already exists
            return ResponseEntity.badRequest().body("ISBN already exists");
        }
        else if (book.getISBN() != null) { // Check if the ISBN is empty
            existingBook.setISBN(book.getISBN());
        }
        if (book.getTitle() != null) {
            existingBook.setTitle(book.getTitle());
        }
        if (book.getSummary() != null) {
            existingBook.setSummary(book.getSummary());
        }
        if (book.getPublicationDate() != null) {
            existingBook.setPublicationDate(book.getPublicationDate());
        }
        if (book.getPrice() != null) {
            existingBook.setPrice(book.getPrice());
        }
        if (book.getPurchasable() != null) {
            existingBook.setPurchasable(book.getPurchasable());
        }
        if (book.getCount() != null) {
            existingBook.setCount(book.getCount());
        }
        if (book.getNumCheckedOut() != null) {
            existingBook.setNumCheckedOut(book.getNumCheckedOut());
        }
        if (book.getCover() != null) {
            existingBook.setCover(book.getCover());
        }

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
            return ResponseEntity.status(Response.SC_INTERNAL_SERVER_ERROR).body("Error uploading image");
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