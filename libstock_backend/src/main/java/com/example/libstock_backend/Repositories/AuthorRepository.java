package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Author;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface AuthorRepository extends MongoRepository<Author, String> {
    List<Author> findByFirstNameContaining(String firstName);
    List<Author> findByLastNameContaining(String lastName);
    List<Author> findByFirstNameContainingAndLastNameContaining(String firstName, String lastName);
    Optional<Author> findById(String id);
}
