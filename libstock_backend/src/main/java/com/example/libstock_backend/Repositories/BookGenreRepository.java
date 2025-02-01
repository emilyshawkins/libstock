package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.BookGenre;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookGenreRepository extends MongoRepository<BookGenre, String> {
    List<BookGenre> findByISBN(int ISBN); // Find all genres of a book
    List<BookGenre> findByGenreName(String genreName); // Find all books of a genre
    BookGenre findByGenreNameAndISBN(String genreName, int ISBN); // Find a book of a genre
    
}
