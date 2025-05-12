package com.example.libstock_backend.bookbargain;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookbargain")
public class BookBargainController {

    private final BookBargainService bookBargainService;

    public BookBargainController(BookBargainService bookBargainService) {
        this.bookBargainService = bookBargainService;
    }

    @GetMapping("/prices")
    public ResponseEntity<BookInfo> getBookPrices(@RequestParam String isbn) {
        try {
            BookInfo bookInfo = bookBargainService.getBookInfo(isbn);
            return ResponseEntity.ok(bookInfo);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}