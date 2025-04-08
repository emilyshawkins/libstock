import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";
import "./UserBookDetails.css";
import {
  renderCheckoutButton,
  handlePayment,
} from "../UserHomePage/UserHomePage";

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState("Unknown Author");
  const [genres, setGenres] = useState("Unknown Genre");
  const [favoriteBooks, setFavoriteBooks] = useState(new Set());
  const [wishlist, setWishlist] = useState(new Set());
  const [userCheckouts, setUserCheckouts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showIframe, setShowIframe] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const userId = localStorage.getItem("userId") || "";

  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get("id");

  useEffect(() => {
    if (!bookId) return;

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [bookRes, authorRes, genreRes] = await Promise.all([
          axios.get(`http://localhost:8080/book/read?id=${bookId}`),
          axios.get(
            `http://localhost:8080/bookauthor/get_authors_by_book?bookId=${bookId}`
          ),
          axios.get(
            `http://localhost:8080/bookgenre/get_genres_by_book?bookId=${bookId}`
          ),
        ]);

        setBook(bookRes.data);
        setAuthor(
          authorRes.data.length > 0
            ? authorRes.data
                .map((a) => `${a.firstName} ${a.lastName}`)
                .join(", ")
            : "Unknown Author"
        );
        setGenres(
          genreRes.data.length > 0
            ? genreRes.data.map((g) => g.name).join(", ")
            : "Unknown Genre"
        );

        await Promise.all([
          fetchUserFavorites(),
          fetchUserWishlist(),
          fetchUserCheckouts(),
        ]);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to load book details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserCheckouts();
    fetchBookDetails();
  }, [bookId]);

  const fetchUserFavorites = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(
        `http://localhost:8080/favorite/get_favorites_by_user?userId=${userId}`
      );
      setFavoriteBooks(new Set(response.data.map((book) => book.id)));
    } catch (error) {
      console.error("Error fetching favorite books:", error);
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

  // Toggle iframe visibility
  const toggleIframe = () => {
    setShowIframe(!showIframe);
  };

  // Handle checkout
  const handleCheckout = async (bookId) => {
    try {
      const timeOffsetNow = new Date().getTimezoneOffset() / 60;

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
        "Renew success! You have until " + readable + " to return the book."
      );
    } catch (error) {
      console.error("Error renewing book:", error);
      alert("Error renewing book. Please try again.");
    }
  };

  const fetchUserWishlist = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(
        `http://localhost:8080/wishlist/get_wishlist_by_user?userId=${userId}`
      );
      setWishlist(new Set(response.data.map((book) => book.id)));
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const handleFavoriteToggle = async () => {
    if (!userId) return;

    try {
      if (favoriteBooks.has(bookId)) {
        await axios.delete(`http://localhost:8080/favorite/delete`, {
          params: { userId, bookId },
        });
        setFavoriteBooks((prev) => {
          const updatedFavorites = new Set(prev);
          updatedFavorites.delete(bookId);
          return new Set(updatedFavorites);
        });
      } else {
        await axios.post(
          `http://localhost:8080/favorite/create?userId=${userId}&bookId=${bookId}`
        );
        setFavoriteBooks((prev) => new Set([...prev, bookId]));
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!userId) return;

    try {
      if (wishlist.has(bookId)) {
        await axios.delete(`http://localhost:8080/wishlist/delete`, {
          params: { userId, bookId },
        });
        setWishlist((prev) => {
          const updatedWishlist = new Set(prev);
          updatedWishlist.delete(bookId);
          return new Set(updatedWishlist);
        });
      } else {
        await axios.post(
          `http://localhost:8080/wishlist/create?userId=${userId}&bookId=${bookId}`
        );
        setWishlist((prev) => new Set([...prev, bookId]));
        alert("Added to Wishlist!");
      }
    } catch (error) {
      console.error("Error updating wishlist status:", error);
    }
  };

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="UserBook-details-container">
      {/* Favorite Icon */}
      <span className="favorite-icon" onClick={handleFavoriteToggle}>
        {favoriteBooks.has(book.id) ? (
          <FavoriteIcon
            style={{
              cursor: "pointer",
              color: "red",
              fontSize: "24px",
              marginLeft: "580px",
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
      <h1>{book.title}</h1>
      <p>
        <strong>ISBN:</strong> {book.isbn}
      </p>
      <p>
        <strong>Summary:</strong> {book.summary}
      </p>
      <p>
        <strong>Author(s):</strong> {author}
      </p>
      <p>
        <strong>Genres:</strong> {genres}
      </p>
      <p>
        <strong>Publication Date:</strong> {book.publicationDate}
      </p>
      <p>
        <strong>Price:</strong> ${book.price.toFixed(2)}
      </p>
      <p>
        <strong>Purchasable:</strong> {book.purchasable ? "Yes" : "No"}
      </p>
      <p>
        <strong>Count:</strong> {book.count}
      </p>
      <p>
        <strong>Checked Out:</strong> {book.numCheckedOut}
      </p>

      {/* BooksPrice.com iframe */}
      <div className="books-price-iframe-container">
        <h3>Compare Prices on BooksPrice.com</h3>
        <button onClick={toggleIframe} className="toggle-iframe-btn">
          {showIframe ? "Hide Price Comparison" : "Show Price Comparison"}
        </button>

        {showIframe && (
          <div className="iframe-wrapper">
            <iframe
              src={`https://www.booksprice.com/comparePrice.do?l=y&searchType=compare&inputData=${book.isbn}`}
              title="BooksPrice.com Price Comparison"
              className="books-price-iframe"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        )}
      </div>

      {/* Wishlist Button */}
      <button onClick={handleWishlistToggle}>
        {wishlist.has(book.id) ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>
      {renderCheckoutButton(
        book.id,
        userCheckouts,
        handleReturn,
        handleRenew,
        handleCheckout
      )}
      <button className="payment-btn" onClick={() => handlePayment(book)}>
        Buy This Book
      </button>
    </div>
  );
};

export default BookDetails;
