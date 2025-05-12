// Brandon Gascon - wrote //
// custom list model //
package com.example.libstock_backend.Repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.libstock_backend.Models.CustomList;

public interface CustomListRepository extends MongoRepository<CustomList, String> {
    List<CustomList> findByEmail(String email);
    List<CustomList> findByListName(String listName);
    CustomList findByEmailAndListName(String email, String listName);
}
