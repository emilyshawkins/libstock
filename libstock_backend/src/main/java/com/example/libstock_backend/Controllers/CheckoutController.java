package com.example.libstock_backend.Controllers;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.libstock_backend.Models.Book;
import com.example.libstock_backend.Models.Checkout;
import com.example.libstock_backend.Models.Notification;
import com.example.libstock_backend.Models.Queue; // used for mail services //
import com.example.libstock_backend.Models.User; // used for mail services //
import com.example.libstock_backend.Repositories.BookRepository;
import com.example.libstock_backend.Repositories.CheckoutRepository;
import com.example.libstock_backend.Repositories.NotificationRepository;
import com.example.libstock_backend.Repositories.QueueRepository;
import com.example.libstock_backend.Repositories.UserRepository;
import com.example.libstock_backend.Config.NotificationConfig; // to send notifications to frontend //

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
    @Autowired
    private JavaMailSender mailSender; // mail sending function import //
    @Autowired
    private NotificationConfig notificationConfig; // used to notification //
    

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
        // if (book.getCount() == book.getNumCheckedOut()) { // Check if all copies of the book are checked out, if so add user to queue
        //     Queue queue = new Queue(checkout.getUserId(), checkout.getBookId(), queueRepository.countByBookId(checkout.getBookId()) + 1);
        //     queueRepository.save(queue);
        //     return ResponseEntity.badRequest().body("All copies of the book are checked out. You have been added to the queue.");
            
        // }

        // Set due date to 14 days from checkout date
        Instant checkoutDate = Instant.now(); // Get current date

        Instant dueDate = Instant.now().plus(14, java.time.temporal.ChronoUnit.DAYS); // Get due date
        dueDate = dueDate.atZone(ZoneOffset.UTC).withHour(23).withMinute(59).withSecond(59).withNano(999).toInstant();
        dueDate = dueDate.plus(offset, java.time.temporal.ChronoUnit.HOURS); // Add offset to due date
        

        checkout.setStatus("Checked Out"); // Set status to checked out
        checkout.setCheckoutDate(checkoutDate); // Set checkout date
        checkout.setDueDate(dueDate); // Set due date

        book.setNumCheckedOut(book.getNumCheckedOut() + 1); 
        bookRepository.save(book);

        checkoutRepository.save(checkout);

        System.out.println(checkout.getCheckoutDate());
        System.out.println(checkout.getDueDate());
        return ResponseEntity.ok(checkout); 
    }

    // @GetMapping("/read")
    // // Read a checkout
    // public ResponseEntity<Checkout> read_checkout(@RequestParam String id) {
    //     Checkout existingCheckout = checkoutRepository.findById(id).orElse(null);
    //     if (existingCheckout == null) {
    //         return ResponseEntity.notFound().build();
    //     }
    //     return ResponseEntity.ok(existingCheckout);
    // }

    // @PatchMapping("/update")
    // // Update a checkout
    // public ResponseEntity<Checkout> update_checkout(@RequestBody Checkout checkout) {
    //     Checkout existingCheckout = checkoutRepository.findById(checkout.getId()).orElse(null);
    //     if (existingCheckout == null) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     existingCheckout.setBookId(checkout.getBookId());
    //     existingCheckout.setUserId(checkout.getUserId());

    //     checkoutRepository.save(existingCheckout);
    //     return ResponseEntity.ok(existingCheckout);

    // }

    // @DeleteMapping("/delete")
    // // Delete a checkout
    // public ResponseEntity<Checkout> delete_checkout(@RequestParam String id) {
    //     Checkout existingCheckout = checkoutRepository.findById(id).orElse(null);
    //     if (existingCheckout == null) {
    //         return ResponseEntity.notFound().build();
    //     }
    //     checkoutRepository.delete(existingCheckout);
    //     return ResponseEntity.ok(existingCheckout);
    // }

    // @GetMapping("/get_all_by_user")
    // // Get all checkouts by user + history
    // public ResponseEntity<Iterable<Checkout>> get_all_checkouts(@RequestParam String userId) {
    //     Iterable<Checkout> checkouts = checkoutRepository.findByUserId(userId);
    //     return ResponseEntity.ok(checkouts);
    // }

    @GetMapping("/get_all_checked_out")
    // Get all checked out books
    public ResponseEntity<Iterable<Checkout>> get_all_checked_out(@RequestParam String userId) {
        Iterable<Checkout> checkouts = checkoutRepository.findByUserIdAndStatus(userId, "Checked Out");
        return ResponseEntity.ok(checkouts);
    }

    // @GetMapping("/get_all_overdue")
    // // Get all overdue books
    // public ResponseEntity<Object> get_all_overdue(@RequestParam String userId) {
    //     Iterable<Checkout> checkouts = checkoutRepository.findByUserIdAndStatus(userId, "Overdue");

    //     ArrayList<OverdueDTO> overdueList = new ArrayList<>(); // Create list of overdue books

    //     for (Checkout checkout : checkouts) {
    //         Duration duration = Duration.between(checkout.getDueDate(), Instant.now()); // Get duration between due date and current date
    //         long days = duration.toDays(); // Get number of days overdue
    //         Double fee = days * 0.25; // Calculate fee

    //         OverdueDTO overdue = new OverdueDTO(checkout.getId(), checkout.getUserId(), checkout.getBookId(), checkout.getCheckoutDate(), checkout.getDueDate(), fee); // Create overdue object

    //         overdueList.add(overdue); // Add to list
    //     }

    //     return ResponseEntity.ok(overdueList); // Return list
    // }

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

        Queue queue = queueRepository.findByBookId(bookId); // Fetch queue only once

        if (queue != null && queue.getQueueList().size() > 0) {
            String nextUser = queue.getQueueList().get(0); // Get first user in queue

            Checkout queueCheckout = new Checkout(
                nextUser,
                bookId,
                Instant.now(),
                Instant.now().plus(14, ChronoUnit.DAYS),
                Instant.now(),
                "Checked Out"
            );

            this.create_checkout(0, queueCheckout); // Create checkout

            queue.getQueueList().remove(0); // Remove user from queue directly on the object you will save

            queueRepository.save(queue); // Persist updated queue

            Notification notification = new Notification(
                queueCheckout.getUserId(),
                Instant.now(),
                "Book " + book.getTitle() + " is available for checkout",
                false
            );

            notificationRepository.save(notification); // Save notification

            //TODO: Send email to user in queue
            // Create notification for user in queue
            Optional<User> userCheckOut = userRepository.findById(queueCheckout.getUserId());
            if(userCheckOut.isPresent()) {
                String userEmail = userCheckOut.get().getEmail();
                SimpleMailMessage mail = new SimpleMailMessage();
                mail.setTo(userEmail);
                mail.setSubject("LibStock: Your book is ready!");
                String message = "The book: " + book + " that you have request is ready to be picked up.";
                mail.setText(message);

                mailSender.send(mail);
                notificationConfig.sendNotification(queueCheckout.getUserId(), message);
            }
        }

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
                Optional<User> userDueDate = userRepository.findById(checkout.getUserId());
                if(userDueDate.isPresent()) {
                    String userEmail = userDueDate.get().getEmail();
                    SimpleMailMessage mail = new SimpleMailMessage();
                    mail.setTo(userEmail);
                    mail.setSubject("LibStock: " + notification);
                    String message = "The book: " + book + " you have checked out is overdue! Please return it!";
                    mail.setText(message);

                    mailSender.send(mail);
                    notificationConfig.sendNotification(checkout.getUserId(), message);
                }
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
                Optional<User> userCheckOut = userRepository.findById(checkout.getUserId());
                if(userCheckOut.isPresent()) {
                    String userEmail = userCheckOut.get().getEmail();
                    SimpleMailMessage mail = new SimpleMailMessage();
                    mail.setTo(userEmail);
                    mail.setSubject("LibStock Your book is about to be overdue!");
                    String message = "The book: " + book + " you have checked out is about to be overdue. Please return it as soon as possible as to not incur overdue fees.";
                    mail.setText(message);

                    mailSender.send(mail);
                    notificationConfig.sendNotification(checkout.getUserId(), message);

                }
            }
        }
    }
}