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
import com.example.libstock_backend.Models.BookGenre;
import com.example.libstock_backend.Models.Genre;
import com.example.libstock_backend.Repositories.BookGenreRepository;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.GenreRepository;
import org.springframework.security.access.prepost.PreAuthorize; // used to authorize use of certain methods only for admins //

@RestController
@RequestMapping("/bookgenre")
public class BookGenreController {
    @Autowired
    public BookGenreRepository bookgenreRepository;
    @Autowired
    public GenreRepository genreRepository;
    @Autowired
    public BookRepository bookRepository;

    @PostMapping("/create")
    // Create a new book genre
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<Object> create_bookgenre(@RequestBody BookGenre bookGenre) {
        if (bookGenre.getGenreId() == null || bookGenre.getBookId() == null) {
            return ResponseEntity.badRequest().body("Genre ID and Book ID are required");
        }
        if (genreRepository.findById(bookGenre.getGenreId()).orElse(null) == null) {
            return ResponseEntity.badRequest().body("Genre does not exist");
        }
        if (bookRepository.findById(bookGenre.getBookId()).orElse(null) == null) {
            return ResponseEntity.badRequest().body("Book does not exist");
        }

        BookGenre existingBookGenre = bookgenreRepository.findByGenreIdAndBookId(bookGenre.getGenreId(), bookGenre.getBookId());
        if (existingBookGenre != null) {
            return ResponseEntity.badRequest().body("Book and Genre already associated.");
        }

        bookgenreRepository.save(bookGenre);
        return ResponseEntity.ok(bookGenre);
    }

    @GetMapping("/read")
    // Read a book genre
    public ResponseEntity<BookGenre> read_bookgenre(@RequestParam String id) {
        BookGenre existingBookGenre = bookgenreRepository.findById(id).orElse(null);
        if (existingBookGenre == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(existingBookGenre);
    }

    @PatchMapping("/update")
    // Update a book genre
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<BookGenre> update_bookgenre(@RequestBody BookGenre bookGenre) { // Delete will probably be used more
        BookGenre existingBookGenre = bookgenreRepository.findById(bookGenre.getId()).orElse(null);
        if (existingBookGenre == null) {
            return ResponseEntity.notFound().build();
        }
        if (bookGenre.getGenreId() != null) {
            existingBookGenre.setGenreId(bookGenre.getGenreId());
        }
        if (bookGenre.getBookId() != null) {
            existingBookGenre.setBookId(bookGenre.getBookId());
        }
        bookgenreRepository.save(existingBookGenre);
        return ResponseEntity.ok(existingBookGenre);
    }

    @DeleteMapping("/delete")
    // Delete a book genre
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<BookGenre> delete_bookgenre(@RequestParam String id) {
        BookGenre existingBookGenre = bookgenreRepository.findById(id).orElse(null);
        if (existingBookGenre == null) {
            return ResponseEntity.notFound().build();
        }
        bookgenreRepository.delete(existingBookGenre);
        return ResponseEntity.ok(existingBookGenre);
    }

    @GetMapping("/get_genres_by_book")
    // Get all genres by book id
    public ResponseEntity<Iterable<Genre>> get_genres_by_book(@RequestParam String bookId) {
        Iterable<BookGenre> bookGenres = bookgenreRepository.findByBookId(bookId);
        List<Genre> genres = new ArrayList<>();
        for (BookGenre bookGenre : bookGenres) {
            Genre genre = genreRepository.findById(bookGenre.getGenreId()).orElse(null);
            if (genre != null) {
                genres.add(genre);
            }
        }
        return ResponseEntity.ok(genres);

    }

    @GetMapping("/get_books_by_genre")
    // Get all books by genre id
    public ResponseEntity<Iterable<Book>> get_books_by_genre(@RequestParam String genreId) {
        Iterable<BookGenre> bookGenres = bookgenreRepository.findByGenreId(genreId);
        List<Book> books = new ArrayList<>();
        for (BookGenre bookGenre : bookGenres) {
            Book book = bookRepository.findById(bookGenre.getBookId()).orElse(null);
            if (book != null) {
                books.add(book);
            }
        }
        return ResponseEntity.ok(books);
    }

    @GetMapping("/get_ids")
    // Get all book genre ids
    public ResponseEntity<Iterable<String>> get_genre_ids(@RequestParam String bookId) {
        Iterable<BookGenre> bookGenres = bookgenreRepository.findByBookId(bookId); // Get all genres by book id
        List<String> bookgenreIds = new ArrayList<>(); // Create list to store genre ids
        for (BookGenre bookGenre : bookGenres) { // Loop through all genres
            bookgenreIds.add(bookGenre.getId()); // Add genre id to list
        }
        return ResponseEntity.ok(bookgenreIds);
    }
        
}