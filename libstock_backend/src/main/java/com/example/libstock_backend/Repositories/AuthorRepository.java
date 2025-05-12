package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Author;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface AuthorRepository extends MongoRepository<Author, String> {
    List<Author> findByFirstNameContaining(String firstName); // Find authors by first name
    List<Author> findByLastNameContaining(String lastName); // Find authors by last name
    List<Author> findByFirstNameContainingAndLastNameContaining(String firstName, String lastName); // Find authors by first and last name
    Optional<Author> findById(String id); // Find author by id
}
