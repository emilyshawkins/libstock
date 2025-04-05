package com.example.libstock_backend.Repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.libstock_backend.Models.Queue;

public interface QueueRepository extends MongoRepository<Queue, String> {
    Queue findByBookId(String bookId); // Find queue by book ID
    List<Queue> findByQueueListContaining(String userId); // Find queues containing user ID
    void deleteByBookId(String bookId); // Delete queue by book ID
}