import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WishListShare.css";

const WishListShare = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedWishlist = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const wishlistId = urlParams.get("id");

        if (!wishlistId) {
          setError("No wishlist ID provided.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/wishlist/share?id=${wishlistId}`
        );

        if (Array.isArray(response.data)) {
          setWishlist(response.data);
        } else {
          console.warn("Expected an array but got:", response.data);
          setWishlist([]);
        }
      } catch (fetchError) {
        console.error("Error fetching shared wishlist:", fetchError);
        setError("Failed to load shared wishlist.");
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

  const booksByLetter = wishlist.reduce((acc, book) => {
    const firstLetter = book.title.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(book);
    return acc;
  }, {});

  return (
    <div className="wishlist-share-container">
      <h1>My Wishlist Books Share</h1>
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
                    <p><strong>Author:</strong> {book.author || "Unknown Author"}</p>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>Publication Date:</strong> {book.publicationDate}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
      ) : (
        <p>No books found in this wishlist.</p>
      )}
    </div>
  );
};

export default WishListShare;
