package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.BookAuthor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookAuthorRepository extends MongoRepository<BookAuthor, String> {
    List<BookAuthor> findByAuthorID(String authorId); // Find all books by an author
    List<BookAuthor> findByISBN(String bookId); // Find all authors of a book
    BookAuthor findByAuthorIDAndBookID(String authorId, String bookId); // Find a specific author of a specific book
    
}
