// Brandon Gascon - modified, removed crossorigin, added PreAuthorization for admin methods //
package com.example.libstock_backend.Controllers;

import java.time.Instant;

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
import org.springframework.security.access.prepost.PreAuthorize; // used to authorize use of certain methods only for admins //

@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    NotificationRepository notificationRepository;

    @PostMapping("/create")
    @PreAuthorize("principal.isAdmin == true")
    public ResponseEntity<Notification> create_notification(@RequestBody Notification notification) {
        notificationRepository.save(notification);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/read")
    public ResponseEntity<Notification> read_notification(@RequestParam String id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        notificationRepository.save(notification);
        return ResponseEntity.ok(notification);
    }

    @PatchMapping("/update")
    @PreAuthorize("principal.isAdmin == true")
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

    @DeleteMapping("/delete")
    @PreAuthorize("principal.isAdmin == true")
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
