import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminInventory.css";

const API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY; // Access API key from .env

const AdminInventory = () => {
  const [databaseBooks, setDatabaseBooks] = useState([]); // Books in DB
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null); // Stores book selected for adding
  const [bookDetails, setBookDetails] = useState({
    price: "",
    count: "",
    purchaseable: false,
    numCheckedOut: "",
  });

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

  const handleAddBookClick = (book) => {
    setSelectedBook(book); // Store the book being added
    setBookDetails({
      price: "",
      count: "",
      purchaseable: false,
      numCheckedOut: "",
    });
  };

  const handleBookDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "checkbox" ? checked : value,
    }));
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
        setSearchResults(response.data.items.slice(0, 5)); // Show top 6 results
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const confirmAddBook = async () => {
    if (!selectedBook?.volumeInfo) return; // Prevent undefined errors
    // Validate input fields before adding the book
    if (
      bookDetails.price === "" ||
      bookDetails.count === "" ||
      bookDetails.numCheckedOut === ""
    ) {
      alert("Please fill in all fields before adding the book.");
      return;
    }
    const bookData = {
      isbn:
        selectedBook.volumeInfo.industryIdentifiers?.[0]?.identifier ||
        "Unknown",
      title: selectedBook.volumeInfo.title,
      summary:
        selectedBook.volumeInfo.description || "No description available",
      publicationDate:
        selectedBook.volumeInfo.publishedDate ||
        "No publication date available",
      price: bookDetails.price,
      purchaseable: bookDetails.purchaseable,
      count: bookDetails.count,
      numCheckedOut: bookDetails.numCheckedOut,
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
        setSelectedBook(null); // Clear selection after adding
      }
    } catch (error) {
      console.error("Error adding book to database:", error);
      alert("Failed to add book.");
    }
  };

  return (
    <div className="book-inventory-container">
      {/* Left Sidebar */}
      <header className="page-header">
        <h1>Admin Inventory</h1>
      </header>
      {/* Main Content */}
      <div className="main-content">
        <div className="search-bar">
          <h2>Search Books</h2>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* <span className="book-count">Total Books: {filteredBooks.length}</span> Count total books in database */}
          <button onClick={searchBooks}>Search</button>
        </div>

        {/* Display search results */}
        <div className="book-results">
          <h3>Search Results</h3>
          {searchResults.map((book) => {
            if (!book.volumeInfo) return null; // Prevent undefined volumeInfo

            const volumeInfo = book.volumeInfo;
            return (
              <div key={book.id} className="book-card">
                <img
                  src={volumeInfo.imageLinks?.thumbnail || "placeholder.jpg"}
                  alt={volumeInfo.title || "No Title"}
                />
                <h3>{volumeInfo.title || "No Title"}</h3>
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
                  {volumeInfo.publishedDate || "2024-05-02T00:00:00.000+00:00"}
                </p>
                <button onClick={() => handleAddBookClick(book)}>
                  Add to Database
                </button>
              </div>
            );
          })}
        </div>

        {/* Display form to input book details before adding */}
        {selectedBook && (
          <div className="add-book-form">
            <h2>Enter Book Details</h2>
            <label>
              Price:{" "}
              <input
                type="number"
                name="price"
                value={bookDetails.price}
                onChange={handleBookDetailChange}
                required
              />
            </label>
            <label>
              Count:{" "}
              <input
                type="number"
                name="count"
                value={bookDetails.count}
                onChange={handleBookDetailChange}
                required
              />
            </label>
            <label>
              Number Checked Out:{" "}
              <input
                type="number"
                name="numCheckedOut"
                value={bookDetails.numCheckedOut}
                onChange={handleBookDetailChange}
                required
              />
            </label>
            <label>
              Purchaseable:
              <input
                type="checkbox"
                name="purchaseable"
                checked={bookDetails.purchaseable}
                onChange={handleBookDetailChange}
              />
            </label>
            <button onClick={confirmAddBook}>Confirm Add</button>
            <button onClick={() => setSelectedBook(null)}>Cancel</button>
          </div>
        )}

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
    </div>
  );
};
export default AdminInventory;
