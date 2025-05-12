package com.example.libstock_backend.Models;

import java.util.ArrayList;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//Queue if book is not available
@Document(collection = "queues")
public class Queue {
    @Id
    private String id;

    private String bookId; // Book ID
    private ArrayList<String> queueList; // List of users in the queue

    public Queue() {}

    public Queue(String bookId, ArrayList<String> queueList) {
        this.bookId = bookId;
        this.queueList = queueList;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBookId() {
        return bookId;
    }

    public void setBookId(String bookId) {
        this.bookId = bookId;
    }

    public ArrayList<String> getQueueList() {
        return queueList;
    }

    public void setQueueList(ArrayList<String> queueList) {
        this.queueList = queueList;
    }
}
