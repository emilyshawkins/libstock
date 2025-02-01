package com.example.libstock_backend.Repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.libstock_backend.Models.Queue;

public interface QueueRepository extends MongoRepository<Queue, String> {
    Queue findByUserEmailAndISBN(String email, int ISBN);
    List<Queue> findByISBN(int ISBN);
    List<Queue> findByUserEmail(String email);
    int countByISBN(int ISBN);
}