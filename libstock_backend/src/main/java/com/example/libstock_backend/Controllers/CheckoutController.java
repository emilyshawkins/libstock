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

import com.example.libstock_backend.Models.Checkout;
import com.example.libstock_backend.Repositories.CheckoutRepository;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/checkout")
public class CheckoutController {
    
    @Autowired
    CheckoutRepository checkoutRepository;

    @PostMapping("/create")
    public ResponseEntity<Checkout> create_checkout(@RequestBody Checkout checkout) {
        if (checkout.getUserId() == null || checkout.getBookId() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Checkout existingCheckout = checkoutRepository.findByUserIdAndBookId(checkout.getUserId(), checkout.getBookId());
        if (existingCheckout != null) {
            return ResponseEntity.badRequest().body(null);
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

        checkoutRepository.save(checkout);
        return ResponseEntity.ok(checkout); 
    }

    @GetMapping("/read")
    public ResponseEntity<Checkout> read_checkout(@RequestParam String id) {
        Checkout existingCheckout = checkoutRepository.findById(id).orElse(null);
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(existingCheckout);
    }

    @PatchMapping("/update")
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
    public ResponseEntity<Checkout> delete_checkout(@RequestParam String id) {
        Checkout existingCheckout = checkoutRepository.findById(id).orElse(null);
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }
        checkoutRepository.delete(existingCheckout);
        return ResponseEntity.ok(existingCheckout);
    }

    @GetMapping("/get_all_by_user")
    public ResponseEntity<Iterable<Checkout>> get_all_checkouts(@RequestParam String userId) {
        Iterable<Checkout> checkouts = checkoutRepository.findByUserId(userId);
        return ResponseEntity.ok(checkouts);
    }

    @GetMapping("/return")
    public ResponseEntity<Checkout> return_book(@RequestParam String id) {
        Checkout existingCheckout = checkoutRepository.findById(id).orElse(null);
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }

        existingCheckout.setStatus("Returned");
        checkoutRepository.save(existingCheckout);
        return ResponseEntity.ok(existingCheckout);
    }

    @GetMapping("/check_due_date")
    public ResponseEntity<Checkout> check_due_date(@RequestParam String id) {
        Checkout existingCheckout = checkoutRepository.findById(id).orElse(null);
        if (existingCheckout == null) {
            return ResponseEntity.notFound().build();
        }

        Date currentDate = new Date();
        if (currentDate.after(existingCheckout.getDueDate())) {
            existingCheckout.setStatus("Overdue");
            checkoutRepository.save(existingCheckout);
        }

        return ResponseEntity.ok(existingCheckout);
    }

    @GetMapping("/renew")
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
