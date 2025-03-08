import React, { useState, useEffect } from "react";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { loadStripe } from "@stripe/stripe-js";

import "./UserHomePage.css";

// Load Stripe instance
const stripePromise = loadStripe(
  "pk_test_51Qx1ss2eFvgnA4OILQbHkVQ4zM98oi6lvJoXZ1p3Cs5zqSGhjRPA6KOKUljpwaMCAjDoM5fZZtdFJG3oQklL9j6Y00DlqGvgJa"
);

const UserHomePage = () => {
  // State for storing books from the database
  const [databaseBooks, setDatabaseBooks] = useState([]);

  // State for storing authors linked to books
  const [bookAuthors, setBookAuthors] = useState({});

  // State for filtered books (for search functionality)
  const [filteredBooks, setFilteredBooks] = useState([]);

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");

  // State for add/remove favorite items
  const [favoriteBooks, setFavoriteBooks] = useState(new Set());

  // State for storing book quantities
  const [bookQuantities, setBookQuantities] = useState({});

  // Fetch books and authors when the component mounts
  useEffect(() => {
    fetchBooks();
    fetchBookAuthors();
    fetchUserFavorites();
  }, []);

  // Fetch all books from the database
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/book/get_all");
      setDatabaseBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  // Fetch book-author relationships and store them
  const fetchBookAuthors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/bookauthor/read_all"
      );
      const bookAuthorMappings = response.data;

      const authorDetails = {};

      // Fetch each author linked to a book
      for (const mapping of bookAuthorMappings) {
        const authorResponse = await axios.get(
          `http://localhost:8080/author/read?id=${mapping.authorId}`
        );

        if (authorResponse.data) {
          if (!authorDetails[mapping.bookId]) {
            authorDetails[mapping.bookId] = [];
          }
          authorDetails[mapping.bookId].push(
            `${authorResponse.data.firstName} ${authorResponse.data.lastName}`
          );
        }
      }

      setBookAuthors(authorDetails);
    } catch (error) {
      console.error("Error fetching book authors:", error);
    }
  };

  const fetchUserFavorites = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await axios.get(
        `http://localhost:8080/favorite/get_favorites_by_user?userId=${userId}`
      );
      const favoriteId = new Set(response.data.map((book) => book.id));
      setFavoriteBooks(favoriteId);
    } catch (error) {
      console.error("Error fetching favorite books:", error);
    }
  };

  // Toggle favorite book
  const handleFavoriteToggle = async (bookId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      if (favoriteBooks.has(bookId)) {
        await axios.delete(`http://localhost:8080/favorite/delete`, {
          params: { userId, bookId },
        });
        setFavoriteBooks((prev) => {
          const updatedFavorites = new Set(prev);
          updatedFavorites.delete(bookId);
          return updatedFavorites;
        });
      } else {
        // Add to favorites
        await axios.post(`http://localhost:8080/favorite/create`, {
          userId,
          bookId,
        });
        setFavoriteBooks((prev) => {
          const updatedFavorites = new Set(prev);
          updatedFavorites.add(bookId);
          return updatedFavorites;
        });
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  // Handle search input and filter books
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter books that match the search query
    const filtered = databaseBooks.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  // Handle quantity change for book
  const handleQuantityChange = (bookId, amount) => {
    setBookQuantities((prev) => {
      const updatedQuantities = { ...prev };
      const currentQuantity = updatedQuantities[bookId] || 1;
      updatedQuantities[bookId] = Math.max(1, currentQuantity + amount);
      return updatedQuantities;
    });
  };

  // Organize books alphabetically
  const booksByLetter = filteredBooks.reduce((acc, book) => {
    const firstLetter = book.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(book);
    return acc;
  }, {});

  // Handle checkout process
  const handleCheckout = async (book) => {
    try {
      const quantity = bookQuantities[book.id] || 1;
      const createPaymentRequest = {
        bookId: book.id,
        name: book.title,
        amount: book.price, // Price in cents
        quantity: quantity,
      };

      const response = await fetch(
        "http://localhost:8080/product/v1/checkout",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createPaymentRequest),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const stripeResponse = await response.json();
      const stripe = await stripePromise;

      const result = await stripe.redirectToCheckout({
        sessionId: stripeResponse.sessionId,
      });

      if (result.error) {
        console.error("Stripe Checkout Error:", result.error.message);
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="user-home-container">
      <h1>Welcome to Your Dashboard</h1>

      <div className="main-content">
        {/* Search bar for filtering books */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Display books in the database */}
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
                      <div key={book.id} className="book-card">
                        {/* Title & Favorite Toggle in the Same Row */}
                        <div className="book-title-container">
                          <h3 className="book-title">{book.title}</h3>
                          {/* Favorite icon with toggle functionality */}
                          <span
                            className="favorite-icon"
                            onClick={() => handleFavoriteToggle(book.id)}
                          >
                            {favoriteBooks.has(book.id) ? (
                              <FavoriteIcon
                                style={{
                                  cursor: "pointer",
                                  color: "red",
                                  fontSize: "24px",
                                  marginLeft: "-20px",
                                }}
                              />
                            ) : (
                              <FavoriteBorderIcon
                                style={{
                                  cursor: "pointer",
                                  color: "grey",
                                  fontSize: "24px",
                                  marginLeft: "-20px",
                                }}
                              />
                            )}
                          </span>
                        </div>
                        <p>
                          <strong>Author:</strong>{" "}
                          {bookAuthors[book.id]
                            ? bookAuthors[book.id].join(", ")
                            : "Unknown Author"}
                        </p>
                        <p>
                          <strong>ISBN:</strong> {book.isbn}
                        </p>
                        <p>
                          <strong>Publication Date:</strong>{" "}
                          {book.publicationDate}
                        </p>
                        <p>
                          <strong>Price:</strong> $
                          {(book.price / 100).toFixed(2)}
                        </p>
                        <div className="quantity-controls">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleQuantityChange(book.id, -1)}
                          >
                            -
                          </button>
                          <span>{bookQuantities[book.id] || 1}</span>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => handleQuantityChange(book.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <button onClick={() => alert("renew")}>Renew</button>
                        <button onClick={() => alert("return")}>Return</button>
                        <button onClick={() => alert("Edit")}>Edit</button>
                        <button
                          className="btn btn-primary btn-lg w-100 mt-2"
                          onClick={() => handleCheckout(book)}
                        >
                          Pay
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

export default UserHomePage;
