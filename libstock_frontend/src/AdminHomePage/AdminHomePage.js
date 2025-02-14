// src/AdminHomePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminHomePage.css";

const AdminHomePage = () => {
  const [databaseBooks, setDatabaseBooks] = useState([]); // Books in DB
  const [filteredBooks, setFilteredBooks] = useState([]); // Books after filtering
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/book/get_all");
      setDatabaseBooks(response.data);
      setFilteredBooks(response.data); // Initialize filtered books
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const removeBook = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/book/delete?id=${id}`);
      setDatabaseBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== id)
      );
      setFilteredBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== id)
      );
    } catch (error) {
      console.error("Error deleting book", error);
    }
  };

  // Handle Search Input
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = databaseBooks.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  // Organizing books alphabetically
  const booksByLetter = filteredBooks.reduce((acc, book) => {
    const firstLetter = book.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(book);
    return acc;
  }, {});

  return (
    <div className="home-container">
      <h1>Welcome to Your Dashboard</h1>
      <div className="main-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="book-list">
          <h2>Books in Database</h2>
          <span className="book-count">
            Total Books: {filteredBooks.length}
          </span>
          {filteredBooks.length > 0 ? (
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
                          <strong>Publication Date:</strong>{" "}
                          {book.publicationDate}
                        </p>
                        <button onClick={() => removeBook(book.id)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <p>No books in the database.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
