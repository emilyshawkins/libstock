package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    List<Favorite> findByUserId(String userId);
    List<Favorite> findByBookId(String bookId);
    Favorite findByUserIdAndBookId(String userId, String bookId);
}
