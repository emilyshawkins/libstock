package com.example.libstock_backend.Repositories;

import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.libstock_backend.Models.User;

public interface UserRepository extends MongoRepository<User, String> {
  List<User> findByNameContaining(String name);
}