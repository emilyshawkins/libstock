package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookRepository extends MongoRepository<Book, String> {

    List<Book> findByISBNContaining(int ISBN);
    List<Book> findByTitleContaining(String title);
    Book findByISBN(String ISBN);

}
