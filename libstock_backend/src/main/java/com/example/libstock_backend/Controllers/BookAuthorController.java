// Brandon Gascon - modified, removed crossorigin, added PreAuthorization for admin methods //
package com.example.libstock_backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize; // used to authorize use of certain methods only for admins //

import com.example.libstock_backend.Models.BookAuthor;
import com.example.libstock_backend.Repositories.BookAuthorRepository;

@RestController
@RequestMapping("/bookauthor")
public class BookAuthorController {

    @Autowired
    BookAuthorRepository bookauthorRepository;
    
    @PostMapping("/create")
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<BookAuthor> create_bookauthor(@RequestBody BookAuthor bookAuthor) {
        BookAuthor existingBookAuthor = bookauthorRepository.findByAuthorIDAndISBN(bookAuthor.getAuthorID(), bookAuthor.getISBN());
        if (existingBookAuthor != null) {
            return ResponseEntity.badRequest().body(null);
        }
        bookauthorRepository.save(bookAuthor);
        return ResponseEntity.ok(bookAuthor);
    }

    @GetMapping("/read")
    public ResponseEntity<BookAuthor> read_bookauthor(@RequestParam String id) {
        BookAuthor existingBookAuthor = bookauthorRepository.findById(id).orElse(null);
        if (existingBookAuthor == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(existingBookAuthor);
    }

    @PatchMapping("/update")
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<BookAuthor> update_bookauthor(@RequestBody BookAuthor bookAuthor) {
        BookAuthor existingBookAuthor = bookauthorRepository.findById(bookAuthor.getId()).orElse(null);
        if (existingBookAuthor == null) {
            return ResponseEntity.notFound().build();
        }
        existingBookAuthor.setAuthorID(bookAuthor.getAuthorID());
        existingBookAuthor.setISBN(bookAuthor.getISBN());
        bookauthorRepository.save(existingBookAuthor);
        return ResponseEntity.ok(existingBookAuthor);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<BookAuthor> delete_bookauthor(@RequestParam String id) {
        BookAuthor existingBookAuthor = bookauthorRepository.findById(id).orElse(null);
        if (existingBookAuthor == null) {
            return ResponseEntity.notFound().build();
        }
        bookauthorRepository.delete(existingBookAuthor);
        return ResponseEntity.ok(existingBookAuthor);
    }
}
