package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookRepository extends MongoRepository<Book, String> {

    List<Book> findByISBNContaining(String ISBN); // Find books by ISBN
    List<Book> findByTitleContaining(String title); // Find books by title
    Book findByISBN(String ISBN); // Find book by ISBN

}