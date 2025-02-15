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

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/notification")
public class NotificationController {

    @Autowired
    NotificationRepository notificationRepository;

    @PostMapping("/create")
    public ResponseEntity<Notification> create_notification(@RequestBody Notification notification) {
        if(notification.getUserId() == null || notification.getMessage() == null) {
            return ResponseEntity.badRequest().build();
        }
        notification.setDate(new Date(0));
        notification.setRead(false);
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
    public ResponseEntity<Notification> update_notification(@RequestBody Notification notification) {
        Notification existingNotification = notificationRepository.findById(notification.getId()).orElse(null);
        if (existingNotification == null) {
            return ResponseEntity.notFound().build();
        }

        notificationRepository.save(existingNotification);
        return ResponseEntity.ok(existingNotification);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Notification> delete_notification(@RequestParam String id) {
        Notification notification = notificationRepository.findById(id).orElse(null);
        if (notification == null) {
            return ResponseEntity.notFound().build();
        }
        notificationRepository.delete(notification);
        return ResponseEntity.ok(notification);
    }

    @GetMapping("/get_all")
    public ResponseEntity<Iterable<Notification>> get_all(@RequestParam String userId) {
        Iterable<Notification> notifications = notificationRepository.findByUserId(userId);
        return ResponseEntity.ok(notifications);
    }
    
}
