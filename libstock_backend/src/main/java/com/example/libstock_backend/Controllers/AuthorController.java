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
import org.springframework.security.access.prepost.PreAuthorize; // used to authorize use of certain methods only for admins //

@RestController
@RequestMapping("/author")
public class AuthorController {

    @Autowired
    public AuthorRepository authorRepository;
    @Autowired
    public BookAuthorRepository bookAuthorRepository;

    @PostMapping("/create")
    // Create a new author
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<Object> create_author(@RequestBody Author author) {
        if (author.getFirstName() != null && !author.getFirstName().isBlank() && author.getFirstName() != "") { // Check if the first name is not null or blank
            if (author.getLastName() != null && !author.getLastName().isBlank() && author.getLastName() != "") { // Check if the last name is not null or blank
                authorRepository.save(author); 
                return ResponseEntity.ok(author);
            } else { // If the last name is null or blank, set it to null
                author.setLastName(null);
                authorRepository.save(author);
                return ResponseEntity.ok(author);
            }
        } else {
            return ResponseEntity.badRequest().body("First name must not be blank.");
        }
    }

    @GetMapping("/read")
    // Read an author
    public ResponseEntity<Object> read_author(@RequestParam String id) {
        Author author = authorRepository.findById(id).orElse(null);
        if (author == null) { // Check if the author exists
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(author);
    }

    @PatchMapping("/update")
    // Update an author
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<Author> update_author(@RequestBody Author author) {
        Author existingAuthor = authorRepository.findById(author.getId()).orElse(null);
        if (existingAuthor == null) { // Check if the author exists
            return ResponseEntity.notFound().build(); 
        }

        if (author.getFirstName() != null) { // Check if the first name is not null
            existingAuthor.setFirstName(author.getFirstName()); // Update the first name
        }
        if (author.getLastName() != null) { // Check if the last name is not null
            existingAuthor.setLastName(author.getLastName()); // Update the last name
        }
   
        authorRepository.save(existingAuthor);
        return ResponseEntity.ok(existingAuthor);
    }

    @DeleteMapping("/delete")
    // Delete an author
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<Author> delete_author(@RequestParam String id) {
        Author author = authorRepository.findById(id).orElse(null);
        if (author == null) { // Check if the author exists
            return ResponseEntity.notFound().build();
        }

        bookAuthorRepository.deleteAllByAuthorId(id); // Delete all book authors with the author id

        authorRepository.delete(author);
        return ResponseEntity.ok(author);
    }

    @GetMapping("/get_all")
    // Get all authors
    public ResponseEntity<Iterable<Author>> get_all_authors() {
        Iterable<Author> authors = authorRepository.findAll(); // Get all authors
        return ResponseEntity.ok(authors);
    }    
}