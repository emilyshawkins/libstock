package com.example.libstock_backend.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.libstock_backend.Models.Jwt;

public interface JwtRepository extends MongoRepository<Jwt, String> {
    Jwt findBytoken(String token);
}
// FINISH THIS LATER