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

import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Repositories.BookRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/book")
public class BookController {

    @Autowired
    BookRepository BookRepository;

    @PostMapping("/create")
    public ResponseEntity<Book> create_book(@RequestBody Book book) {
        Book existingBook = BookRepository.findByISBN(book.getISBN());
        if (existingBook != null) {
            return ResponseEntity.badRequest().body(null);
        }
        BookRepository.save(book);
        return ResponseEntity.ok(book); 
    }

    @GetMapping("/read")
    public ResponseEntity<Book> read_book(@RequestParam String id) {
        Book book = BookRepository.findById(id).orElse(null);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(book);
    }

    @PatchMapping("/update")
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
        BookRepository.save(existingBook);
        return ResponseEntity.ok(existingBook);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Book> delete_book(@RequestParam String id) {
        Book existingBook = BookRepository.findById(id).orElse(null);
        if (existingBook == null) {
            return ResponseEntity.notFound().build();
        }
        BookRepository.delete(existingBook);
        return ResponseEntity.ok(existingBook);
    }

    @GetMapping("/get_all")
    public ResponseEntity<Iterable<Book>> get_all() {
        return ResponseEntity.ok(BookRepository.findAll());
    }

}