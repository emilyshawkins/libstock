// Brandon Gascon - modified //
// added handling for password reset and forget password, Emily set up the endpoinst but I just modified them a little //
package com.example.libstock_backend.Controllers;

import java.io.IOException;
import java.util.List; // used for list of admin emails //
import java.util.Base64;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // used to hash+salt passwords upon signup and update, along w/ login password hash check //
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize; // used to authorize use of certain methods only for admins //
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

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    public UserRepository userRepository;
    @Autowired
    public CheckoutRepository checkoutRepository;
    @Autowired
    public FavoriteRepository favoriteRepository;
    @Autowired
    public NotificationRepository notificationRepository;
    @Autowired
    public QueueRepository queueRepository;
    @Autowired
    public RatingRepository ratingRepository;
    @Autowired
    public WishlistItemRepository wishlistItemRepository;
    @Autowired
    private PasswordEncoder passwordEncoder; // passwordEncoder for password hashing + salting //

    @PostMapping("/admin_signup")
    // Create a new admin
    public ResponseEntity<Object> create_admin(@RequestBody User user) {
        List<String> adminEmails = List.of("example@gmail.com"); // list of admin emails for account creation //
        
        if (user.getEmail() == null || user.getFirstName() == null || user.getLastName() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Missing required fields"); // 400 Bad Request if any required fields are missing
        }
        else if (user.getEmail().equals("") || user.getFirstName().equals("") || user.getLastName().equals("") || user.getPassword().equals("")) {
            return ResponseEntity.badRequest().body("Missing required fields"); // 400 Bad Request if any required fields are empty
        }
        else {
            User existingUser = userRepository.findByEmail(user.getEmail()); // Check if email is already in use
            if (!adminEmails.contains(user.getEmail())) {
                return ResponseEntity.badRequest().body("Email is not authorized to create admin account"); // 400 Bad Request if email is not part of admin list //
            }
            if (existingUser != null) {
                return ResponseEntity.badRequest().body("Email already in use"); // 400 Bad Request if email is already in use //
            }

            user.setAdmin(true);
            user.setPassword(passwordEncoder.encode(user.getPassword())); // hash + salt password //
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
            user.setPassword(passwordEncoder.encode(user.getPassword()));
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
            else if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
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
                if (passwordEncoder.matches(profile.getCurrentPassword(), existingUser.getPassword())) { // Check if current password is correct
                    existingUser.setPassword(passwordEncoder.encode(profile.getNewPassword()));
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

    @PatchMapping("/set_profile_img")
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

    @GetMapping("/forgot_password")
    // Forgot password
    public ResponseEntity<Object> forgot_password(@RequestParam String email) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body("User not found");
        }

        // TODO: Send email with password reset link
        // Generate a password reset token
        String resetToken = UUID.randomUUID().toString();
        existingUser.setResetToken(resetToken);
        existingUser.setExpiration(LocalDateTime.now().plusMinutes(15)); // expires in 15 minutes
        userRepository.save(existingUser);

        // Construct the password reset link
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;

        // Send email with reset link
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("Click the link below to reset your password:\n" + resetLink + "\nThis link will expire in 15 minutes.");
        mailSender.send(message);

        return ResponseEntity.ok("Password reset link sent to email");

    }

    @PatchMapping("/reset_password")
    // Reset password
    public ResponseEntity<Object> reset_password(@RequestParam String id, @RequestBody String password, @RequestBody String resetToken) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body("User not found");
        }
        if (existingUser == null || existingUser.getExpiration().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(Response.SC_UNAUTHORIZED).body("Token is invalid or has expired");
        }

        existingUser.setPassword(passwordEncoder.encode(password));
        existingUser.setResetToken(null); // reset token after use
        existingUser.setExpiration(null);
        userRepository.save(existingUser);

        return ResponseEntity.ok("Password reset successful");

    }

}