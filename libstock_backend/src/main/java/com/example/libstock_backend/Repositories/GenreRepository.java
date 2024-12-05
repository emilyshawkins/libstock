package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Genre;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GenreRepository extends MongoRepository<Genre, String> {
    Genre findByName(String name);
}
