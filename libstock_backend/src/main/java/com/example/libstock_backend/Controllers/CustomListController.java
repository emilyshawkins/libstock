// Brandon Gascon - created //
// custom list controller for user to create their own custom lists of books //

package com.example.libstock_backend.Controllers;

import java.util.ArrayList;
import java.util.List;

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

import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.CustomList;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.CustomListRepository;
import com.example.libstock_backend.Repositories.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize; // used to authorize use of certain methods only for admins //

@RestController
@RequestMapping("/customList")
public class CustomListController {

    @Autowired
    public CustomListRepository customListRepository;
    @Autowired
    public BookRepository bookRepository;
    @Autowired
    public UserRepository userRepository;

    @PostMapping("/create")
    // Create a new custom list
    public ResponseEntity<Object> create_custom_list(@RequestBody customList customList) {
        if (customList.getUserId() == null || customList.getListName() == null) { // Check if user ID and List Name are provided
            return ResponseEntity.badRequest().body("User ID and List Name are required.");
        }
        // if(bookRepository.findById(customList.customList()).orElse(null) == null) { // Check if book exists
        //     return ResponseEntity.badRequest().body("Book not found.");
        // }
        if(userRepository.findById(customList.getUserId()).orElse(null) == null) { // Check if user exists
            return ResponseEntity.badRequest().body("User not found.");
        }
        
        CustomList existingCustomList = custom.findByUserIdAndListName(customList.getUserId(), customList.getListName());
        if (existingCustomList != null) { // Check if customList already exists
            return ResponseEntity.badRequest().body("Custom List already exists.");
        }
        
        CustomListRepository.save(customList);
        return ResponseEntity.ok(customList);
    }

    @GetMapping("/read")
    // Read a custom list
    public ResponseEntity<CustomList> read_custom_list(@RequestParam String id) { 
        CustomList customList = customListRepository.findById(id).orElse(null);
        if (favorite == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(favorite);
    }

    @PatchMapping("/update")
    // Update a custom list
    public ResponseEntity<CustomList> update_custom_list(@RequestBody CustomList customList) { // Delete will probably be a better option
        CustomList existingCustomList= customListRepository.findById(customList.getId()).orElse(null);
        if (existingCustomList == null) {
            return ResponseEntity.notFound().build();
        }

        if (customList.getUserId() != null) {
            existingCustomList.setUserId(customList.getUserId());
        }
        if (customList.getBookId() != null) {
            existingCustomList.setBookId(customList.getBookId());
        }

        customListRepository.save(customList);
        return ResponseEntity.ok(customList);
    }

    @DeleteMapping("/delete")
    // Delete a custom list by user and list name
    public ResponseEntity<CustomList> delete_favorite_by_ids(@RequestParam String userId, @RequestParam String listName) {
        CustomList customList = customListRepository.findByUserIdAndListName(userId, listName);
        if (customList == null) {
            return ResponseEntity.notFound().build();
        }
        customListRepository.delete(customList);
        return ResponseEntity.ok(customList);
    }

    //@GetMapping("/get_customLists_by_user")
    // Get all custom lists by user
    //public ResponseEntity<Iterable<Book>> get_customLists_by_user(@RequestParam String userId) {
    //    Iterable<CustomList> customLists = customListRepository.findByUserId(userId);
    //    List<Book> books = new ArrayList<>();
    //    for (CustomList customList : customLists) { // Get all books from custom list
    //        Book book = bookRepository.findById(customList.getBookId()).orElse(null);
    //        if (book != null) {
    //            books.add(book);
    //        }
    //    }
    //
    //    return ResponseEntity.ok(books);
    //}

}