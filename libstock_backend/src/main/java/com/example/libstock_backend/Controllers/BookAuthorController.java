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

import com.example.libstock_backend.Models.Author;
import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.BookAuthor;
import com.example.libstock_backend.Repositories.AuthorRepository;
import com.example.libstock_backend.Repositories.BookAuthorRepository;
import com.example.libstock_backend.Repositories.BookRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/bookauthor")
public class BookAuthorController {

    @Autowired
    public BookAuthorRepository bookauthorRepository;
    @Autowired
    public BookRepository bookRepository;
    @Autowired
    public AuthorRepository authorRepository;
    
    @PostMapping("/create")
    // Create a new book author
    public ResponseEntity<Object> create_bookauthor(@RequestBody BookAuthor bookAuthor) {
        if (bookAuthor.getAuthorId() == null || bookAuthor.getBookId() == null) {
            return ResponseEntity.badRequest().body("Author ID and Book ID are required.");
        }
        if (authorRepository.findById(bookAuthor.getAuthorId()).orElse(null) == null) {
            return ResponseEntity.badRequest().body("Author does not exist.");
        }
        if (bookRepository.findById(bookAuthor.getBookId()).orElse(null) == null) {
            return ResponseEntity.badRequest().body("Book does not exist.");
        }

        BookAuthor existingBookAuthor = bookauthorRepository.findByAuthorIdAndBookId(bookAuthor.getAuthorId(), bookAuthor.getBookId());
        if (existingBookAuthor != null) {
            return ResponseEntity.badRequest().body("Book and author already associated.");
        }
        bookauthorRepository.save(bookAuthor);
        return ResponseEntity.ok(bookAuthor);
    }

    @GetMapping("/read")
    // Read a book author
    public ResponseEntity<BookAuthor> read_bookauthor(@RequestParam String id) {
        BookAuthor existingBookAuthor = bookauthorRepository.findById(id).orElse(null);
        if (existingBookAuthor == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(existingBookAuthor);
    }

    @PatchMapping("/update")
    // Update a book author
    public ResponseEntity<BookAuthor> update_bookauthor(@RequestBody BookAuthor bookAuthor) { // Probably delete over update
        BookAuthor existingBookAuthor = bookauthorRepository.findById(bookAuthor.getId()).orElse(null);
        if (existingBookAuthor == null) {
            return ResponseEntity.notFound().build();
        }

        if (bookAuthor.getAuthorId() != null) {
            existingBookAuthor.setAuthorId(bookAuthor.getAuthorId());
        }
        if (bookAuthor.getBookId() != null) {
            existingBookAuthor.setBookId(bookAuthor.getBookId());
        }

        bookauthorRepository.save(existingBookAuthor);
        return ResponseEntity.ok(existingBookAuthor);
    }

    @DeleteMapping("/delete")
    // Delete a book author
    public ResponseEntity<BookAuthor> delete_bookauthor(@RequestParam String id) {
        BookAuthor existingBookAuthor = bookauthorRepository.findById(id).orElse(null);
        if (existingBookAuthor == null) {
            return ResponseEntity.notFound().build();
        }
        bookauthorRepository.delete(existingBookAuthor);
        return ResponseEntity.ok(existingBookAuthor);
    }

    @GetMapping("/get_books_by_author")
    // Get books by author
    public ResponseEntity<Iterable<Book>> get_books_by_author(@RequestParam String authorId) {
        Iterable<BookAuthor> bookauthors = bookauthorRepository.findByAuthorId(authorId);
        List<Book> books = new ArrayList<>();
        for (BookAuthor bookauthor : bookauthors) {
            Book book = bookRepository.findById(bookauthor.getBookId()).orElse(null);
            if (book != null) {
                books.add(book);
            }
        }
        return ResponseEntity.ok(books);
    }

    @GetMapping("/get_authors_by_book")
    // Get authors by book
    public ResponseEntity<Iterable<Author>> get_authors_by_book(@RequestParam String bookId) {
        Iterable<BookAuthor> bookauthors = bookauthorRepository.findByBookId(bookId);
        List<Author> authors = new ArrayList<>();
        for (BookAuthor bookauthor : bookauthors) {
            Author author = authorRepository.findById(bookauthor.getAuthorId()).orElse(null);
            if (author != null) {
                authors.add(author);
            }
        }
        return ResponseEntity.ok(authors);
    }

    @GetMapping("/get_ids")
    // Get all book author ids
    public ResponseEntity<Iterable<String>> get_genre_ids(@RequestParam String bookId) {
        Iterable<BookAuthor> bookAuthors = bookauthorRepository.findByBookId(bookId); // Get all authors by book id
        List<String> bookauthorIds = new ArrayList<>(); // Create list to store genre ids
        for (BookAuthor bookAuthor : bookAuthors) { // Loop through all book authors
            bookauthorIds.add(bookAuthor.getId()); // Add genre id to list
        }
        return ResponseEntity.ok(bookauthorIds);
    }
}
