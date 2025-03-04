package com.example.libstock_backend.Controllers;

import java.util.Calendar;
import java.util.Date;

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
import com.example.libstock_backend.Models.Checkout;
import com.example.libstock_backend.Models.Notification;
import com.example.libstock_backend.Models.Queue;
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.CheckoutRepository;
import com.example.libstock_backend.Repositories.NotificationRepository;
import com.example.libstock_backend.Repositories.QueueRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/checkout")
public class CheckoutController {
    
    @Autowired
    CheckoutRepository checkoutRepository;
    @Autowired
    BookRepository bookRepository;
    @Autowired
    NotificationRepository notificationRepository;
    @Autowired
    QueueRepository queueRepository;

    @PostMapping("/create")
    // Create a new checkout
    public ResponseEntity<Object> create_checkout(@RequestBody Checkout checkout) {
        if (checkout.getUserId() == null || checkout.getBookId() == null) { // Check if user and book are provided
            return ResponseEntity.badRequest().body(null);
        }
        Checkout existingCheckout = checkoutRepository.findByUserIdAndBookId(checkout.getUserId(), checkout.getBookId());
        if (existingCheckout != null && existingCheckout.getStatus() == "Checked Out") { // Check if user has already checked out the book
            return ResponseEntity.badRequest().body(null);
        }
        Book book = bookRepository.findById(checkout.getBookId()).orElse(null);
        if (queueRepository.countByBookId(checkout.getBookId()) > 0 || book.getCount() == 0) { // Check if there is a queue for the book
            Queue queue = new Queue(checkout.getUserId(), checkout.getBookId(), queueRepository.countByBookId(checkout.getBookId()) + 1);
            queueRepository.save(queue);
            return ResponseEntity.badRequest().body("All copies of the book are checked out. You have been added to the queue.");
        }

        // Set due date to 14 days from checkout date
        Date checkoutDate = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(checkoutDate);
        c.add(Calendar.DATE, 14);
        Date dueDate = c.getTime();

        checkout.setStatus("Checked Out");
        checkout.setCheckoutDate(checkoutDate);
        checkout.setDueDate(dueDate);

        book.setCount(book.getCount() - 1);
        bookRepository.save(book);

        checkoutRepository.save(checkout);
        return ResponseEntity.ok(checkout); 
    }

    @GetMapping("/read")
    // Read a checkout
    public ResponseEntity<Checkout> read_checkout(@RequestParam String id) {
        Checkout existingCheckout = checkoutRepository.findById(id).orElse(null);
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(existingCheckout);
    }

    @PatchMapping("/update")
    // Update a checkout
    public ResponseEntity<Checkout> update_checkout(@RequestBody Checkout checkout) {
        Checkout existingCheckout = checkoutRepository.findById(checkout.getId()).orElse(null);
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }

        existingCheckout.setBookId(checkout.getBookId());
        existingCheckout.setUserId(checkout.getUserId());

        checkoutRepository.save(existingCheckout);
        return ResponseEntity.ok(existingCheckout);

    }

    @DeleteMapping("/delete")
    // Delete a checkout
    public ResponseEntity<Checkout> delete_checkout(@RequestParam String id) {
        Checkout existingCheckout = checkoutRepository.findById(id).orElse(null);
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }
        checkoutRepository.delete(existingCheckout);
        return ResponseEntity.ok(existingCheckout);
    }

    @GetMapping("/get_all_by_user")
    // Get all checkouts by user
    public ResponseEntity<Iterable<Checkout>> get_all_checkouts(@RequestParam String userId) {
        Iterable<Checkout> checkouts = checkoutRepository.findByUserId(userId);
        return ResponseEntity.ok(checkouts);
    }

    @GetMapping("/return")
    // Return a book
    public ResponseEntity<Checkout> return_book(@RequestParam String id) {
        Checkout existingCheckout = checkoutRepository.findById(id).orElse(null);
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }

        Book book = bookRepository.findById(existingCheckout.getBookId()).orElse(null);
        book.setCount(book.getCount() + 1);
        bookRepository.save(book);

        existingCheckout.setStatus("Returned"); // Set status to returned
        checkoutRepository.save(existingCheckout);
        return ResponseEntity.ok(existingCheckout);
    }

    @GetMapping("/check_due_date")
    // Check if a book is overdue
    public ResponseEntity<Checkout> check_due_date(@RequestParam String id) {
        Checkout existingCheckout = checkoutRepository.findById(id).orElse(null);
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }

        Date currentDate = new Date();
        if (currentDate.after(existingCheckout.getDueDate())) {
            existingCheckout.setStatus("Overdue");
            checkoutRepository.save(existingCheckout);

            // Create notification for user
            Book book = bookRepository.findById(existingCheckout.getBookId()).orElse(null);
            Notification notification = new Notification(existingCheckout.getUserId(), new Date(), 
                                                         "Book " + book.getTitle() + " is overdue", 
                                                         false);
            notificationRepository.save(notification);
        }

        return ResponseEntity.ok(existingCheckout);
    }

    @GetMapping("/renew")
    // Renew a checkout
    public ResponseEntity<Checkout> renew_checkout(@RequestParam String id) {
        Checkout existingCheckout = checkoutRepository.findById(id).orElse(null);
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }

        // Set due date to 14 days from current date
        Date currentDate = new Date();
        Calendar c = Calendar.getInstance();
        c.setTime(currentDate);
        c.add(Calendar.DATE, 14);
        Date dueDate = c.getTime();

        existingCheckout.setDueDate(dueDate);
        checkoutRepository.save(existingCheckout);
        return ResponseEntity.ok(existingCheckout);
    }

}
