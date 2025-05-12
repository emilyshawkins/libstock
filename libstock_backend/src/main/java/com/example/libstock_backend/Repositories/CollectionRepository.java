package com.example.libstock_backend.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.libstock_backend.Models.Collection;

public interface CollectionRepository extends MongoRepository<Collection, String> {
    
    Optional<Collection> findById(String id); // Find collection by id
    Optional<Collection> findByName(String name); // Find collection by name
    List<Collection> findByUserId(String userId); // Find collections by user ID
    List<Collection> findByVisible(Boolean visible); // Find collections by visibility
}
