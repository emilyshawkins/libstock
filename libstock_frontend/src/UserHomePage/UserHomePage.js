/* src/UserHomePage/UserHomePage.js */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { data, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { loadStripe } from "@stripe/stripe-js";
import "./UserHomePage.css";
import defaultBookCover from "../Image/book.png";

// Load Stripe instance
const stripePromise = loadStripe(
  "pk_test_51Qx1ss2eFvgnA4OILQbHkVQ4zM98oi6lvJoXZ1p3Cs5zqSGhjRPA6KOKUljpwaMCAjDoM5fZZtdFJG3oQklL9j6Y00DlqGvgJa"
);

// Function to render checkout buttons
export const renderCheckoutButton = (
  bookId,
  userCheckouts,
  userQueue,
  handleReturn,
  handleRenew,
  handleCheckout,
  handleQueue,
  databaseBooks
) => {
  const book = databaseBooks.find((book) => book.id === bookId);
  if (userCheckouts.has(bookId)) {
    return (
      <>
        <br></br>
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
        <br />
      </>
    );
  } else if (userQueue.find((queue) => queue.bookId === bookId)) {
    return (
      <>
        <br></br>
        <p>
          Position in Queue:{" "}
          {userQueue.find((queue) => queue.bookId === bookId).position}
        </p>
        <button
          onClick={(e) => {
            handleQueue(bookId);
            e.stopPropagation();
          }}
        >
          Leave Queue
        </button>
        <br />
      </>
    );
  } else if (book && book.count === book.numCheckedOut) {
    return (
      <>
        <br></br>
        <button
          onClick={(e) => {
            handleQueue(bookId);
            e.stopPropagation();
          }}
        >
          Join Queue
        </button>
        <br />
      </>
    );
  } else {
    return (
      <>
        <br></br>
        <button
          onClick={(e) => {
            handleCheckout(bookId);
            e.stopPropagation();
          }}
        >
          Checkout
        </button>
        <br />
      </>
    );
  }
};

const UserHomePage = () => {
  // State for storing books from the database
  const [databaseBooks, setDatabaseBooks] = useState([]);
  const [bookCovers, setBookCovers] = useState({});

  // State for storing authors linked to books
  const [bookAuthors, setBookAuthors] = useState({});
  const [bookGenres, setBookGenres] = useState({});

  // State for user checkouts
  const [userCheckouts, setUserCheckouts] = useState(new Set());

  // State for user checkouts in queue
  const [userQueue, setUserQueue] = useState([]);

  // State for filtered books (for search functionality)
  const [filteredBooks, setFilteredBooks] = useState([]);

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");
  // State for add/remove favorite items
  const [favoriteBooks, setFavoriteBooks] = useState(new Set());
  const [userId] = useState(localStorage.getItem("userId") || "");
  const [wishlist, setWishlist] = useState(new Set());
  const navigate = useNavigate(); // Initialize navigate function
  const handleBookClick = (bookId) => {
    const book = databaseBooks.find((book) => book.id === bookId);
    const author = bookAuthors[bookId]
      ? bookAuthors[bookId].join(", ")
      : "Unknown Author";
    const genre = bookGenres[bookId]
      ? bookGenres[bookId].join(", ")
      : "Unknown Genre";
    const isFavorite = favoriteBooks.has(bookId);
    const isInWishlist = wishlist.has(bookId);
    navigate(`/user/home/book?id=${bookId}`, {
      state: {
        book,
        author,
        genre,
        isFavorite,
        isInWishlist,
      },
    });
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
      fetchUserQueue();
      fetchBookCovers(books);
    };
    fetchData();
  }, []);

  const fetchBookCovers = async (books) => {
    if (!books || books.length === 0) return;

    try {
      const bookCoversMap = {};

      for (const book of books) {
        try {
          const coverResponse = await axios.get(
            `http://localhost:8080/book/get_cover?id=${book.id}`,
            { responseType: "text" } // Get as text since it's base64
          );

          if (coverResponse.data && coverResponse.data.length > 0) {
            // Create data URL from base64 string
            bookCoversMap[
              book.id
            ] = `data:image/jpeg;base64,${coverResponse.data}`;
          } else {
            bookCoversMap[book.id] = defaultBookCover;
          }
        } catch (error) {
          console.error(`Error fetching cover for book ${book.id}:`, error);
          bookCoversMap[book.id] = defaultBookCover;
        }
      }

      setBookCovers(bookCoversMap);
    } catch (error) {
      console.error("Error fetching book covers:", error);
    }
  };

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
        await axios.delete(
          `http://localhost:8080/favorite/delete?userId=${userId}&bookId=${bookId}`
        );
        setFavoriteBooks((prev) => {
          const updatedFavorites = new Set(prev);
          updatedFavorites.delete(bookId);
          return updatedFavorites;
        });
      } else {
        // Add to favorites
        await axios.post(
          `http://localhost:8080/favorite/create?userId=${userId}&bookId=${bookId}`
        );
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
          `http://localhost:8080/wishlist/create?userId=${userId}&bookId=${bookId}`
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

  // Fetch user queue
  const fetchUserQueue = async () => {
    if (!userId) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/queue/get_waiting?userId=${userId}`
      );
      setUserQueue(response.data);
    } catch (error) {
      console.error("Error fetching user queue:", error);
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

      const readable = new Date(response.data.dueDate).toLocaleString();
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
        "Renew success! You have until " + response.data.dueDate + " to return the book."
      );
    } catch (error) {
      console.error("Error renewing book:", error);
      alert("Error renewing book. Please try again.");
    }
  };

  // Handle queuing
  const handleQueue = async (bookId) => {
    try {
      if (userQueue.find((queue) => queue.bookId === bookId)) {
        await axios.delete(
          `http://localhost:8080/queue/delete?userId=${userId}&bookId=${bookId}`
        );
        setUserQueue((prev) => {
          const updatedQueue = prev.filter((queue) => queue.bookId !== bookId);
          return updatedQueue;
        });
        alert("You have been removed from the queue for this book.");
      } else {
        const response = await axios.post(
          `http://localhost:8080/queue/create?userId=${userId}&bookId=${bookId}`
        );
        setUserQueue((prev) => {
          const updatedQueue = [...prev, response.data];
          return updatedQueue;
        });
        alert("You have been added to the queue for this book.");
      }
    } catch (error) {
      console.error("Queuing Error:", error);
      alert("Queuing Error. Please try again.");
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

  // Organize books alphabetically
  const booksByLetter = filteredBooks.reduce((acc, book) => {
    const firstLetter = book.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(book);
    return acc;
  }, {});

  return (
    <div className="user-home-container">
      <h1>Welcome to Your Dashboard</h1>
      <div className="main-content">
        {/* Search bar for filtering books */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search books by title, author, or genre..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
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
                        <div className="book-cover">
                          <img
                            src={bookCovers[book.id] || defaultBookCover}
                            alt={`Cover for ${book.title}`}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultBookCover;
                            }}
                          />
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
                        <p>
                          <strong>Price:</strong> ${book.price.toFixed(2)}
                        </p>
                        {/* Wishlist with toggle functionality */}
                        <button
                          onClick={(e) => {
                            handleWishlistToggle(book.id);
                            e.stopPropagation();
                          }}
                        >
                          {wishlist.has(book.id)
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"}
                        </button>
                        {renderCheckoutButton(
                          book.id,
                          userCheckouts,
                          userQueue,
                          handleReturn,
                          handleRenew,
                          handleCheckout,
                          handleQueue,
                          databaseBooks
                        )}
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