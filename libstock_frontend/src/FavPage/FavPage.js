/* src/FavPage/FavPage.js */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import "./FavPage.css";

const FavPage = () => {
  const navigate = useNavigate();
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const [userId] = useState(localStorage.getItem("userId") || "");
  const [shareLink, setShareLink] = useState("");
  const [favoriteId, setFavoriteId] = useState("");
  const [bookAuthors, setBookAuthors] = useState({});
  const [bookGenres, setBookGenres] = useState({});

  useEffect(() => {
    fetchUserFavorites();
  }, []);

  // Fetch user's favorite books
  const fetchUserFavorites = async () => {
    if (!userId) return;

    try {
      // First get the favorite ID
      const favResponse = await axios.get(
        `http://localhost:8080/favorite/get?userId=${userId}`
      );
      setFavoriteId(favResponse.data.id);

      // Then get the favorite books details
      const response = await axios.get(
        `http://localhost:8080/favorite/get_favorites_by_user?userId=${userId}`
      );
      setFavoriteBooks(response.data);
      // Fetch authors and genres for each book
      fetchAuthorsForBooks(response.data);
      fetchGenresForBooks(response.data);
    } catch (error) {
      console.error("Error fetching favorite books:", error);
    }
  };

// Fetch book-author relationships and store them
const fetchAuthorsForBooks = async (books) => {
  if (!books || books.length === 0) return;

  try {
    const bookAuthorsMap = {};
    for (const book of books) {
      try {
        const response = await axios.get(
          `http://localhost:8080/bookauthor/get_authors_by_book?bookId=${book.id}`
        );
        if (response.data && Array.isArray(response.data)) {
          bookAuthorsMap[book.id] = response.data.map(author => 
            `${author.firstName} ${author.lastName}`
          );
        } else {
          bookAuthorsMap[book.id] = ["Unknown Author"];
        }
      } catch (error) {
        console.error(`Error fetching authors for book ${book.id}:`, error);
        bookAuthorsMap[book.id] = ["Unknown Author"];
      }
    }
    setBookAuthors(bookAuthorsMap);
  } catch (error) {
    console.error("Error fetching book authors:", error);
  }
};

// Fetch book-genre relationships and store them
const fetchGenresForBooks = async (books) => {
  if (!books || books.length === 0) return;

  try {
    const bookGenresMap = {};
    for (const book of books) {
      try {
        const response = await axios.get(
          `http://localhost:8080/bookgenre/get_genres_by_book?bookId=${book.id}`
        );
        if (response.data && Array.isArray(response.data)) {
          bookGenresMap[book.id] = response.data.map(genre => genre.name);
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

  const handleBookClick = (bookId) => {
    const book = favoriteBooks.find(book => book.id === bookId);
    const author = bookAuthors[bookId] ? bookAuthors[bookId].join(", ") : "Unknown Author";
    const genre = bookGenres[bookId] ? bookGenres[bookId].join(", ") : "Unknown Genre";
    const isFavorite = true; // Since this is from favorites page
    const isInWishlist = false; // We don't know this from favorites page
    navigate(`/user/home/book?id=${bookId}`, { 
      state: { 
        book,
        author,
        genre,
        isFavorite,
        isInWishlist
      } 
    });
  }

  // Generate shareable link
  const generateShareLink = () => {
    const link = `${window.location.origin}/favorite/share?id=${favoriteId}`;
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
                  <div key={book.id} className="book-card"
                    onClick={(e) => handleBookClick(book.id)}
                    >
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
                      <strong>ISBN:</strong> {book.isbn}
                    </p>
                    <p>
                      <strong>Author:</strong>{" "}
                      {bookAuthors[book.id] ? bookAuthors[book.id].join(", ") : "Unknown Author"}
                    </p>
                    <p>
                      <strong>Genre:</strong>{" "}
                      {bookGenres[book.id] ? bookGenres[book.id].join(", ") : "Unknown Genre"}
                    </p>
                    <p>
                      <strong>Publication Date:</strong> {book.publicationDate}
                    </p>
                    <p>
                      <strong>Price:</strong> ${book.price ? book.price.toFixed(2) : "N/A"}
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
