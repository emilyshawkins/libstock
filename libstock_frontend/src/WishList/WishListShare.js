import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WishListShare.css";

const WishListShare = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    const fetchSharedWishlist = async () => {
      try {
        // Get userId from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');
        if (!userId) {
          setError("No user ID provided");
          setLoading(false);
          return;
        }
        // Parse userInfo if it exists
        if (userId) {
          setUserInfo({
              firstName: userId.firstName || "Unknown",
              lastName: userId.lastName || "",
          });
        }
        const response = await axios.get(`http://localhost:8080/wishlist/get_wishlist_by_user?userId=${userId}`);
        setWishlist(response.data);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setError("Failed to load wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedWishlist();
  }, []);

  if (loading) {
    return <div className="fav-share-loading">Loading wishlist...</div>;
  }

  if (error) {
    return <div className="fav-share-error">{error}</div>;
  }

  // Group books by their first letter
  const booksByLetter = wishlist.reduce((acc, book) => {
    const firstLetter = book.title.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(book);
    return acc;
  }, {});

  return (
    <div className="fav-container"> 
      <h1><strong>{`${userInfo.firstName} ${userInfo.lastName}`}</strong>'s Wishlist</h1>  
      {wishlist.length > 0 ? (
        Object.keys(booksByLetter)
          .sort()
          .map((letter) => (
            <div key={letter} className="book-section">
              <h2 className="section-title">{letter}</h2>
              <div className="book-grid">
                {booksByLetter[letter].map((book) => (
                  <div key={book.id} className="book-card">
                    <div className="book-title-container">
                      <h3 className="book-title">{book.title}</h3>
                    </div>
                    <p>
                      <strong>Author:</strong>{" "}
                      {book.author || "Unknown Author"}
                    </p>
                    <p>
                      <strong>ISBN:</strong> {book.isbn}
                    </p>
                    <p>
                      <strong>Publication Date:</strong> {book.publicationDate}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
      ) : (
        <p>No wishlist books yet.</p>
      )}
    </div>
  );
};

export default WishListShare; 