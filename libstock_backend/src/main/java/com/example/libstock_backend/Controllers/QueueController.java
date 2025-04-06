package com.example.libstock_backend.Controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.libstock_backend.DTOs.QueueDTO;
// import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.Queue;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.CheckoutRepository;
import com.example.libstock_backend.Repositories.QueueRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/queue")
public class QueueController {
    
    @Autowired
    QueueRepository queueRepository;
    @Autowired
    CheckoutRepository checkoutRepository;
    @Autowired
    BookRepository bookRepository;

    @PostMapping("/create")
    // Create a new queue
    public ResponseEntity<Object> create_queue(@RequestParam String userId, @RequestParam String bookId) {
        if (userId == null || bookId == null) { // Check if user ID and book ID are provided
            return ResponseEntity.badRequest().body("User ID and Book ID are required.");
        }
        if(bookRepository.findById(bookId).orElse(null) == null) { // Check if book exists
            return ResponseEntity.badRequest().body("Book not found.");
        }

        Queue existingQueue = queueRepository.findByBookId(bookId); // Check if queue already exists
        if (existingQueue == null) { // Create a new queue if it doesn't exist
            ArrayList<String> queueList = new ArrayList<>();
            queueList.add(userId); // Add user ID to the queue
            existingQueue = new Queue(bookId, queueList);
            queueRepository.save(existingQueue); // Save the queue
            return ResponseEntity.ok(new QueueDTO(bookId, userId, existingQueue.getQueueList().size())); // Return the queue
        }
        else { // Add user to existing queue
            if (existingQueue.getQueueList() == null) {
                existingQueue.setQueueList(new ArrayList<>());
            }
            if (!existingQueue.getQueueList().contains(userId)) {
                existingQueue.getQueueList().add(userId); // Add user ID to the queue
                return ResponseEntity.ok(new QueueDTO(bookId, userId, existingQueue.getQueueList().size())); // Return the queue
            } else {
                return ResponseEntity.badRequest().body("User already in queue.");
            }
        }
            
    }

    @GetMapping("/read")
    // Read a queue by id
    public ResponseEntity<Object> read_queue(@RequestParam String userId, @RequestParam String bookId) {
        Queue existingQueue = queueRepository.findByBookId(bookId); // Find queue by book ID
        if (existingQueue == null) {
            return ResponseEntity.notFound().build(); // Return 404 if queue not found
        }
        if (existingQueue.getQueueList() == null || !existingQueue.getQueueList().contains(userId)) {
            return ResponseEntity.badRequest().body("User not in queue."); // Return 400 if user not in queue
        }
        int position = existingQueue.getQueueList().indexOf(userId) + 1; // Get user's position in the queue
        return ResponseEntity.ok(new QueueDTO(bookId, userId, position)); // Return user's position in the queue
    }

    // @PatchMapping("/update")
    // // Update a queue
    // public ResponseEntity<Queue> update_queue(@RequestParam String id) {
    //     Queue existingQueue = queueRepository.findById(id).orElse(null);
    //     if (existingQueue == null) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     existingQueue.setUserId(id);
    //     existingQueue.setBookId(id);
    //     existingQueue.setPosition(existingQueue.getPosition() - 1);
    //     queueRepository.save(existingQueue);
    //     return ResponseEntity.ok(existingQueue);
    // }

    @DeleteMapping("/delete")
    // Delete a queue
    public ResponseEntity<Object> delete_queue(@RequestParam String userId, @RequestParam String bookId) {
        Queue existingQueue = queueRepository.findByBookId(bookId); // Find queue by book ID
        if (existingQueue == null) {
            return ResponseEntity.notFound().build(); // Return 404 if queue not found
        }
        if (existingQueue.getQueueList() == null || !existingQueue.getQueueList().contains(userId)) {
            return ResponseEntity.badRequest().body("User not in queue."); // Return 400 if user not in queue
        }
        existingQueue.getQueueList().remove(userId); // Remove user ID from the queue

        queueRepository.save(existingQueue); // Save the updated queue

        return ResponseEntity.ok("User removed from queue."); // Return success message
    }

    @GetMapping("/get_waiting")
    // Get waiting list for a book
    public ResponseEntity<Object> get_waiting_list(@RequestParam String userId) {
        List<Queue> queues = queueRepository.findByQueueListContaining(userId); // Find queues containing user ID
        
        List<QueueDTO> positions = new ArrayList<>(); // List to store books in the queue
        for (Queue queue : queues) {
            positions.add(new QueueDTO(queue.getBookId(), userId, queue.getQueueList().indexOf(userId) + 1)); // Add book ID and position to the list
        }

        return ResponseEntity.ok(positions); // Return list of books in the queue
    }
}
