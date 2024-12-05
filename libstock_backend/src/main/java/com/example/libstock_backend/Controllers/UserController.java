package com.example.libstock_backend.Controllers;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<UserDTO> signup(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            return ResponseEntity.status(Response.SC_CONFLICT).body(null);
        }
        userRepository.save(user);
        return ResponseEntity.ok(new UserDTO(user.getEmail(), user.getFirstName(), user.getLastName(), user.isAdmin(), null));
    }
    

}