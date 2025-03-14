// Brandon Gascon - modified, removed crossorigin, added PreAuthorization for admin methods //
package com.example.libstock_backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController; // used to authorize use of certain methods only for admins //

import com.example.libstock_backend.Models.Genre;
import com.example.libstock_backend.Repositories.GenreRepository;

@RestController
@RequestMapping("/genre")
public class GenreController {

    @Autowired
    GenreRepository genreRepository; 

    @PostMapping("/create")
    // Create a new Genre
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<Object> create_genre(@RequestBody Genre genre) {
        if (genre.getName() == null) { // Name is required
            return ResponseEntity.badRequest().body("Name is required");
        }
        Genre existingGenre = genreRepository.findByName(genre.getName()); // Check if genre already exists
        if (existingGenre != null) { // Genre already exists
            return ResponseEntity.badRequest().body("Genre already exists");
        }
        genreRepository.save(genre); // Save genre
        return ResponseEntity.ok(genre);
    }

    @GetMapping("/read")
    // Read a book by id
    public ResponseEntity<Genre> read_genre(@RequestParam String id) {
        Genre existingGenre = genreRepository.findById(id).orElse(null);
        if (existingGenre == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(existingGenre);
    }

    @PatchMapping("/update")
    // Update a Genre
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<Genre> update_genre(@RequestBody Genre genre) {
        Genre existingGenre = genreRepository.findById(genre.getId()).orElse(null);
        if (existingGenre == null) {
            return ResponseEntity.notFound().build();
        }
        existingGenre.setName(genre.getName());
        genreRepository.save(existingGenre);
        return ResponseEntity.ok(existingGenre);
    }

    @DeleteMapping("/delete")
    // Delete a Genre
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<Genre> delete_genre(@RequestParam String id) {
        Genre existingGenre = genreRepository.findById(id).orElse(null);
        if (existingGenre == null) {
            return ResponseEntity.notFound().build();
        }
        genreRepository.delete(existingGenre);
        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/get_all")
    // Get all genres
    public ResponseEntity<Iterable<Genre>> get_all_genres() {
        return ResponseEntity.ok(genreRepository.findAll());
    }
}
