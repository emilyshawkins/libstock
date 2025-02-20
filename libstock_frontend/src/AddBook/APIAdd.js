import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./APIAdd.css";

const API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

const AdminInventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookDetails, setBookDetails] = useState({
    price: "",
    count: "",
    purchasable: false,
    numCheckedOut: "",
  });

  const navigate = useNavigate();

  // Handles selecting a book
  const handleAddBookClick = (book) => {
    setSelectedBook(book);
    setBookDetails({
      price: "",
      count: "",
      purchasable: false,
      genre: "",
      numCheckedOut: "",
    });
  };

  // Handles input changes
  const handleBookDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBookDetails((prevDetails) => ({
      ...prevDetails,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Searches books from Google Books API
  const searchBooks = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&key=${API_KEY}`
      );

      setSearchResults(response.data.items?.slice(0, 6) || []);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // **Check if an author exists, otherwise create one**
  const getOrCreateAuthor = async (firstName, lastName) => {
    try {
      // Fetch all authors
      const response = await axios.get("http://localhost:8080/author/get_all");
      const authors = response.data;

      // Find author by first & last name
      const existingAuthor = authors.find(
        (author) =>
          author.firstName.toLowerCase() === firstName.toLowerCase() &&
          author.lastName.toLowerCase() === lastName.toLowerCase()
      );

      if (existingAuthor) {
        return existingAuthor.id; // Return existing author ID
      }

      // Create a new author if not found
      const newAuthorResponse = await axios.post(
        "http://localhost:8080/author/create",
        { firstName, lastName },
        { headers: { "Content-Type": "application/json" } }
      );

      return newAuthorResponse.data.id; // Return new author ID
    } catch (error) {
      console.error("Error checking/creating author:", error);
      return null;
    }
  };

  // **Add book to database and associate it with the author**
  const confirmAddBook = async () => {
    if (!selectedBook?.volumeInfo) return;
    if (
      bookDetails.price === "" ||
      bookDetails.count === "" ||
      bookDetails.numCheckedOut === ""
    ) {
      alert("Please fill in all fields before adding the book.");
      return;
    }

    // Extract author info from Google Books API
    const authors = selectedBook.volumeInfo.authors || ["Unknown Author"];

    try {
      const authorIds = [];

      // Loop through all authors and check/create them in the database
      for (const authorFullName of authors) {
        const [firstName, ...lastNameParts] = authorFullName.split(" ");
        const lastName = lastNameParts.join(" ") || "Unknown";

        const authorId = await getOrCreateAuthor(firstName, lastName);
        if (authorId) {
          authorIds.push(authorId);
        }
      }

      // Prepare book data
      const bookData = {
        isbn:
          selectedBook.volumeInfo.industryIdentifiers?.[0]?.identifier ||
          "Unknown",
        title: selectedBook.volumeInfo.title,
        summary:
          selectedBook.volumeInfo.description || "No description available",
        publicationDate:
          selectedBook.volumeInfo.publishedDate ||
          "2024-05-02T00:00:00.000+00:00",
        publisher: selectedBook.volumeInfo.publisher || "Unknown Publisher",
        price: bookDetails.price,
        purchasable: bookDetails.purchasable,
        count: bookDetails.count,
        numCheckedOut: bookDetails.numCheckedOut,
      };

      // Add book to database
      const bookResponse = await axios.post(
        "http://localhost:8080/book/create",
        bookData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (bookResponse.status === 200) {
        const bookId = bookResponse.data.id;

        // Link book to author
        for (const authorId of authorIds) {
          await axios.post(
            "http://localhost:8080/bookauthor/create",
            { authorId, bookId },
            { headers: { "Content-Type": "application/json" } }
          );
        }

        alert("Book and author linked successfully!");
        setSelectedBook(null);
      }
    } catch (error) {
      console.error("Error adding book and linking author:", error);
      alert("Failed to add book.");
    }
  };

  return (
    <div className="book-inventory-container">
      <header className="page-header">
        <h1>Admin Inventory</h1>
      </header>

      <div className="main-content">
        <div className="search-bar">
          <h2>Search Books</h2>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={searchBooks}>Search</button>
          <button
            onClick={() => navigate("/admin/manual-add")}
            className="manual-add-button"
          >
            Manual Add
          </button>
        </div>

        <div className="book-results">
          <h3>Search Results</h3>
          {searchResults.map((book) => {
            if (!book.volumeInfo) return null;

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
            <label className="purchasable-group">
              <input
                type="checkbox"
                name="purchasable"
                checked={bookDetails.purchasable}
                onChange={handleBookDetailChange}
              />
              Purchasable
            </label>
            <button onClick={confirmAddBook}>Confirm Add</button>
            <button onClick={() => setSelectedBook(null)}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventory;
