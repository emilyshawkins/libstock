package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.BookAuthor;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookAuthorRepository extends MongoRepository<BookAuthor, String> {
    List<BookAuthor> findByAuthorId(String authorId); // Find all books by an author
    List<BookAuthor> findByBookId(String bookId); // Find all authors of a book
    BookAuthor findByAuthorIdAndBookId(String authorId, String bookId); // Find a specific author of a specific book
    void deleteAllByAuthorId(String authorId); // Delete an author from books
    void deleteAllByBookId(String bookId); // Delete a book from authors
    
}
