package com.example.libstock_backend.bookbargain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class BookBargainService {

    @Value("${bookbargain.api.url:http://bookbargain.in}")
    private String apiBaseUrl;

    private final RestTemplate restTemplate;

    public BookBargainService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public BookInfo getBookInfo(String isbn) {
        String url = UriComponentsBuilder.fromHttpUrl(apiBaseUrl)
                .path("/api")
                .queryParam("isbn", isbn)
                .toUriString();

        return restTemplate.getForObject(url, BookInfo.class);
    }
}