package com.example.libstock_backend.DTOs;

public class GenreUpdateDTO {

    private String currentName;
    private String newName;

    public GenreUpdateDTO() {}

    public GenreUpdateDTO(String currentName, String newName) {
        this.currentName = currentName;
        this.newName = newName;
    }

    public String getCurrentName() {
        return currentName;
    }

    public String getNewName() {
        return newName;
    }

    public void setCurrentName(String currentName) {
        this.currentName = currentName;
    }

    public void setNewName(String newName) {
        this.newName = newName;
    }
    
}
