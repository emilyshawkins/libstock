import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { renderCheckoutButton } from "../UserHomePage/UserHomePage";
import { loadStripe } from "@stripe/stripe-js";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";
import "./UserBookDetails.css";


const stripePromise = loadStripe(
  "pk_test_51RBkqmHFDEq2iN7KZotziYZW8TZLyT586iWVyQFwfvNOpAssg7mSOHNUzWbB9Ndsu5Wu6ep2o8HLrE3HdQun2eoT00KmSUzpPl"
);

// Handle checkout process
export const handlePayment = async (book) => {
  try {
    const quantity = 1;
    const createPaymentRequest = {
      bookId: book.id,
      name: book.title,
      amount: book.price * 100, // Convert to dollars
      quantity: quantity,
    };

    const response = await fetch("http://localhost:8080/product/v1/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(createPaymentRequest),
    });

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

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState("Unknown Author");
  const [genres, setGenres] = useState("Unknown Genre");
  const [favoriteBooks, setFavoriteBooks] = useState(new Set());
  const [wishlist, setWishlist] = useState(new Set());
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState({ rating: 5, comment: "" });
  const [userCheckouts, setUserCheckouts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showIframe, setShowIframe] = useState(false);
  const location = useLocation();
  const userId = localStorage.getItem("userId") || "";
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get("id");

  // Load Stripe instance

  useEffect(() => {
    if (!bookId) return;

    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [bookRes, authorRes, genreRes, ratingRes] = await Promise.all([
          axios.get(`http://localhost:8080/book/read?id=${bookId}`),
          axios.get(
            `http://localhost:8080/bookauthor/get_authors_by_book?bookId=${bookId}`
          ),
          axios.get(
            `http://localhost:8080/bookgenre/get_genres_by_book?bookId=${bookId}`
          ),
          axios.get(
            `http://localhost:8080/rating/get_ratings_by_book?bookId=${bookId}`

          ),
        ]);

        setBook(bookRes.data);
        setRatings(ratingRes.data || []);
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

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/rating/create", {
        userId,
        bookId,
        stars: newRating.rating,
        comment: newRating.comment,
      });
      setRatings((prev) => [...prev, res.data]);
      setNewRating({ rating: 5, comment: "" }); 
    } catch (err) {
      console.error("rating submit error:", err);
    }
  };
  

  if (loading) return <p>Loading book details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="UserBook-details-container">
      <div className="favorite-icon-container">
        <span className="favorite-icon" onClick={handleFavoriteToggle}>
          {favoriteBooks.has(book.id) ? (
            <FavoriteIcon
              style={{
                cursor: "pointer",
                color: "red",
                fontSize: "24px",
              }}
            />
          ) : (
            <FavoriteBorderIcon
              style={{
                cursor: "pointer",
                color: "grey",
                fontSize: "24px",
              }}
            />
          )}
        </span>
      </div>
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
          <iframe
            src={`https://www.booksprice.com/comparePrice.do?l=y&searchType=compare&inputData=${book.isbn}`}
            title="BooksPrice.com Price Comparison"
            className="price-comparison-iframe"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        )}
      </div>

      {/* Wishlist Button */}
      <div className="bookdetail-button-container">
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

        <div className="rating-section">
        <h3>Ratings</h3>
        {ratings.length === 0 ? <p>No Ratings yet.</p> : ratings.map((r, i) => (
          <div key={i} className="rating-card">
           <p><strong>{r.userName}</strong> rated {r.stars}/5</p>
           <p>{r.comment}</p>
          </div>
        ))}

        <form onSubmit={handleRatingSubmit} className="rating-form">
          <input type="text" placeholder="Your name" value={newRating.RatingerName} onChange={e => setNewRating({ ...newRating, RatingerName: e.target.value })} required />
          <select value={newRating.rating} onChange={e => setNewRating({ ...newRating, rating: parseInt(e.target.value) })}>
            {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <textarea placeholder="Your rating" value={newRating.comment} onChange={e => setNewRating({ ...newRating, comment: e.target.value })} required />
          <button type="submit">Submit Rating</button>
        </form>
        
      </div>
      </div>
    </div>
  );
};

export default BookDetails;
