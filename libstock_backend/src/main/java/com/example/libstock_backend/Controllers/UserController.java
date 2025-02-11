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
import com.example.libstock_backend.Repositories.UserRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @PostMapping("/admin_signup")
    public ResponseEntity<UserDTO> create_admin(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            return ResponseEntity.badRequest().body(null); // 400 Bad Request if email already in use
        }
        user.setAdmin(true);
        user.setImage(null);
        userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.isAdmin(), null)); // 200 OK if account creation successful
    }

    @PostMapping("/user_signup")
    public ResponseEntity<UserDTO> create_user(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            return ResponseEntity.badRequest().body(null); // 400 Bad Request if email already in use
        }
        user.setAdmin(false);
        user.setImage(null);
        userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.isAdmin(), null)); // 200 OK if account creation successful
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginDTO user) {
        System.out.println("Logging in");
        System.out.println(user.getEmail());
        System.out.println(user.getPassword());
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null || !existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(Response.SC_UNAUTHORIZED).body(null); // 401 Unauthorized if email not found or password incorrect
        }

        String ret_img;
        if (existingUser.getImage() != null) {
            ret_img = Base64.getEncoder().encodeToString(existingUser.getImage());
        }
        else {
            ret_img = null;
        }
        
        return ResponseEntity.ok(new UserDTO(existingUser.getId(), existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), ret_img)); // 200 OK if login successful
    }

    @GetMapping("/get")
    public ResponseEntity<UserDTO> get(@RequestParam String id) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body(null);
        }
        String ret_img;
        if (existingUser.getImage() != null) {
            ret_img = Base64.getEncoder().encodeToString(existingUser.getImage());
        }
        else {
            ret_img = null;
        }
        return ResponseEntity.ok(new UserDTO(existingUser.getId(), existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), ret_img));
    }

    @PatchMapping("/update")
    public ResponseEntity<UserDTO> update(@RequestBody ProfileDTO profile) {
        User existingUser = userRepository.findById(profile.getId()).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body(null);
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
        if (profile.getPassword() != null) {
            existingUser.setPassword(profile.getPassword());
        }

        userRepository.save(existingUser);
        String ret_img;
        if (existingUser.getImage() != null) {
            ret_img = Base64.getEncoder().encodeToString(existingUser.getImage());
        }
        else {
            ret_img = null;
        }
        return ResponseEntity.ok(new UserDTO(existingUser.getId(), existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), ret_img));
    }
    
    @DeleteMapping("/delete")
    public ResponseEntity<UserDTO> delete(@RequestParam String id) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body(null);
        }
        userRepository.delete(existingUser);
        return ResponseEntity.ok().body(null);
    }

    @PostMapping("/set_profile_img")
    public ResponseEntity<UserDTO> set_profile_img(@RequestParam String id, @RequestParam("profilePicture") MultipartFile image) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body(null);
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