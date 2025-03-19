/* src/UserHomePage/UserHomePage.js */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const [bookGenres, setBookGenres] = useState({});

  // State for user checkouts
  const [userCheckouts, setUserCheckouts] = useState(new Set());

  // State for filtered books (for search functionality)
  const [filteredBooks, setFilteredBooks] = useState([]);

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");
  // State for storing book quantities
  const [bookQuantities, setBookQuantities] = useState({});
  // State for add/remove favorite items
  const [favoriteBooks, setFavoriteBooks] = useState(new Set());
  const [userId] = useState(localStorage.getItem("userId") || "");
  const [wishlist, setWishlist] = useState(new Set());
  const navigate = useNavigate(); // Initialize navigate function
  const handleBookClick = (bookId) => {
    navigate(`/user/home/book?id=${bookId}`); // Navigate to book details page
  };

  // Fetch books and authors when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const books = await fetchBooks(); // Wait for books to load
      fetchBookAuthors(books); // Fetch authors only after books are available
      fetchBookGenres(books);
      fetchUserFavorites();
      fetchUserWishlist();
      fetchUserCheckouts();
    };
    fetchData();
  }, []);

  // Fetch all books from the database
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/book/get_all");
      setDatabaseBooks(response.data);
      setFilteredBooks(response.data);

      // Call fetchBookAuthors after books are loaded
      fetchBookAuthors(response.data);
      fetchBookGenres(response.data);
      fetchUserFavorites();
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  // Fetch book-author relationships and store them
  const fetchBookAuthors = async (books) => {
    if (!books || books.length === 0) return; // Prevent API call if no books exist

    try {
      const bookAuthorsMap = {}; // Store authors for each book

      for (const book of books) {
        try {
          // Fetch authors for the given book ID
          const authorResponse = await axios.get(
            `http://localhost:8080/bookauthor/get_authors_by_book?bookId=${book.id}`
          );

          if (authorResponse.data.length > 0) {
            const authorNames = authorResponse.data.map(
              (author) => `${author.firstName} ${author.lastName}`
            );
            bookAuthorsMap[book.id] = authorNames;
          } else {
            bookAuthorsMap[book.id] = ["Unknown Author"];
          }
        } catch (error) {
          console.error(`Error fetching authors for book ${book.id}:`, error);
          bookAuthorsMap[book.id] = ["Unknown Author"];
        }
      }

      setBookAuthors(bookAuthorsMap); // Update state with book-author mapping
    } catch (error) {
      console.error("Error fetching book authors:", error);
    }
  };

  const fetchBookGenres = async (books) => {
    if (!books || books.length === 0) return;

    try {
      const bookGenresMap = {};

      for (const book of books) {
        try {
          const genreResponse = await axios.get(
            `http://localhost:8080/bookgenre/get_genres_by_book?bookId=${book.id}`
          );

          if (genreResponse.data.length > 0) {
            const genreNames = genreResponse.data.map((genre) => genre.name);
            bookGenresMap[book.id] = genreNames;
          } else {
            bookGenresMap[book.id] = ["Unknown Genre"];
          }
        } catch (error) {
          console.error(`Error fetching genres for book ${book.id}:`, error);
          bookGenresMap[book.id] = ["Unknown Genre"];
        }
      }

      setBookGenres(bookGenresMap);
    } catch (error) {
      console.error("Error fetching book genres:", error);
    }
  };

  //Favorite Handle
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

  //Wishlist Handle
  const fetchUserWishlist = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/wishlist/get_wishlist_by_user?userId=${userId}`
      );
      const wishlistIds = new Set(response.data.map((book) => book.id));
      setWishlist(wishlistIds);
    } catch (error) {
      console.error("Error fetching Wishlist:", error);
    }
  };

  const handleWishlistToggle = async (bookId) => {
    try {
      if (wishlist.has(bookId)) {
        await axios.delete(
          `http://localhost:8080/wishlist/delete?userId=${userId}&bookId=${bookId}`
        );
        setWishlist((prev) => {
          const updatedWishlist = new Set(prev);
          updatedWishlist.delete(bookId);
          return updatedWishlist;
        });
      } else {
        await axios.post(
          "http://localhost:8080/wishlist/create",
          { userId, bookId },
          { headers: { "Content-Type": "application/json" } }
        );
        setWishlist((prev) => new Set(prev).add(bookId));
      }
    } catch (error) {
      console.error("Error updating wishlist status:", error);
    }
  };

  // Fetch user checkouts
  const fetchUserCheckouts = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/checkout/get_all_checked_out?userId=${userId}`
      );
      const userCheckouts = new Set(
        response.data.map((checkout) => checkout.bookId)
      );
      setUserCheckouts(userCheckouts);
    } catch (error) {
      console.error("Error fetching Wishlist:", error);
    }
  };

  // Handle checkout
  const handleCheckout = async (bookId) => {
    try {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14); // Due in 14 days
      const timeOffsetNow = dueDate.getTimezoneOffset() / 60;

      const response = await axios.post(
        `http://localhost:8080/checkout/create?offset=${timeOffsetNow}`,
        { userId, bookId }
      );

      const readable = new Date(response.data.dueDate * 1000).toLocaleString();
      setUserCheckouts((prev) => new Set(prev).add(bookId));
      alert(
        "Checkout success! You have until " + readable + " to return the book."
      );
    } catch (error) {
      console.error("Error checking out book:", error);
      alert("Error checking out book. Please try again.");
    }
  };

  // Handle return
  const handleReturn = async (bookId) => {
    try {
      await axios.get("http://localhost:8080/checkout/return", {
        params: { userId, bookId },
      });
      setUserCheckouts((prev) => {
        const updatedCheckouts = new Set(prev);
        updatedCheckouts.delete(bookId);
        return updatedCheckouts;
      });
      alert("Return success!");
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Error returning book. Please try again.");
    }
  };

  // Handle renew
  const handleRenew = async (bookId) => {
    try {
      const response = await axios.get("http://localhost:8080/checkout/renew", {
        params: { userId, bookId },
      });
      const readable = new Date(response.data.dueDate).toLocaleString();
      alert(
        "Renew success! You have until " + readable + " to return the book."
      );
    } catch (error) {
      console.error("Error renewing book:", error);
      alert("Error renewing book. Please try again.");
    }
  };

  const renderCheckoutButton = (bookId) => {
    if (userCheckouts.has(bookId)) {
      return (
        <>
          <button
            onClick={(e) => {
              handleReturn(bookId);
              e.stopPropagation();
            }}
          >
            Return
          </button>
          <button
            onClick={(e) => {
              handleRenew(bookId);
              e.stopPropagation();
            }}
          >
            Renew
          </button>
          <br></br>
        </>
      );
    } else {
      return (
        <>
          <button
            onClick={(e) => {
              handleCheckout(bookId);
              e.stopPropagation();
            }}
          >
            Checkout
          </button>
          <br></br>
        </>
      );
    }
  };

  // Handle search input and filter books
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter books that match the search query
    const filtered = databaseBooks.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        (bookAuthors[book.id] &&
          bookAuthors[book.id].join(", ").toLowerCase().includes(query)) ||
        (bookGenres[book.id] &&
          bookGenres[book.id].join(", ").toLowerCase().includes(query))
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
  const handlePayment = async (book) => {
    try {
      const quantity = bookQuantities[book.id] || 1;
      const createPaymentRequest = {
        bookId: book.id,
        name: book.title,
        amount: book.price * 100, // Convert to dollars
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
                      <div
                        key={book.id}
                        className="book-card"
                        onClick={() => handleBookClick(book.id)} // Add click event
                        style={{ cursor: "pointer" }}
                      >
                        {/* Title & Favorite Toggle in the Same Row */}
                        <div className="book-title-container">
                          <h3 className="book-title">{book.title}</h3>

                          {/* Favorite icon with toggle functionality */}
                          <span
                            className="favorite-icon"
                            onClick={(e) => {
                              handleFavoriteToggle(book.id);
                              e.stopPropagation();
                            }}
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
                          <strong>ISBN:</strong> {book.isbn}
                        </p>
                        <p>
                          <strong>Author:</strong>{" "}
                          {bookAuthors[book.id]
                            ? bookAuthors[book.id].join(", ")
                            : "Unknown Author"}
                        </p>
                        <p>
                          <strong>Genre:</strong>{" "}
                          {bookGenres[book.id]
                            ? bookGenres[book.id].join(", ")
                            : "Unknown Genre"}
                        </p>
                        <p>
                          <strong>Publication Date:</strong>{" "}
                          {book.publicationDate}
                        </p>
                        {renderCheckoutButton(book.id)}
                        {/* Wishlist with toggle functionality */}
                        <button
                          className="wishlist-button"
                          onClick={(e) => {
                            handleWishlistToggle(book.id);
                            e.stopPropagation();
                          }}
                        >
                          {wishlist.has(book.id)
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"}
                        </button>
                        <p>
                          <strong>Price:</strong> ${book.price.toFixed(2)}
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
                          onClick={() => handlePayment(book)}
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
