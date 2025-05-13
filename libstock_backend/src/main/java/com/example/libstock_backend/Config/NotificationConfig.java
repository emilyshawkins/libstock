package com.example.libstock_backend.Config;

import java.time.Instant;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import com.example.libstock_backend.Models.Notification;
import com.example.libstock_backend.Repositories.NotificationRepository;

@Service
public class NotificationConfig {

    @Autowired
    private NotificationRepository notificationRepository;

    public void sendNotification(String userId, String message) {
        if (userId == null || message == null) {
            return;
        }
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setDate(Instant.now());
        notification.setRead(false);

        notificationRepository.save(notification);
    }
}