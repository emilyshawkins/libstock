package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    List<Favorite> findByUserEmail(String userEmail);
    List<Favorite> findByISBN(int ISBN);
    Favorite findByUserEmailAndISBN(String userEmail, int ISBN);
}
