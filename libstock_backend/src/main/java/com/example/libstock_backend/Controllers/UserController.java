// Brandon Gascon - modified //
// completed password reset and forget password, still needs testing, Emily set up the endpoinst but I just modified them a little //
// also added Jwt generation to login endpoint, creating one for a user once they login //
package com.example.libstock_backend.Controllers;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64; // used for list of admin emails //
import java.util.List;
import java.util.UUID; // used for simple mail, as random token hash //

import org.apache.catalina.connector.Response; // the cookie itself //
import org.springframework.beans.factory.annotation.Autowired; // used for Reading cookie //
import org.springframework.http.HttpStatus; // used for Writing cookie //
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder; // used to hash+salt passwords upon signup and update, along w/ login password hash check //
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.libstock_backend.Config.JwtConfig;
import com.example.libstock_backend.DTOs.AuthenticationDTO; // used for mail services //
import com.example.libstock_backend.DTOs.LoginDTO; // used for mail services //
import com.example.libstock_backend.DTOs.ProfileDTO; // used to send response to http interactions to front end //
import com.example.libstock_backend.DTOs.ResetPasswordDTO;
import com.example.libstock_backend.DTOs.UserDTO;
import com.example.libstock_backend.Models.Queue;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Repositories.CheckoutRepository;
import com.example.libstock_backend.Repositories.FavoriteRepository;
import com.example.libstock_backend.Repositories.NotificationRepository;
import com.example.libstock_backend.Repositories.QueueRepository;
import com.example.libstock_backend.Repositories.RatingRepository;
import com.example.libstock_backend.Repositories.UserRepository;
import com.example.libstock_backend.Repositories.WishlistItemRepository;
import com.example.libstock_backend.Config.NotificationConfig; // to send notifications to frontend //

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

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
    @Autowired
    private JavaMailSender mailSender; // mail sending function import //
    @Autowired
    private JwtConfig jwtConfig; // Jwt User Login generation // 
    @Autowired
    private NotificationConfig notificationConfig; // used to notification //
    
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

        notificationConfig.sendNotification(user.getId(), "Welcome " + user.getFirstName() + " to LibStrock!"); // semd login totification to frontend //

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

        notificationConfig.sendNotification(user.getId(), "Welcome " + user.getFirstName() + " to LibStrock!"); // semd login totification to frontend //

        return ResponseEntity.ok(new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.isAdmin(), null)); // 200 OK if account creation successful
    }

    @PostMapping("/login")
    // Login
    public ResponseEntity<Object> login(@RequestBody LoginDTO user, HttpServletResponse response) {

        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body("Missing required fields"); // 400 Bad Request if any required fields are missing
        }
        else if (user.getEmail().equals("") || user.getPassword().equals("")) {
            return ResponseEntity.badRequest().body("Missing required fields"); // 400 Bad Request if any required fields are empty
        }
        else {
            User existingUser = userRepository.findByEmail(user.getEmail());
            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // 404 Not Found if user does not exist
            }
            else if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null); // 401 Unauthorized if password is incorrect
            }

            // Generates Access and Refresh Tokens //
            String Access = jwtConfig.createToken(existingUser.getEmail(), 15); // 15 minutes //
            String Refresh = jwtConfig.createToken(existingUser.getEmail(), 60 * 24 * 30); // 30 days //
            // Reset Token Expiration //
            LocalDateTime expiration = LocalDateTime.now().plusMinutes(15);

            // Stores token in httponly cookie so it' can't be read by java script // 
            // Security measure so that the can't access from front end //
            Cookie tokenStorage = new Cookie("refreshToken", Refresh);
            tokenStorage.setHttpOnly(true); // stores token in http cookie //
            tokenStorage.setSecure(true); // only sends token over https //
            tokenStorage.setPath("/"); // api access //
            tokenStorage.setMaxAge(60 * 60 * 25 * 30); // 30 days // 
            response.addCookie(tokenStorage);

            // Convert image to base64 string
            String ret_img = (existingUser.getImage() != null) ? Base64.getEncoder().encodeToString(existingUser.getImage()) : null;

            return ResponseEntity.ok(new AuthenticationDTO(existingUser.getId(), existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), ret_img, Access, expiration)); // 200 OK if login successful
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
        ratingRepository.deleteAllByUserId(id);
        wishlistItemRepository.deleteAllByUserId(id);

        for (Queue queue : queueRepository.findAll()) {
            if (queue.getQueueList().contains(id)) {
                queue.getQueueList().remove(id); // Remove the user from the queue
                queueRepository.save(queue); // Save the updated queue
            }
        }

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

    @PostMapping("/forgot_password")
    // Forgot password //
    public ResponseEntity<Object> forgot_password(@RequestParam String email) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser == null) { // 404 User is not found //
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        // generate reset token // 
        String resetToken = UUID.randomUUID().toString(); // UUID generates random unique identifier for token //
        existingUser.setResetToken(resetToken);
        existingUser.setExpiration(LocalDateTime.now().plusMinutes(15)); // expires in 15 minutes //
        userRepository.save(existingUser);

        // password reset link // 
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken + "&id=" + existingUser.getId();

        // sends email // 
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset Request");
        message.setText("Click the link below to reset your password:\n" + resetLink + "\nThis link will expire in 15 minutes.");
        mailSender.send(message);

        return ResponseEntity.ok("Password reset link sent to email");

    }

    @PatchMapping("/reset_password")
    // Reset password
    public ResponseEntity<Object> reset_password(@RequestBody ResetPasswordDTO resetPassword) {
        User user = userRepository.findByResetToken(resetPassword.getResetToken());
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        if (user.getResetToken() == null || !user.getResetToken().equals(resetPassword.getResetToken()) || user.getExpiration().isBefore(LocalDateTime.now())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token is invalid or has expired");
        }

        user.setPassword(passwordEncoder.encode(resetPassword.getNewPassword()));
        user.setResetToken(null);
        user.setExpiration(null);
        userRepository.save(user);

        return ResponseEntity.ok("Password reset successful");
    }

    @PostMapping("/refreshToken") // used to generate new access token from valid refresh token //
    public ResponseEntity<Object> refresh(@CookieValue(value = "refreshToken", required = false) String token) {
        String email = jwtConfig.validation(token);
        User user = userRepository.findByEmail(email);
        if (token == null || email == null || user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 404 if there is no refresh token or refresh token is not valid //
        }

        String newToken = jwtConfig.createToken(email, 15); // set new token for 15 minute lifespan //
        LocalDateTime newExpiration = LocalDateTime.now().plusMinutes(15); // resets 15 minute TTL //
        return ResponseEntity.ok(new AuthenticationDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.isAdmin(), null, newToken, newExpiration)); // 200 if successful //
    }

    @PostMapping("/logout")
    public ResponseEntity<Object> logout(HttpServletResponse response) {
        Cookie logOut = new Cookie("refreshToken", null); // sets cookie to null as for clean logout of user //
        logOut.setMaxAge(0);
        logOut.setHttpOnly(true);
        logOut.setSecure(true);
        logOut.setPath("/");
        response.addCookie(logOut);
        return ResponseEntity.ok().build();
    }
}