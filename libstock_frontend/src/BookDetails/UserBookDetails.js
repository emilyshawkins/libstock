import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { renderCheckoutButton } from "../UserHomePage/UserHomePage";
import { loadStripe } from "@stripe/stripe-js";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
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

    const userId = localStorage.getItem("userId") || "";

    const response = await fetch(`http://localhost:8080/product/v1/checkout?userId=${userId}`, {
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
  const [userRating, setUserRating] = useState(null);
  const [userCheckouts, setUserCheckouts] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showIframe, setShowIframe] = useState(false);
  const location = useLocation();
  const userId = localStorage.getItem("userId") || "";
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get("id");
  const [userQueue, setUserQueue] = useState([]);
  const [userInfo, setUserInfo] = useState({ firstName: "", lastName: ""});
  const [hoverRating, setHoverRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [starFilter, setStarFilter] = useState('all'); // 'all' or 1-5
  const [isUserRated, setIsUserRated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!bookId) return;
    
    // Get book data from navigation state if available
    const bookFromState = location.state?.book;
    const authorFromState = location.state?.author;
    const genreFromState = location.state?.genre;
    const isFavoriteFromState = location.state?.isFavorite;
    const isInWishlistFromState = location.state?.isInWishlist;
    
    if (bookFromState) {
      setBook(bookFromState);
    }
    if (authorFromState) {
      setAuthor(authorFromState);
    }
    if (genreFromState) {
      setGenres(genreFromState);
    }
    if (isFavoriteFromState !== undefined) {
      setFavoriteBooks(prev => {
        const newFavorites = new Set(prev);
        if (isFavoriteFromState) {
          newFavorites.add(bookId);
        } else {
          newFavorites.delete(bookId);
        }
        return newFavorites;
      });
    }
    if (isInWishlistFromState !== undefined) {
      setWishlist(prev => {
        const newWishlist = new Set(prev);
        if (isInWishlistFromState) {
          newWishlist.add(bookId);
        } else {
          newWishlist.delete(bookId);
        }
        return newWishlist;
      });
    }
    
    async function fetchUserData() {
      try {
          const userId = localStorage.getItem("userId");
          if (!userId) return;

          const response = await axios.get(`http://localhost:8080/user/get?id=${userId}`);
          if (response.data) {
              setUserInfo({
                  firstName: response.data.firstName || "Unknown",
                  lastName: response.data.lastName || "",
              });
          }
      } catch (error) {
          console.error("Error fetching user data:", error);
      }
    }

    const fetchAdditionalDetails = async () => {
      try {
        setLoading(true);
        setError("");
        const [ratingRes, userRatingRes] = await Promise.all([
          axios.get(`http://localhost:8080/rating/get_ratings_by_book?bookId=${bookId}`),
          axios.get(`http://localhost:8080/rating/get_ratings_by_user?userId=${userId}`)
        ]);

        // Fetch user details for each rating
        const ratingsWithUserDetails = await Promise.all(
          ratingRes.data.map(async (rating) => {
            try {
              const userResponse = await axios.get(`http://localhost:8080/user/get?id=${rating.userId}`);
              return {
                ...rating,
                firstName: userResponse.data.firstName || 'Unknown',
                lastName: userResponse.data.lastName || ''
              };
            } catch (error) {
              console.error(`Error fetching user details for rating ${rating.id}:`, error);
              return {
                ...rating,
                firstName: 'Unknown',
                lastName: ''
              };
            }
          })
        );

        setRatings(ratingsWithUserDetails || []);
        // Calculate average rating
        if (ratingsWithUserDetails && ratingsWithUserDetails.length > 0) {
          const total = ratingsWithUserDetails.reduce((sum, rating) => sum + rating.stars, 0);
          setAverageRating(total / ratingsWithUserDetails.length);
        }
        // Find if user has already rated this book
        const existingRating = userRatingRes.data.find(rating => rating.bookId === bookId);
        setUserRating(existingRating || null);
        setIsUserRated(!!existingRating);

        // If user has an existing rating, load it into the form
        if (existingRating) {
          setNewRating({
            rating: existingRating.stars,
            comment: existingRating.comment
          });
        }

        await Promise.all([
          fetchUserData(),
          fetchUserCheckouts(),
          fetchUserQueue(),
        ]);
      } catch (error) {
        console.error("Error fetching book details:", error);
        setError("Failed to load book details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch Book, if we don't have book data from state
    if (!bookFromState) {
      axios.get(`http://localhost:8080/book/read?id=${bookId}`)
        .then(response => {
          setBook(response.data);
          // Fetch If we don't have author/genre from state
          if (!authorFromState || !genreFromState) {
            Promise.all([
              axios.get(`http://localhost:8080/bookauthor/get_authors_by_book?bookId=${bookId}`),
              axios.get(`http://localhost:8080/bookgenre/get_genres_by_book?bookId=${bookId}`)
            ]).then(([authorRes, genreRes]) => {
              setAuthor(
                authorRes.data.length > 0
                  ? authorRes.data.map(a => `${a.firstName} ${a.lastName}`).join(", ")
                  : "Unknown Author"
              );
              setGenres(
                genreRes.data.length > 0
                  ? genreRes.data.map(g => g.name).join(", ")
                  : "Unknown Genre"
              );
              fetchAdditionalDetails();
            });
          } else {
            fetchAdditionalDetails();
          }
        })
        .catch(error => {
          console.error("Error fetching book:", error);
          setError("Failed to load book. Please try again.");
          setLoading(false);
        });
    } else {
      fetchAdditionalDetails();
    }
  }, [bookId, location.state]);

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
      const response = await axios.get(`http://localhost:8080/queue/get_waiting?userId=${userId}`);
      setUserQueue(response.data);
    } catch (error) {
      console.error("Error fetching user queue:", error);
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
      const readable = new Date(response.data.dueDate * 1000).toLocaleString();
      alert(
        "Renew success! You have until " + readable + " to return the book."
      );
    } catch (error) {
      console.error("Error renewing book:", error);
      alert("Error renewing book. Please try again.");
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

  const handleStarClick = (rating) => {
    setNewRating({ ...newRating, rating });
  };

  const handleStarHover = (rating) => {
    setHoverRating(rating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date().toISOString();

      if (isUserRated) {
        // Update existing rating
        const response = await axios.patch("http://localhost:8080/rating/update", {
          id: userRating.id,
          stars: newRating.rating,
          comment: newRating.comment,
          date: currentDate
        });
        
        setRatings(prev => prev.map(r => r.id === userRating.id ? {
          ...response.data,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          dateCreated: currentDate
        } : r));
        
        setUserRating(response.data);
        alert("Your review has been updated!");
      } else {
        // Create new rating
        const response = await axios.post("http://localhost:8080/rating/create", {
          userId,
          bookId,
          stars: newRating.rating,
          comment: newRating.comment,
          date: currentDate
        });
        
        const ratingWithUserInfo = {
          ...response.data,
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          dateCreated: currentDate
        };
        
        setRatings(prev => [...prev, ratingWithUserInfo]);
        setUserRating(response.data);
        setIsUserRated(true);
        alert("Your review has been submitted!");
      }
      setNewRating({ rating: 5, comment: "" });
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("Failed to submit rating. Please try again.");
    }
  };

  // Handle queue
  const handleQueue = async (bookId) => {
    try {
      if (userQueue.find((queue) => queue.bookId === bookId)) {
        await axios.delete(`http://localhost:8080/queue/delete`, {
          params: { userId, bookId },
        });
        setUserQueue((prev) => prev.filter((queue) => queue.bookId !== bookId));
        alert("Left queue successfully!");
      } else {
        const response = await axios.post(`http://localhost:8080/queue/create`, {
          userId,
          bookId,
        });
        setUserQueue((prev) => [...prev, response.data]);
        alert("Joined queue successfully!");
      }
    } catch (error) {
      console.error("Error updating queue status:", error);
      alert("Error updating queue status. Please try again.");
    }
  };

  // Modify the getFilteredRatings function to prioritize user's review
  const getFilteredRatings = () => {
    // First filter by stars
    const filtered = starFilter === 'all' 
      ? ratings 
      : ratings.filter(r => r.stars === parseInt(starFilter));
      
    // Sort reviews: user's review first, then by date
    return filtered.sort((a, b) => {
      // If one is user's review, it goes first
      if (a.userId === userId && b.userId !== userId) return -1;
      if (a.userId !== userId && b.userId === userId) return 1;
      
      // Otherwise sort by date
      const dateA = new Date(a.dateCreated);
      const dateB = new Date(b.dateCreated);
      return dateB - dateA;
    });
  };

  // Add handleDeleteReview function
  const handleDeleteReview = async (ratingId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      try {
        await axios.delete(`http://localhost:8080/rating/delete?id=${ratingId}`);
        setRatings(prev => prev.filter(r => r.id !== ratingId));
        setUserRating(null);
        setIsUserRated(false);
        setNewRating({ rating: 5, comment: "" });
        alert("Your review has been deleted successfully!");
      } catch (err) {
        console.error("Error deleting rating:", err);
        alert("Failed to delete review. Please try again.");
      }
    }
  };

  // Add function to handle edit mode
  const handleEditClick = (review) => {
    setIsEditing(true);
    setNewRating({
      rating: review.stars,
      comment: review.comment
    });
    // Scroll to the edit form
    window.scrollTo({
      top: document.querySelector('.rating-form').offsetTop - 100,
      behavior: 'smooth'
    });
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
      <div className="book-rating-summary">
        <div className="average-rating">
          <div className="star-rating-display">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star}>
                {star <= Math.round(averageRating) ? (
                  <StarIcon style={{ color: "#FFD700" }} />
                ) : (
                  <StarBorderIcon style={{ color: "#FFD700" }} />
                )}
              </span>
            ))}
          </div>
          <div className="rating-details">
            <span className="rating-value">{averageRating.toFixed(1)}</span>
            <span className="rating-count">({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})</span>
          </div>
        </div>
      </div>
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

      {book.addedData && Object.entries(book.addedData).length > 0 ? (
        Object.entries(book.addedData).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {value}
          </p>
        ))
      ) : (
        <p>No additional data available.</p>
      )}

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
          userQueue,
          handleReturn,
          handleRenew,
          handleCheckout,
          handleQueue,
          [book]
        )}
        <button className="payment-btn" onClick={() => handlePayment(book)}>
          Buy This Book
        </button>
      </div>
      <div className="rating-section">
        <h3>Book Reviews</h3>
        
        {/* Add/Edit Review Form First */}
        <div className="rating-form-container">
          <h4>{isEditing ? 'Edit Your Review' : 'Add a Review'}</h4>
          <form onSubmit={handleRatingSubmit} className="rating-form">
            <p><strong>{`${userInfo.firstName} ${userInfo.lastName}`}</strong></p>
            <div className="star-rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  style={{ cursor: "pointer" }}
                >
                  {star <= (hoverRating || newRating.rating) ? (
                    <StarIcon style={{ color: "#FFD700", fontSize: "2rem" }} />
                  ) : (
                    <StarBorderIcon style={{ color: "#FFD700", fontSize: "2rem" }} />
                  )}
                </span>
              ))}
            </div>
            <textarea 
              placeholder="Your review" 
              value={newRating.comment} 
              onChange={e => setNewRating({ ...newRating, comment: e.target.value })} 
              required 
            />
            <div className="form-buttons">
              <button type="submit" className="submit-review-btn">
                {isEditing ? 'Update Review' : 'Submit Review'}
              </button>
              {isEditing && (
                <button 
                  type="button" 
                  className="cancel-edit-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setNewRating({ rating: 5, comment: "" });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Review List Section */}
        <div className="reviews-list">
          <h4>Recent Reviews</h4>
          <div className="rating-filter">
            <select 
              value={starFilter} 
              onChange={(e) => setStarFilter(e.target.value)}
              className="star-filter"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>

          {getFilteredRatings().length === 0 ? (
            <p>{starFilter === 'all' ? "No reviews yet." : `No ${starFilter}-star reviews yet.`}</p>
          ) : (
            <>
              {getFilteredRatings().map((r) => (
                <div 
                  key={r.id} 
                  className={`rating-card ${r.userId === userId ? 'user-rating-card' : ''}`}
                >
                  <div className="rating-header">
                    <div className="star-rating-display">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star}>
                          {star <= r.stars ? (
                            <StarIcon style={{ color: "#FFD700" }} />
                          ) : (
                            <StarBorderIcon style={{ color: "#FFD700" }} />
                          )}
                        </span>
                      ))}
                    </div>
                    <div className="reviewer-info">
                      <p>
                        <strong>{`${r.firstName} ${r.lastName}`}</strong>
                        {r.userId === userId && <span className="your-review-badge">Your Review</span>}
                      </p>
                      <p className="rating-date">
                        {r.dateCreated ? new Date(r.dateCreated * 1000).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'No date'}
                      </p>
                    </div>
                    {r.userId === userId && (
                      <div className="review-actions-small">
                        <button 
                          className="edit-review-btn-small"
                          onClick={() => handleEditClick(r)}
                          title="Edit your review"
                        >
                          <span role="img" aria-label="edit">✏️</span>
                        </button>
                        <button 
                          className="delete-review-btn-small"
                          onClick={() => handleDeleteReview(r.id)}
                          title="Delete your review"
                        >
                          <span role="img" aria-label="delete">🗑️</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
