package com.example.libstock_backend.Controllers;

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
            return ResponseEntity.status(Response.SC_CONFLICT).body(null);
        }
        user.setAdmin(true);
        userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(user.getEmail(), user.getFirstName(), user.getLastName(), user.isAdmin(), null));
    }

    @PostMapping("/user_signup")
    public ResponseEntity<UserDTO> create_user(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            return ResponseEntity.status(Response.SC_CONFLICT).body(null);
        }
        user.setAdmin(false);
        userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(user.getEmail(), user.getFirstName(), user.getLastName(), user.isAdmin(), null));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginDTO user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null || !existingUser.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(Response.SC_UNAUTHORIZED).body(null);
        }
        return ResponseEntity.ok(new UserDTO(existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), existingUser.getAddress()));
    }

    @GetMapping("/get")
    public ResponseEntity<UserDTO> get(@RequestParam String email) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(new UserDTO(existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), existingUser.getAddress()));
    }

    @PatchMapping("/update")
    public ResponseEntity<UserDTO> update(@RequestBody ProfileDTO profile) {
        User existingUser = userRepository.findByEmail(profile.getPreviousEmail());
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body(null);
        }

        // Check if email is being changed and if so, check if it is already in use
        if (profile.getNewEmail() != null) {
            User duplicateUser = userRepository.findByEmail(profile.getNewEmail());
            if (duplicateUser != null) {
                return ResponseEntity.status(Response.SC_CONFLICT).body(null);
            }
            existingUser.setEmail(profile.getNewEmail());
            
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
        return ResponseEntity.ok(new UserDTO(existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), existingUser.getAddress()));
    }
    
    @DeleteMapping("/delete")
    public ResponseEntity<UserDTO> delete(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body(null);
        }
        userRepository.delete(existingUser);
        return ResponseEntity.ok(new UserDTO(existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin(), existingUser.getAddress()));
    }

}