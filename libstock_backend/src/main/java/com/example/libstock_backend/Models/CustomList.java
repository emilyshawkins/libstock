// Brandon Gascon - wrote //
// custom list model //
package com.example.libstock_backend.Models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "custom_list")
public class CustomList {
    @Id
    private String id;

    private String email;
    private String listName;
    private List<String> bookIds;

    public CustomList() {}

    public CustomList(String email, String listName, List<String> bookIds) {
        this.email = email;
        this.listName = listName;
        this.bookIds = bookIds;
    }

    public String getId() {
        return id;
    }
    public String getEmail() {
        return email;
    }
    public String getListName() {
        return listName;
    }
    public List<String> getBookIds() {
        return bookIds;
    }

    public void setListName(String listName) {
        this.listName = listName;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setBookIds(List<String> bookIds) {
        this.bookIds = bookIds;
    }


    // for add/ remove books from custom list
    public void addBook(String ISBN) {
        if (!this.bookIds.contains(ISBN)) { // check if book is already added
            this.bookIds.add(ISBN);
        }
    }
    public void removeBook(String ISBN) {
        this.bookIds.remove(ISBN);
    }
}