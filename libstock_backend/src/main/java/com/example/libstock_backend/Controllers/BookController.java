package com.example.libstock_backend.Controllers;

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

import com.example.libstock_backend.DTOs.BookUpdateDTO;
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
    public ResponseEntity<Book> read_book(@RequestParam int ISBN) {
        Book book = BookRepository.findByISBN(ISBN);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(book);
    }

    @PatchMapping("/update")
    public ResponseEntity<Book> update_book(@RequestBody BookUpdateDTO book) {
        Book existingBook = BookRepository.findByISBN(book.getCurrentISBN());
        if (existingBook == null) {
            return ResponseEntity.notFound().build();
        }
        existingBook.setISBN(book.getNewISBN());
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

    @PatchMapping("/delete")
    public ResponseEntity<Book> delete_book(@RequestParam int ISBN) {
        Book existingBook = BookRepository.findByISBN(ISBN);
        if (existingBook == null) {
            return ResponseEntity.notFound().build();
        }
        BookRepository.delete(existingBook);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/get_all")
    public ResponseEntity<Iterable<Book>> get_all() {
        System.out.println("Getting all books");
        System.out.println(BookRepository.findAll());
        return ResponseEntity.ok(BookRepository.findAll());
    }

}