package com.example.libstock_backend.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.libstock_backend.Models.Notification;

import com.example.libstock_backend.Repositories.NotificationRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    NotificationRepository notificationRepository;

    @PostMapping("/create")
    public ResponseEntity<Notification> create_notification(@RequestBody Notification notification) {
        notificationRepository.save(notification);
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/read")
    public ResponseEntity<Notification> read_notification(@RequestParam String id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        notificationRepository.save(notification);
        return ResponseEntity.ok(notification);
    }

    @PostMapping("/update")
    public ResponseEntity<Notification> update_notification(@RequestBody Notification notification) {
        Notification existingNotification = notificationRepository.findById(notification.getId()).orElse(null);
        if (existingNotification == null) {
            return ResponseEntity.notFound().build();
        }
        existingNotification.setUserEmail(notification.getUserEmail());
        existingNotification.setDate(notification.getDate());
        existingNotification.setMessage(notification.getMessage());
        existingNotification.setRead(notification.isRead());
        notificationRepository.save(existingNotification);
        return ResponseEntity.ok(existingNotification);
    }

    @PostMapping("/delete")
    public ResponseEntity<Notification> delete_notification(@RequestParam String id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        notificationRepository.delete(notification);
        return ResponseEntity.ok(notification);
    }
    
}
