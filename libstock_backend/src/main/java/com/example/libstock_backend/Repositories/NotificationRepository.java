package com.example.libstock_backend.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.libstock_backend.Models.Notification;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserId(String userId); // Find notifications by user id
    Optional<Notification> findById(String id); // Find notification by id
    void deleteAllByUserId(String userId); // Delete all notifications by user id
}
