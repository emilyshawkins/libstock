package com.example.libstock_backend.Repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.libstock_backend.Models.Queue;

public interface QueueRepository extends MongoRepository<Queue, String> {
    Queue findByUserIdAndBookId(String userId, String bookId); // Find queue by user id and book id
    List<Queue> findByBookId(String bookId); // Find queues by book id
    List<Queue> findByUserId(String userId); // Find queues by user id
    int countByBookId(String bookId); // Count queues by book id
    void deleteAllByBookId(String bookId); // Delete all queues by book id
}