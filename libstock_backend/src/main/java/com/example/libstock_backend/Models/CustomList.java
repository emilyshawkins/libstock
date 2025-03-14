// Brandon Gascon - wrote //
// custom list model //
package com.example.libstock_backend.Models;

import java.ArrayList;
import java.Util;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "custom_list")
public class CustomList {
    @Id
    private String id;

    private String userId;
    private String listName;
    private List bookId;

    public CustomList() {}

    public CustomList(String userId, String listName, List bookId) {
        this.userId = userId;
        this.listName = listName;
        this.bookId = bookId;
    }

    public String getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }
    public String getListName() {
        return listName;
    }
    public List getBookId() {
        return bookId;
    }

    public void setListName(String listName) {
        this.listName = listName;
    }
    public void setBookId(String bookId) {
        this.bookId = bookId;
    }
}