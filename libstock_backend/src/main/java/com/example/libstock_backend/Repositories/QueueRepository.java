package com.example.libstock_backend.Repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.libstock_backend.Models.Queue;

public interface QueueRepository extends MongoRepository<Queue, String> {
    Queue findByUserIdAndBookId(String userId, String bookId);
    List<Queue> findByBookId(String bookId);
    List<Queue> findByUserId(String userId);
    int countByBookId(String bookId);
    void deleteAllByBookId(String bookId);
}