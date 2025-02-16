// Brandon Gascon - modified, removed crossorigin, added PreAuthorization for admin methods //
// also added passwordEncoder for password hashing+salting using Becrypt for signup, login, and update // 
package com.example.libstock_backend.Controllers;

import java.util.List; // used for list of admin emails //

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // used to hash+salt passwords upon signup and update, along w/ login password hash check //
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize; // used to authorize use of certain methods only for admins //

import com.example.libstock_backend.DTOs.LoginDTO;
import com.example.libstock_backend.DTOs.ProfileDTO;
import com.example.libstock_backend.DTOs.UserDTO;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Repositories.UserRepository; 

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // passwordEncoder for password hashing + salting //

    @PostMapping("/admin_signup")
    public ResponseEntity<UserDTO> create_admin(@RequestBody User user) {
        List<String> adminEmails =  List.of(""); // list of admin emails for account creation //
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (!adminEmails.contains(user.getEmail())) {
            return ResponseEntity.badRequest().body(null); // 400 Bad Request if email is not part of admin list //
        }
        if (existingUser != null) {
            return ResponseEntity.badRequest().body(null); // 400 Bad Request if email already in use
        }
        user.setAdmin(true);
        user.setPassword(passwordEncoder.encode(user.getPassword())); // hash + salt password //
        userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.isAdmin())); // 200 OK if account creation successful
    }

    @PostMapping("/user_signup")
    public ResponseEntity<UserDTO> create_user(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            return ResponseEntity.badRequest().body(null); // 400 Bad Request if email already in use
        }
        user.setAdmin(false);
        user.setPassword(passwordEncoder.encode(user.getPassword())); 
        userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName(), user.isAdmin()));
    }

    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginDTO user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null || !passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) { // added check to password for new hash + salt implementation //
            return ResponseEntity.status(Response.SC_UNAUTHORIZED).body(null); // 401 Unauthorized if email not found or password incorrect 
        }
        return ResponseEntity.ok(new UserDTO(existingUser.getId(), existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin())); // 200 OK if login successful
    }

    @GetMapping("/get")
    public ResponseEntity<UserDTO> get(@RequestParam String id) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(new UserDTO(existingUser.getId(), existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin()));
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
            existingUser.setPassword(passwordEncoder.encode(profile.getPassword())); // hashes updated password //
        }

        userRepository.save(existingUser);
        return ResponseEntity.ok(new UserDTO(existingUser.getId(), existingUser.getEmail(), existingUser.getFirstName(), existingUser.getLastName(), existingUser.isAdmin()));
    }
    
    @DeleteMapping("/delete")
    public ResponseEntity<UserDTO> delete(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser == null) {
            return ResponseEntity.status(Response.SC_NOT_FOUND).body(null);
        }
        userRepository.delete(existingUser);
        return ResponseEntity.ok().body(null);
    }

}