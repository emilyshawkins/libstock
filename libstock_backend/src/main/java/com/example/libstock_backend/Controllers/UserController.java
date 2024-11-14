package com.example.libstock_backend.Controllers;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Repositories.UserRepository;

@RestController
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