package com.example.libstock_backend.bookbargain;

import lombok.Data;

@Data
public class BookPrice {
    private String store;
    private Double price;
    private String url;
}