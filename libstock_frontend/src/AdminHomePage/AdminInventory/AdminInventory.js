import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminInventory.css";
import AddBook from "./AddBook";
import { Link } from "react-router-dom";

const API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY; // Access API key from .env

const AdminInventory = () => {
  const [databaseBooks, setDatabaseBooks] = useState([]); // Books in DB
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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

  const handleBookAdded = (newBook) => {
    setDatabaseBooks((prevBooks) => [...prevBooks, newBook]); // Update database list
  };

  const searchBooks = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&key=${API_KEY}`
      );

      if (response.data.items) {
        setSearchResults(response.data.items.slice(0, 5)); // Show top 5 results
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addBookToDatabase = async (book) => {
    if (!book.volumeInfo) return; // Prevent undefined errors

    const bookData = {
      isbn: book.volumeInfo.industryIdentifiers?.[0]?.identifier || "Unknown",
      title: book.volumeInfo.title,
      summary: book.volumeInfo.description || "No description available",
      publicationDate: book.volumeInfo.publishedDate || "Unknown", // Default timestamp format
      price: 50, // Default price
      purchaseable: true,
      count: 50,
      numCheckedOut: 1,
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/book/create",
        bookData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Book added successfully!");
        handleBookAdded(bookData); // Update UI
      }
    } catch (error) {
      console.error("Error adding book to database:", error);
      alert("Failed to add book.");
    }
  };

  return (
    <div id="main-container" className="main-container nav-effect-1">
      {/* MAIN CONTENT WRAPPER */}
      <div className="main clearfix">
        {/* HEADER */}
        <header id="header" className="page-header">
          <div className="page-header-container row">
            <div className="menu-search">
              {/* Main Navigation */}
              <div className="main-navigation">
                <a href="#">Menu</a>
              </div>
            </div>
          </div>
        </header>

        <div className="search-container">
          <h2>Search Books</h2>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={searchBooks}>Search</button>

          {/* Display search results */}
          <div className="book-results">
            {searchResults.map((book) => {
              const volumeInfo = book.volumeInfo; // Shortcut for readability
              return (
                <div key={book.id} className="book-card">
                  <img
                    src={volumeInfo.imageLinks?.thumbnail || "placeholder.jpg"}
                    alt={volumeInfo.title}
                  />
                  <h3>{volumeInfo.title}</h3>
                  <p>
                    <strong>Author:</strong>{" "}
                    {volumeInfo.authors?.join(", ") || "Unknown Author"}
                  </p>
                  <p>
                    <strong>ISBN:</strong>{" "}
                    {volumeInfo.industryIdentifiers?.[0]?.identifier || "N/A"}
                  </p>
                  <p>
                    <strong>Publisher:</strong>{" "}
                    {volumeInfo.publisher || "Unknown Publisher"}
                  </p>
                  <p>
                    <strong>Publication Date:</strong>{" "}
                    {volumeInfo.publishedDate || "Unknown Date"}
                  </p>
                  <button onClick={() => addBookToDatabase(book)}>
                    Add to Database
                  </button>
                </div>
              );
            })}
          </div>
          <AddBook onBookAdded={handleBookAdded} />

          {/* Display all books from the database */}
          <div className="book-list">
            <h2>Books in Database</h2>
            {databaseBooks.length > 0 ? (
              <div className="book-grid">
                {databaseBooks.map((book) => (
                  <div key={book.isbn} className="book-card">
                    <h3>{book.title}</h3>
                    <p>
                      <strong>Author:</strong> {book.author || "Unknown Author"}
                    </p>
                    <p>
                      <strong>ISBN:</strong> {book.isbn}
                    </p>
                    <p>
                      <strong>Publisher:</strong>{" "}
                      {book.publisher || "Unknown Publisher"}
                    </p>
                    <p>
                      <strong>Publication Date:</strong> {book.publicationDate}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No books in the database.</p>
            )}
          </div>
        </div>
        {/* PAGE CONTAINER */}
      </div>
      {/* /main */}

      <div className="main-overlay">
        <div className="overlay-full"></div>
      </div>
    </div>
  );
};

export default AdminInventory;
