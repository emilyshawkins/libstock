package com.example.libstock_backend.bookbargain;

import lombok.Data;
import java.util.List;

@Data
public class BookInfo {
    private String isbn;
    private String title;
    private String author;
    private String publisher;
    private List<BookPrice> prices;
}