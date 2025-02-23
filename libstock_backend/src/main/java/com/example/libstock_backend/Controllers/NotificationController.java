package com.example.libstock_backend.Controllers;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.libstock_backend.Models.Notification;

import com.example.libstock_backend.Repositories.NotificationRepository;
import com.example.libstock_backend.Repositories.UserRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    UserRepository userRepository;

    @PostMapping("/create")
    // Create a new notification, will probably be exclusively used by the backend
    public ResponseEntity<Object> create_notification(@RequestBody Notification notification) { // Need userId and message
        if(notification.getUserId() == null || notification.getMessage() == null) {
            return ResponseEntity.badRequest().body("User ID and message are required.");
        }
        if(userRepository.findById(notification.getUserId()).orElse(null) == null) {
            return ResponseEntity.badRequest().body("User not found.");
        }
        
        notification.setDate(new Date()); // Set date to epoch time
        notification.setRead(false); // Set read to false

        notificationRepository.save(notification);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/read")
    // Read a notification by id
    public ResponseEntity<Notification> read_notification(@RequestParam String id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        notificationRepository.save(notification);
        return ResponseEntity.ok(notification);
    }

    @PatchMapping("/update")
    // Update a notification, will probably not be used
    public ResponseEntity<Notification> update_notification(@RequestBody Notification notification) {
        Notification existingNotification = notificationRepository.findById(notification.getId()).orElse(null);
        if (existingNotification == null) {
            return ResponseEntity.notFound().build();
        }

        notificationRepository.save(existingNotification);
        return ResponseEntity.ok(existingNotification);
    }

    @DeleteMapping("/delete")
    // Delete a notification
    public ResponseEntity<Notification> delete_notification(@RequestParam String id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        notificationRepository.delete(notification);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/get_all")
    // Get all notifications for a user
    public ResponseEntity<Iterable<Notification>> get_all(@RequestParam String userId) {
        Iterable<Notification> notifications = notificationRepository.findByUserId(userId);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/is_read")
    // Mark a notification as read
    public ResponseEntity<Notification> is_read(@RequestParam String id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        notification.setRead(true);
        notificationRepository.save(notification);
        return ResponseEntity.ok(notification);
    }
    
}
