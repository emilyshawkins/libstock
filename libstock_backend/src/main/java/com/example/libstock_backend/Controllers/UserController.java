package com.example.libstock_backend.Controllers;

import java.io.IOException;
import java.util.Base64;

import org.apache.catalina.connector.Response;
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
import org.springframework.web.multipart.MultipartFile;

import com.example.libstock_backend.DTOs.LoginDTO;
import com.example.libstock_backend.DTOs.ProfileDTO;
import com.example.libstock_backend.DTOs.UserDTO;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Repositories.CheckoutRepository;
import com.example.libstock_backend.Repositories.FavoriteRepository;
import com.example.libstock_backend.Repositories.NotificationRepository;
import com.example.libstock_backend.Repositories.QueueRepository;
import com.example.libstock_backend.Repositories.RatingRepository;
import com.example.libstock_backend.Repositories.UserRepository;
import com.example.libstock_backend.Repositories.WishlistItemRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    CheckoutRepository checkoutRepository;
    @Autowired
    FavoriteRepository favoriteRepository;
    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    QueueRepository queueRepository;
    @Autowired
    RatingRepository ratingRepository;
    @Autowired
    WishlistItemRepository wishlistItemRepository;

    @PostMapping("/admin_signup")
    // Create a new admin
    public ResponseEntity<Object> create_admin(@RequestBody User user) {

        if (user.getEmail() == null || user.getFirstName() == null || user.getLastName() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Missing required fields"); // 400 Bad Request if any required fields are missing
        }
        else if (user.getEmail().equals("") || user.getFirstName().equals("") || user.getLastName().equals("") || user.getPassword().equals("")) {
            return ResponseEntity.badRequest().body("Missing required fields"); // 400 Bad Request if any required fields are empty
        }
        else {
            User existingUser = userRepository.findByEmail(user.getEmail()); // Check if email is already in use
            if (existingUser != null) {
                return ResponseEntity.badRequest().body("Email already in use");
            }
            user.setAdmin(true);
            user.setImage(null);
        }
        userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.isAdmin(), null)); // 200 OK if account creation successful
    }

    @PostMapping("/user_signup")
    // Create a new user
    public ResponseEntity<Object> create_user(@RequestBody User user) {
        
        if (user.getEmail() == null || user.getFirstName() == null || user.getLastName() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Missing required fields"); // 400 Bad Request if any required fields are missing
        }
        else if (user.getEmail().equals("") || user.getFirstName().equals("") || user.getLastName().equals("") || user.getPassword().equals("")) {
            return ResponseEntity.badRequest().body("Missing required fields"); // 400 Bad Request if any required fields are empty
        }
        else {
            User existingUser = userRepository.findByEmail(user.getEmail()); // Check if email is already in use
            if (existingUser != null) {
                return ResponseEntity.badRequest().body("Email already in use");
            }
            user.setAdmin(false);
            user.setImage(null);
        }
        userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.isAdmin(), null)); // 200 OK if account creation successful
    }

    @PostMapping("/login")
    // Login
    public ResponseEntity<Object> login(@RequestBody LoginDTO user) {

        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Missing required fields"); // 400 Bad Request if any required fields are missing
        }
        else if (user.getEmail().equals("") || user.getPassword().equals("")) {
            return ResponseEntity.badRequest().body("Missing required fields"); // 400 Bad Request if any required fields are empty
        }
        else {
            User existingUser = userRepository.findByEmail(user.getEmail());
            if (existingUser == null) {
                return ResponseEntity.status(Response.SC_NOT_FOUND).body(null); // 404 Not Found if user does not exist
            }
            else if (!existingUser.getPassword().equals(user.getPassword())) {
                return ResponseEntity.status(Response.SC_UNAUTHORIZED).body(null); // 401 Unauthorized if password is incorrect
            }
            // Convert image to base64 string
            String ret_img = (existingUser.getImage() != null) ? Base64.getEncoder().encodeToString(existingUser.getImage()) : null;

            return ResponseEntity.ok(new UserDTO(existingUser.getId(), existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), ret_img)); // 200 OK if login successful

        }
               
    }

    @GetMapping("/get")
    // Get a user by id
    public ResponseEntity<Object> get(@RequestParam String id) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) { // 404 Not Found if user does not exist
            return ResponseEntity.status(Response.SC_NOT_FOUND).body("User not found");
        }
        String ret_img = (existingUser.getImage() != null) ? Base64.getEncoder().encodeToString(existingUser.getImage()) : null;

        return ResponseEntity.ok(new UserDTO(existingUser.getId(), existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), ret_img));
    }

    @PatchMapping("/update")
    // Update a user
    public ResponseEntity<Object> update(@RequestBody ProfileDTO profile) {
        if (profile.getId() == null) {
            return ResponseEntity.status(Response.SC_BAD_REQUEST).body("Missing required fields");
        }
        else if (profile.getId().equals("")) {
            return ResponseEntity.status(Response.SC_BAD_REQUEST).body("Missing required fields");
        }
        else {
            User existingUser = userRepository.findById(profile.getId()).orElse(null);
            if (existingUser == null) {
                return ResponseEntity.status(Response.SC_NOT_FOUND).body("User not found");
            }

            // Check if email is being changed and if so, check if it is already in use
            if (profile.getEmail() != null) {
                User duplicateUser = userRepository.findByEmail(profile.getEmail());
                if (duplicateUser != null) {
                    return ResponseEntity.status(Response.SC_CONFLICT).body(null);
                }
                existingUser.setEmail(profile.getEmail());
                
            }
            if (profile.getFirstName() != null) {
                existingUser.setFirstName(profile.getFirstName());
            }
            if (profile.getLastName() != null) {
                existingUser.setLastName(profile.getLastName());
            }
            if (profile.getCurrentPassword() != null && profile.getNewPassword() != null) { // Change password
                if (existingUser.getPassword().equals(profile.getCurrentPassword())) { // Check if current password is correct
                    existingUser.setPassword(profile.getNewPassword());
                }
                else {
                    return ResponseEntity.status(Response.SC_UNAUTHORIZED).body("Incorrect password");
                }
            }

            userRepository.save(existingUser);
            
            String ret_img = (existingUser.getImage() != null) ? Base64.getEncoder().encodeToString(existingUser.getImage()) : null;

            return ResponseEntity.ok(new UserDTO(existingUser.getId(), existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), ret_img));
       }
    }
    
    @DeleteMapping("/delete")
    // Delete a user
    public ResponseEntity<Object> delete(@RequestParam String id) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body("User not found");
        }

        // Delete all user data
        checkoutRepository.deleteAllByUserId(id);
        favoriteRepository.deleteAllByUserId(id);
        notificationRepository.deleteAllByUserId(id);
        queueRepository.deleteAllByUserId(id);
        ratingRepository.deleteAllByUserId(id);
        wishlistItemRepository.deleteAllByUserId(id);

        userRepository.delete(existingUser);
        return ResponseEntity.ok().body("User deleted");
    }

    @PostMapping("/set_profile_img")
    // Set a user's profile image
    public ResponseEntity<Object> set_profile_img(@RequestParam String id, @RequestParam("profilePicture") MultipartFile image) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body("User not found");
        }
        try {
            existingUser.setImage(image.getBytes());
        } catch (IOException e) {
            return ResponseEntity.status(Response.SC_INTERNAL_SERVER_ERROR).body(null);
        }
        userRepository.save(existingUser);
        String ret_img = Base64.getEncoder().encodeToString(existingUser.getImage());
        return ResponseEntity.ok(new UserDTO(existingUser.getId(), existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), ret_img));
    }

}