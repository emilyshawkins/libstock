package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    List<Favorite> findByUserId(String userId); // Find favorites by user id
    List<Favorite> findByBookId(String bookId); // Find favorites by book id
    Favorite findByUserIdAndBookId(String userId, String bookId); // Find favorite by user id and book id
    void deleteAllByBookId(String bookId); // Delete all favorites by book id
    void deleteAllByUserId(String userId); // Delete all favorites by user id
}