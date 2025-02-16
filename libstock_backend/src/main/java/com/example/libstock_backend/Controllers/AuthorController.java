// Brandon Gascon - modified, removed crossorigin, added PreAuthorization for admin methods //
package com.example.libstock_backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize; // used to authorize use of certain methods only for admins //
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

@RestController
@RequestMapping("/author")
public class AuthorController {

    @Autowired
    AuthorRepository authorRepository;

    @PostMapping("/create")
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<Author> create_author(@RequestBody Author author) {
        Author existingAuthor = authorRepository.findById(author.getId()).orElse(null);
        if (existingAuthor != null) {
            return ResponseEntity.badRequest().body(null);
        }
        authorRepository.save(author);
        return ResponseEntity.ok(author);
    }

    @GetMapping("/read")
    public ResponseEntity<Author> read_author(@RequestParam String id) {
        Author author = authorRepository.findById(id).orElse(null);
        if (author == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(author);
    }

    @PatchMapping("/update")
    @PreAuthorize("principal.isAdmin == true")
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
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<Author> delete_author(@RequestParam String id) {
        Author author = authorRepository.findById(id).orElse(null);
        if (author == null) {
            return ResponseEntity.notFound().build();
        }
        authorRepository.delete(author);
        return ResponseEntity.ok(author);
    }

    
}
