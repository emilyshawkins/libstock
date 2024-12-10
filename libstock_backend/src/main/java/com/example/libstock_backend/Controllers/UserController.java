package com.example.libstock_backend.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Repositories.UserRepository;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/user")
public class UserController {

  @Autowired
  UserRepository userRepository;

  @GetMapping("/find")
  public ResponseEntity<List<User>> getUser(@RequestParam(required = true) String name) {
    List<User> users = userRepository.findByNameContaining(name);
    return new ResponseEntity<>(users, HttpStatus.OK);
  }

  @PostMapping("/add") 
  public ResponseEntity<User> addUser(@RequestBody User user) {
    User _user = userRepository.save(new User(user.getName(), user.getEmail()));
    return new ResponseEntity<>(_user, HttpStatus.CREATED);
  }

}