package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.Queue;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QueueRepository extends MongoRepository<Queue, String> {
    Queue findByUserEmailAndISBN(String email, int ISBN);
    List<Queue> findByISBN(int ISBN);
    List<Queue> findByUserEmail(String email);

}