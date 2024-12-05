package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.BookAuthor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookAuthorRepository extends MongoRepository<BookAuthor, String> {
    List<BookAuthor> findByAuthorID(String authorID); // Find all books by an author
    List<BookAuthor> findByISBN(int ISBN); // Find all authors of a book
    
}
