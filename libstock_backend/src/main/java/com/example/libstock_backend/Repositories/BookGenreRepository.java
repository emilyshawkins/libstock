package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.BookGenre;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BookGenreRepository extends MongoRepository<BookGenre, String> {
    List<BookGenre> findByBookId(String bookId); // Find all genres of a book
    List<BookGenre> findByGenreId(String genreId); // Find all books of a genre
    BookGenre findByGenreIdAndBookId(String genreId, String bookId); // Find a book of a genre
    
}
