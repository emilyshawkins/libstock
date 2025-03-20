import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FavPageShare.css";

const FavPageShare = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedFavorites = async () => {
      try {
        // Get userId from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('userId');

        if (!userId) {
          setError("No user ID provided");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8080/favorite/get_favorites_by_user?userId=${userId}`);
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setError("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedFavorites();
  }, []);

  if (loading) {
    return <div className="fav-share-loading">Loading favorites...</div>;
  }

  if (error) {
    return <div className="fav-share-error">{error}</div>;
  }

  return (
    <div className="fav-share-container">
      <h1>Shared Favorites</h1>
      {favorites.length === 0 ? (
        <div className="fav-share-empty">
          <p>No shared favorites found.</p>
        </div>
      ) : (
        <div className="fav-share-grid">
          {favorites.map((book) => (
            <div key={book.id} className="fav-share-card">
              <div className="book-cover">
                {book.cover && (
                  <img 
                    src={`data:image/jpeg;base64,${book.cover}`} 
                    alt={book.title}
                    className="cover-image"
                  />
                )}
              </div>
              <div className="book-info">
                <h2>{book.title}</h2>
                <p className="book-isbn">ISBN: {book.isbn}</p>
                <p className="book-summary">{book.summary}</p>
                <div className="book-details">
                  <p>Publication Date: {book.publicationDate}</p>
                  <p>Price: ${book.price.toFixed(2)}</p>
                  <p>Status: {book.purchasable ? 'Available' : 'Not Available'}</p>
                  <p>Stock: {book.count}</p>
                  <p>Checked Out: {book.numCheckedOut}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavPageShare; 