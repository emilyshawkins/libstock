// Brandon Gascon - wrote //
// custom list model //
package com.example.libstock_backend.Repositories;

import com.example.libstock_backend.Models.CustomList;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface CustomListRepository extends MongoRepository<CustomList, String> {
    List<CustomList> findByUserId(String userId);
    List<CustomList> findByListName(String listName);
    CustomList findByUserIdAndListName(String userId, listName);
}
