// src/AdminHomePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminHomePage.css";

const AdminHomePage = () => {
  const [databaseBooks, setDatabaseBooks] = useState([]); // Books in DB
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/book/get_all");
      setDatabaseBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };
  const filteredBooks = databaseBooks.filter((book) =>
    book.title.toLowerCase()
  );

  const booksByLetter = filteredBooks.reduce((acc, book) => {
    const firstLetter = book.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(book);
    return acc;
  }, {});

  return (
    <div className="home-container">
      <h1>Welcome to Your Dashboard</h1>
      <div className="top-bar"></div>
      <div className="main-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
          />
        </div>
        <div className="book-list">
          <h2>Books in Database</h2>
          {databaseBooks.length > 0 ? (
            Object.keys(booksByLetter)
              .sort()
              .map((letter) => (
                <div key={letter} className="book-section">
                  <h2 className="section-title">{letter}</h2>
                  <div className="book-grid">
                    {booksByLetter[letter].map((book) => (
                      <div key={book.isbn} className="book-card">
                        <h3>{book.title}</h3>
                        <p>
                          <strong>Author:</strong>{" "}
                          {book.author || "Unknown Author"}
                        </p>
                        <p>
                          <strong>ISBN:</strong> {book.isbn}
                        </p>
                        <p>
                          <strong>Publisher:</strong>{" "}
                          {book.publisher || "Unknown Publisher"}
                        </p>
                        <p>
                          <strong>Publication Date:</strong>{" "}
                          {book.publicationDate}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <p>No books in the database.</p>
          )}
        </div>
        <div className="content">
          <p>Manage your borrowed items and account here.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
