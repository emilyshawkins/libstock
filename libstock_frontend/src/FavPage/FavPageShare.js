import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FavPageShare.css";

const FavPageShare = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchSharedFavorites = async () => {
      try {
        // Get favoriteId from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const favoriteId = urlParams.get('id');
        
        if (!favoriteId) {
          setError("No favorite ID provided");
          setLoading(false);
          return;
        }

        // Fetch favorites using favoriteId
        const response = await axios.get(`http://localhost:8080/favorite/share?id=${favoriteId}`);
        setFavorites(response.data);

        // If the response includes user info, set it
        if (response.data.userInfo) {
          setUserInfo({
            firstName: response.data.userInfo.firstName || "Unknown",
            lastName: response.data.userInfo.lastName || "",
          });
        }

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
      <h1><strong>{`${userInfo.firstName} ${userInfo.lastName}`}</strong>'s Favorite Books</h1>  
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
        <p>No favorite books yet.</p>
      )}
    </div>
  );
};

export default FavPageShare; 