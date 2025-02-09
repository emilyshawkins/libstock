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

import com.example.libstock_backend.Models.Genre;
import com.example.libstock_backend.Repositories.GenreRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/genre")
public class GenreController {

    @Autowired
    GenreRepository genreRepository; 

    @PostMapping("/create")
    public ResponseEntity<Genre> create_genre(@RequestBody Genre genre) {
        Genre existingGenre = genreRepository.findByName(genre.getName());
        if (existingGenre != null) {
            return ResponseEntity.badRequest().body(null);
        }
        genreRepository.save(genre);
        return ResponseEntity.ok(genre);
    }

    @GetMapping("/read")
    public ResponseEntity<Genre> read_genre(@RequestParam String id) {
        Genre existingGenre = genreRepository.findById(id).orElse(null);
        if (existingGenre == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(existingGenre);
    }

    @PatchMapping("/update")
    public ResponseEntity<Genre> update_genre(@RequestBody Genre genre) {
        Genre existingGenre = genreRepository.findById(genre.getId()).orElse(null);
        if (existingGenre == null) {
            return ResponseEntity.notFound().build();
        }
        genreRepository.save(existingGenre);
        return ResponseEntity.ok(existingGenre);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Genre> delete_genre(@RequestParam String id) {
        Genre existingGenre = genreRepository.findById(id).orElse(null);
        if (existingGenre == null) {
            return ResponseEntity.notFound().build();
        }
        genreRepository.delete(existingGenre);
        return ResponseEntity.ok(existingGenre);
    }

    @GetMapping("/get_all")
    public ResponseEntity<Iterable<Genre>> get_all_genres() {
        return ResponseEntity.ok(genreRepository.findAll());
    }
}
