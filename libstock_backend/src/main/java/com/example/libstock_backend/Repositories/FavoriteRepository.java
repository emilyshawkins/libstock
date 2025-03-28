package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    Favorite findByUserId(String userId); // Find favorite list by user id
    Optional<Favorite> findById(String id); // Find favorite list by favorite id
    void deleteAllByUserId(String userId); // Delete all favorite lists by user id
}
