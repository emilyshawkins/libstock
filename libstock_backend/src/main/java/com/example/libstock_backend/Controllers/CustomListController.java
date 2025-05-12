// Brandon Gascon - wrote //
// custom list controller for user to create their own custom lists of books //

package com.example.libstock_backend.Controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
import com.example.libstock_backend.Models.User;
import com.example.libstock_backend.Models.CustomList;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.CustomListRepository;
import com.example.libstock_backend.Repositories.UserRepository;

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
    public ResponseEntity<Object> create_custom_list(@RequestParam String email, @RequestParam String listName, @RequestParam String ISBN) {
        if (email == null || listName == null || ISBN == null) { // Check if email, listName, and atleast 1 bookid is given //
            return ResponseEntity.badRequest().body("Need an email, listName, and atleast 1 ISBN.");
        }
        if (userRepository.findByEmail(email) == null) { // Check if email is valid
            return ResponseEntity.badRequest().body("Valid user email required.");
        }
        if (bookRepository.findByISBN(ISBN) == null) { // Check if email is valid
            return ResponseEntity.badRequest().body("Valid book ISBN required.");
        }
        
        CustomList customList = customListRepository.findByEmailAndListName(email, listName);

        if (customListRepository.findByEmailAndListName(email, listName) != null) { // Check if customList already exists
            return ResponseEntity.badRequest().body("Custom List already exists.");
        }
        if (customList == null) {
            List<String> bookIds = new ArrayList<>();
            bookIds.add(ISBN);
            customList = new CustomList(email, listName, bookIds);
        } else {
            if (customList.getBookIds() == null) {
                customList.setBookIds(new ArrayList<>());
            }
            if (!customList.getBookIds().contains(ISBN)) {
                customList.getBookIds().add(ISBN);
            } else {
                return ResponseEntity.badRequest().body("Book is already in your list");
            }
        }

        customListRepository.save(customList);
        return ResponseEntity.ok(customList);
    }

    @PostMapping("/addBook")
    public ResponseEntity<Object> addBookToList(@RequestParam String userId, @RequestParam String listName, @RequestParam String bookId) {
        CustomList customList = customListRepository.findByEmailAndListName(userId, listName);
        if (customList == null) {
            return ResponseEntity.badRequest().body("Custom List not found.");
        }

        if (bookRepository.findById(bookId).isEmpty()) {
            return ResponseEntity.badRequest().body("Book not found.");
        }

        customList.addBook(bookId);
        customListRepository.save(customList);
        return ResponseEntity.ok(customList);
    }

    @DeleteMapping("/removeBook")
    public ResponseEntity<Object> removeBookFromList(@RequestParam String userId, @RequestParam String listName, @RequestParam String bookId) {
        CustomList customList = customListRepository.findByEmailAndListName(userId, listName);
        if (customList == null) {
            return ResponseEntity.badRequest().body("Custom list not found.");
        }

        List<String> bookIds = customList.getBookIds(); // Get the list of books
        if (!bookIds.contains(bookId)) {
            return ResponseEntity.badRequest().body("Book not found in the custom list.");
        }

        bookIds.remove(bookId); // Remove the book
        customListRepository.save(customList); // Save the updated list

        return ResponseEntity.ok("Book removed successfully.");
    }

    @GetMapping("/read")
    // Read a custom list
    public ResponseEntity<CustomList> read_custom_list(@RequestParam String id) { 
        CustomList customList = customListRepository.findById(id).orElse(null);
        if (customList == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(customList);
    }

    // @PatchMapping("/update")
    // // Update a custom list
    // public ResponseEntity<CustomList> update_custom_list(@RequestBody CustomList customList) { // Delete will probably be a better option
    //     CustomList existingCustomList= customListRepository.findById(customList.getId()).orElse(null);
    //     if (existingCustomList == null) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     if (customList.getUserId() != null) {
    //         existingCustomList.setUserId(customList.getUserId());
    //     }
    //     if (customList.getBookIds() != null) {
    //         existingCustomList.setBookIds(customList.getBookIds());
    //     }

    //     customListRepository.save(customList);
    //     return ResponseEntity.ok(customList);
    // }

    @DeleteMapping("/delete")
    // Delete a custom list by user and list name
    public ResponseEntity<CustomList> delete_favorite_by_ids(@RequestParam String userId, @RequestParam String listName) {
        CustomList customList = customListRepository.findByEmailAndListName(userId, listName);
        if (customList == null) {
            return ResponseEntity.notFound().build();
        }
        customListRepository.delete(customList);
        return ResponseEntity.ok(customList);
    }

}