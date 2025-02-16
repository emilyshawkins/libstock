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

import com.example.libstock_backend.Models.Author;
import com.example.libstock_backend.Repositories.AuthorRepository;
import com.example.libstock_backend.Repositories.BookAuthorRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/author")
public class AuthorController {

    @Autowired
    AuthorRepository authorRepository;
    @Autowired
    BookAuthorRepository bookAuthorRepository;

    @PostMapping("/create")
    // Create a new author
    public ResponseEntity<Author> create_author(@RequestBody Author author) {
        if (author.getFirstName() == null || author.getLastName() == null) { // Check if the first name or last name is null
            return ResponseEntity.badRequest().body(null);
        }
        else if (author.getFirstName().equals("") || author.getLastName().equals("")) {
            return ResponseEntity.badRequest().body(null);
        }
        else {
            authorRepository.save(author);
            return ResponseEntity.ok(author);
        }
    }

    @GetMapping("/read")
    // Read an author
    public ResponseEntity<Author> read_author(@RequestParam String id) {
        Author author = authorRepository.findById(id).orElse(null);
        if (author == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(author);
    }

    @PatchMapping("/update")
    // Update an author
    public ResponseEntity<Author> update_author(@RequestBody Author author) {
        Author existingAuthor = authorRepository.findById(author.getId()).orElse(null);
        if (existingAuthor == null) {
            return ResponseEntity.notFound().build();
        }
        existingAuthor.setFirstName(author.getFirstName());
        existingAuthor.setLastName(author.getLastName());
        authorRepository.save(existingAuthor);
        return ResponseEntity.ok(existingAuthor);
    }

    @DeleteMapping("/delete")
    // Delete an author
    public ResponseEntity<Author> delete_author(@RequestParam String id) {
        Author author = authorRepository.findById(id).orElse(null);
        if (author == null) {
            return ResponseEntity.notFound().build();
        }

        bookAuthorRepository.deleteAllByAuthorId(id);

        authorRepository.delete(author);
        return ResponseEntity.ok(author);
    }

    @GetMapping("/get_all")
    // Get all authors
    public ResponseEntity<Iterable<Author>> get_all_authors() {
        Iterable<Author> authors = authorRepository.findAll();
        return ResponseEntity.ok(authors);
    }    
}
