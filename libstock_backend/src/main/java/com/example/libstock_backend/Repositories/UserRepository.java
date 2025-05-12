// Brandon Gascon - modified //
// added findByResetToken for password reset handling, Emily created this file //

package com.example.libstock_backend.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.libstock_backend.Models.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email); // Find user by email
    User findByResetToken(String resetToken);
}