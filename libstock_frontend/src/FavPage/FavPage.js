/* src/FavPage/FavPage.js */
import React, { useState, useEffect } from "react";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import "./FavPage.css";

const FavPage = () => {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    fetchUserFavorites();
  }, []);

  // Fetch user's favorite books
  const fetchUserFavorites = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(
        `http://localhost:8080/favorite/get_favorites_by_user?userId=${userId}`
      );
      setFavoriteBooks(response.data);
    } catch (error) {
      console.error("Error fetching favorite books:", error);
    }
  };

  // Toggle favorite book
  const handleFavoriteToggle = async (bookId) => {
    try {
      if (favoriteBooks.some((book) => book.id === bookId)) {
        // Remove from favorites
        await axios.delete(`http://localhost:8080/favorite/delete`, {
          params: { userId, bookId },
        });
        setFavoriteBooks((prev) => prev.filter((book) => book.id !== bookId));
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  // Generate shareable link
  const generateShareLink = () => {
    const link = `${window.location.origin}/shared-favorites?userId=${userId}`;
    setShareLink(link);
    navigator.clipboard.writeText(link);
    alert("Favorite books link copied to clipboard!");
  };

  // Organize books alphabetically
  const booksByLetter = favoriteBooks.reduce((acc, book) => {
    const firstLetter = book.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(book);
    return acc;
  }, {});

  return (
    <div className="fav-container">
      <h1>Your Favorite Books</h1>

      <button className="share-button" onClick={generateShareLink}>
        <ShareIcon /> Share Favorites
      </button>

      {shareLink && (
        <p className="share-link">
          Share this link: <a href={shareLink}>{shareLink}</a>
        </p>
      )}

      {favoriteBooks.length > 0 ? (
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
                      <span
                        className="favorite-icon"
                        onClick={() => handleFavoriteToggle(book.id)}
                      >
                        <FavoriteIcon
                          style={{
                            cursor: "pointer",
                            color: "red",
                            fontSize: "24px",
                          }}
                        />
                      </span>
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

export default FavPage;
