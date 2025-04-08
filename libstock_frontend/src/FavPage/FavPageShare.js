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
        const urlParams = new URLSearchParams(window.location.search);
        const favoriteId = urlParams.get("id");

        if (!favoriteId) {
          setError("No favorite ID provided");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:8080/favorite/share?id=${favoriteId}`
        );

        if (Array.isArray(response.data)) {
          setFavorites(response.data);
        } else {
          console.warn("Expected an array but got:", response.data);
          setFavorites([]);
        }
      } catch (fetchError) {
        console.error("Error fetching shared favorites:", fetchError);
        setError("Failed to load shared favorites.");
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

  // Group books by their first letter
  const booksByLetter = favorites.reduce((acc, book) => {
    const firstLetter = book.title.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(book);
    return acc;
  }, {});

  return (
    <div className="fav-container">
      <h1> My Favorite Books Shared</h1>
      {favorites.length > 0 ? (
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
        <p>No favorite books found.</p>
      )}
    </div>
  );
};

export default FavPageShare;
