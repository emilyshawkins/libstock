package com.example.libstock_backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.libstock_backend.Models.Author;
import com.example.libstock_backend.Repositories.AuthorRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/author")
public class AuthorController {

    @Autowired
    AuthorRepository authorRepository;

    @PostMapping("/create")
    public ResponseEntity<Author> create(@RequestBody Author author) {
        Author existingAuthor = authorRepository.findById(author.getId()).orElse(null);
        if (existingAuthor != null) {
            return ResponseEntity.badRequest().body(null);
        }
        authorRepository.save(author);
        return ResponseEntity.ok(author);
    }

    @GetMapping("/read")
    public ResponseEntity<Author> read(@RequestParam String id) {
        Author author = authorRepository.findById(id).orElse(null);
        if (author == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(author);
    }

    @PostMapping("/update")
    public ResponseEntity<Author> update(@RequestBody Author author) {
        Author existingAuthor = authorRepository.findById(author.getId()).orElse(null);
        if (existingAuthor == null) {
            return ResponseEntity.notFound().build();
        }
        existingAuthor.setFirstName(author.getFirstName());
        existingAuthor.setLastName(author.getLastName());
        authorRepository.save(existingAuthor);
        return ResponseEntity.ok(existingAuthor);
    }

    @PostMapping("/delete")
    public ResponseEntity<Author> delete(@RequestParam String id) {
        Author author = authorRepository.findById(id).orElse(null);
        if (author == null) {
            return ResponseEntity.notFound().build();
        }
        authorRepository.delete(author);
        return ResponseEntity.ok(author);
    }

    
}
