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
        Checkout existingCheckout = checkoutRepository.findByUserEmailAndISBN(checkout.getUserEmail(), checkout.getISBN());
        if (existingCheckout != null) {
            return ResponseEntity.badRequest().body(null);
        }

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

        if (existingCheckout.getStatus().equals("Checked Out") && checkout.getStatus().equals("Returned")) {
            existingCheckout.setStatus("Returned");
            checkoutRepository.save(existingCheckout);
            return ResponseEntity.ok(existingCheckout);
        }
        else if(existingCheckout.getStatus().equals("Checked Out") && new Date().after(existingCheckout.getDueDate())) {
            existingCheckout.setStatus("Overdue");
            checkoutRepository.save(existingCheckout);
            return ResponseEntity.ok(existingCheckout);
        }
        else {
            return ResponseEntity.ok(existingCheckout);
    
        }
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
}
