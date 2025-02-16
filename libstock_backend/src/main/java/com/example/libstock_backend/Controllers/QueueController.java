package com.example.libstock_backend.Controllers;

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
    public ResponseEntity<Queue> create_queue(@RequestBody Queue queue) {
        if (queue.getUserId() == null || queue.getBookId() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Queue existingQueue = queueRepository.findByUserIdAndBookId(queue.getUserId(), queue.getBookId());
        if (existingQueue != null) {
            return ResponseEntity.badRequest().body(null);
        }
        int position = queueRepository.countByBookId(queue.getBookId()) + 1;
        queue.setPosition(position);
        queueRepository.save(queue);
        return ResponseEntity.ok(queue); 
    }

    @GetMapping("/read")
    public ResponseEntity<Queue> read_queue(@RequestParam String id) {
        Queue existingQueue = queueRepository.findById(id).orElse(null);
        if (existingQueue == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(existingQueue);
    }

    @PatchMapping("/update")
    public ResponseEntity<Queue> update_queue(@RequestParam String id) {
        Queue existingQueue = queueRepository.findById(id).orElse(null);
        if (existingQueue == null) {
            return ResponseEntity.notFound().build();
        }

        existingQueue.setUserId(id);
        existingQueue.setBookId(id);
        existingQueue.setPosition(existingQueue.getPosition() - 1);
        queueRepository.save(existingQueue);
        return ResponseEntity.ok(existingQueue);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<Queue> delete_queue(@RequestParam String id) {
        Queue existingQueue = queueRepository.findById(id).orElse(null);
        if (existingQueue == null) {
            return ResponseEntity.notFound().build();
        }
        queueRepository.delete(existingQueue);
        return ResponseEntity.ok(existingQueue);
    }

    @GetMapping("/update_positions")
    public ResponseEntity<String> update_positions(@RequestParam String bookId) {
        Book book = bookRepository.findById(bookId).orElse(null);
        if (book.getCount() > 0) { // Check if there are books available
            
            List<Queue> queues = queueRepository.findByBookId(bookId); // Get all queues for the book
            for (int i = 0; i < queues.size(); i++) { // Iterate through queues
                if (queues.get(i).getPosition() == 1) { // Check if the first person in the queue
                    Queue queue = queues.get(i); // Get the first person in the queue
                    queueRepository.delete(queue); // Remove the first person from the queue
                    book.setCount(book.getCount() - 1); // Decrement the book count
                    bookRepository.save(book); // Save the book
                    queueRepository.save(null); // Save the queue
                }
                else {
                    Queue queue = queues.get(i); // Get the person in the queue
                    queue.setPosition(queue.getPosition() - 1); // Decrement the position
                    queueRepository.save(queue); // Save the queue
                }
            }
        }
        return ResponseEntity.ok("Positions updated");
    }
}
