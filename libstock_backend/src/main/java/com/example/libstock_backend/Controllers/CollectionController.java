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
import com.example.libstock_backend.Models.Collection;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.CollectionRepository;
import com.example.libstock_backend.Repositories.UserRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/admin_collection")
public class CollectionController {

    @Autowired
    public CollectionRepository collectionRepository;
    @Autowired
    public UserRepository userRepository;
    @Autowired
    public BookRepository bookRepository;

    @PostMapping("/create")
    // Create a new collection
    public ResponseEntity<Object> create_collection(@RequestBody Collection collection) {
        if (collection.getUserId() == null || collection.getUserId().isBlank() || collection.getUserId() == "") { // Check if the user ID is null or blank
            return ResponseEntity.badRequest().body("User ID must not be blank.");
        }
        if (userRepository.findById(collection.getUserId()).isEmpty()) { // Check if the user exists
            return ResponseEntity.badRequest().body("User does not exist.");
        }
        if (collection.getName() == null || collection.getName().isBlank() || collection.getName() == "") { // Check if the name is null or blank
            return ResponseEntity.badRequest().body("Name must not be blank.");
        }
        if (collection.getVisible() == null) { // Check if the visible field is null
            collection.setVisible(false); // Default to false
        }
        if (collection.getBooks() == null) { // Check if the books field is null
            collection.setBooks(new ArrayList<String>()); // Default to an empty list
        }

        collectionRepository.save(collection);
        return ResponseEntity.ok(collection);
    }

    @GetMapping("/read")
    // Read a collection
    public ResponseEntity<Object> read_collection(@RequestParam String id) {
        Collection collection = collectionRepository.findById(id).orElse(null);
        if (collection == null) { // Check if the collection exists
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(collection);
    }

    @PatchMapping("/update")
    // Update a collection
    public ResponseEntity<Object> update_collection(@RequestBody Collection collection) {
        Collection existingCollection = collectionRepository.findById(collection.getId()).orElse(null);
        if (existingCollection == null) { // Check if the collection exists
            return ResponseEntity.notFound().build();
        }
        if (collection.getName() != null) { // Check if the name is not null or blank
            existingCollection.setName(collection.getName());
        }
        if (collection.getDescription() != null) { // Check if the description is not null
            existingCollection.setDescription(collection.getDescription());
        }
        if (collection.getVisible() != null) { // Check if the visible field is not null
            existingCollection.setVisible(collection.getVisible());
        }
        collectionRepository.save(existingCollection);
        return ResponseEntity.ok(existingCollection);
    }

    @PatchMapping("/add_books")
    // Add books to a collection
    public ResponseEntity<Object> add_books(@RequestParam String id, @RequestBody ArrayList<String> books) {
        Collection collection = collectionRepository.findById(id).orElse(null);
        if (collection == null) { // Check if the collection exists
            return ResponseEntity.notFound().build();
        }
        collection.getBooks().addAll(books);
        collectionRepository.save(collection);
        return ResponseEntity.ok(collection);
    }

    @PatchMapping("/remove_books")
    // Remove books from a collection
    public ResponseEntity<Object> remove_books(@RequestParam String id, @RequestBody ArrayList<String> books) {
        Collection collection = collectionRepository.findById(id).orElse(null);
        if (collection == null) { // Check if the collection exists
            return ResponseEntity.notFound().build();
        }
        collection.getBooks().removeAll(books);
        collectionRepository.save(collection);
        return ResponseEntity.ok(collection);
    }

    @DeleteMapping("/delete")
    // Delete a collection
    public ResponseEntity<Object> delete_collection(@RequestParam String id) {
        Collection collection = collectionRepository.findById(id).orElse(null);
        if (collection == null) { // Check if the collection exists
            return ResponseEntity.notFound().build();
        }
        collectionRepository.delete(collection);
        return ResponseEntity.ok(collection);
    }

    @GetMapping("/get_all_collections")
    // Get all collections
    public ResponseEntity<Object> get_all_collections(@RequestParam String userId) {
        if (userId == null || userId.isBlank() || userId == "") { // Check if the user ID is null or blank
            return ResponseEntity.badRequest().body("User ID must not be blank.");
        }
        if (userRepository.findById(userId).isEmpty()) { // Check if the user exists
            return ResponseEntity.badRequest().body("User does not exist.");
        }
        return ResponseEntity.ok(collectionRepository.findByUserId(userId));
    }

    @GetMapping("get_collection_books")
    // Get all books in a collection
    public ResponseEntity<Object> get_collection_books(@RequestParam String id) {
        Collection collection = collectionRepository.findById(id).orElse(null);
        if (collection == null) { // Check if the collection exists
            return ResponseEntity.notFound().build();
        }
        
        List<Book> books = new ArrayList<>();
        for (String bookId : collection.getBooks()) { // Get all books in the collection
            Book book = bookRepository.findById(bookId).orElse(null);
            if (book != null) {
                books.add(book);
            }
        }
        return ResponseEntity.ok(books);
    }
    
}
