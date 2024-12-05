package com.example.libstock_backend.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.libstock_backend.Models.Notification;
import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUserEmail(String email);
    Optional<Notification> findById(String id);
}
