package com.example.libstock_backend.Controllers;

import java.time.Instant;
import java.time.ZoneOffset;

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
import com.example.libstock_backend.Repositories.UserRepository;

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
    @Autowired
    UserRepository userRepository;

    @PostMapping("/create")
    // Create a new checkout
    public ResponseEntity<Object> create_checkout(@RequestParam int offset, @RequestBody Checkout checkout) {
        if (checkout.getUserId() == null || checkout.getBookId() == null) { // Check if user and book are provided
            return ResponseEntity.badRequest().body(null);
        }
        if (bookRepository.findById(checkout.getBookId()).orElse(null) == null) { // Check if book exists
            return ResponseEntity.badRequest().body(null);
        }
        if (userRepository.findById(checkout.getUserId()).orElse(null) == null) { // Check if user exists
            return ResponseEntity.badRequest().body(null);
        }

        Checkout existingCheckout = checkoutRepository.findByUserIdAndBookIdAndStatus(checkout.getUserId(), checkout.getBookId(), "Checked Out");
        if (existingCheckout != null) { // Check if user has already checked out the book
            return ResponseEntity.badRequest().body(null);
        }

        Book book = bookRepository.findById(checkout.getBookId()).orElse(null);
        if (book.getCount() == book.getNumCheckedOut()) { // Check if all copies of the book are checked out, if so add user to queue
            Queue queue = new Queue(checkout.getUserId(), checkout.getBookId(), queueRepository.countByBookId(checkout.getBookId()) + 1);
            queueRepository.save(queue);
            return ResponseEntity.badRequest().body("All copies of the book are checked out. You have been added to the queue.");
            
        }

        // Set due date to 14 days from checkout date
        Instant checkoutDate = Instant.now(); // Get current date

        Instant dueDate = Instant.now().plus(14, java.time.temporal.ChronoUnit.DAYS); // Get due date

        if (offset == 0) {
            dueDate = Instant.now().plus(14, java.time.temporal.ChronoUnit.DAYS); // Get due date for UTC
        }
        else if (offset > 0) {
            dueDate = Instant.now().plus(15, java.time.temporal.ChronoUnit.DAYS); // Get due date for time zones +
            dueDate = dueDate.atZone(ZoneOffset.UTC).withHour((23 + offset) % 24).withMinute(59).withSecond(59).withNano(999999999).toInstant();
        }
        else {
            dueDate = Instant.now().plus(13, java.time.temporal.ChronoUnit.DAYS); // Get due date for time zones -
            dueDate = dueDate.atZone(ZoneOffset.UTC).withHour((23 + offset) % 24).withMinute(59).withSecond(59).withNano(999999999).toInstant();
        }

        checkout.setStatus("Checked Out"); // Set status to checked out
        checkout.setCheckoutDate(checkoutDate); // Set checkout date
        checkout.setDueDate(dueDate); // Set due date

        book.setNumCheckedOut(book.getNumCheckedOut() + 1); 
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
    // Get all checkouts by user + history
    public ResponseEntity<Iterable<Checkout>> get_all_checkouts(@RequestParam String userId) {
        Iterable<Checkout> checkouts = checkoutRepository.findByUserId(userId);
        return ResponseEntity.ok(checkouts);
    }

    @GetMapping("/get_all_checked_out")
    // Get all checked out books
    public ResponseEntity<Iterable<Checkout>> get_all_checked_out(@RequestParam String userId) {
        Iterable<Checkout> checkouts = checkoutRepository.findByUserIdAndStatus(userId, "Checked Out");
        return ResponseEntity.ok(checkouts);
    }

    @GetMapping("/return")
    // Return a book
    public ResponseEntity<Checkout> return_book(@RequestParam String userId, @RequestParam String bookId) {
        Checkout existingCheckout = checkoutRepository.findByUserIdAndBookIdAndStatus(userId, bookId, "Checked Out"); // Find checkout
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }

        Book book = bookRepository.findById(existingCheckout.getBookId()).orElse(null); // Find book
        book.setNumCheckedOut(book.getNumCheckedOut() - 1); // Increment number of checked out books
        bookRepository.save(book);

        existingCheckout.setStatus("Returned"); // Set status to returned
        checkoutRepository.save(existingCheckout);
        return ResponseEntity.ok(existingCheckout);
    }

    @GetMapping("/renew")
    // Renew a checkout
    public ResponseEntity<Checkout> renew_checkout(@RequestParam String userId, @RequestParam String bookId) {
        Checkout existingCheckout = checkoutRepository.findByUserIdAndBookIdAndStatus(userId, bookId, "Checked Out");
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }

        // Set due date to 14 days from current date

        Instant dueDate = existingCheckout.getDueDate().plus(14, java.time.temporal.ChronoUnit.DAYS);

        existingCheckout.setDueDate(dueDate);
        checkoutRepository.save(existingCheckout);
        return ResponseEntity.ok(existingCheckout);
    }

    @GetMapping("/check_due_date") // Will probably be called by a cron job rather than from the frontend
    // Check if a book is overdue
    public void check_due_date() {
        Iterable<Checkout> checkouts = checkoutRepository.findByStatus("Checked Out");

        Instant currentDate = Instant.now(); // Get current date
        for (Checkout checkout : checkouts) { // Iterate through all checkouts
            if (currentDate.isAfter(checkout.getDueDate())) { // Check if current date is after due date
                checkout.setStatus("Overdue"); // Set status to overdue
                checkoutRepository.save(checkout); // Save checkout

                // Create notification for user
                Book book = bookRepository.findById(checkout.getBookId()).orElse(null);
                Notification notification = new Notification(checkout.getUserId(), Instant.now(), // Create notification
                                                             "Book " + book.getTitle() + " is overdue", 
                                                             false);
                notificationRepository.save(notification);

                // TODO: Send email to user
            }
            else if (currentDate.isAfter(checkout.getDueDate().minus(48, java.time.temporal.ChronoUnit.HOURS)) &&
                     currentDate.isBefore(checkout.getDueDate().minus(47, java.time.temporal.ChronoUnit.HOURS))) { // Check if book is due tomorrow
                // Create notification for user
                Book book = bookRepository.findById(checkout.getBookId()).orElse(null);
                Notification notification = new Notification(checkout.getUserId(), Instant.now(), // Create notification
                                                             "Book " + book.getTitle() + " is due tomorrow", 
                                                             false);
                notificationRepository.save(notification);

                // TODO: Send email to user
            }
        }
    }
}
