import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FavPageShare.css";

const FavPageShare = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({ firstName: "Shared", lastName: "Favorites" });
  const [bookAuthors, setBookAuthors] = useState({});
  const [bookGenres, setBookGenres] = useState({});

  useEffect(() => {
    const fetchSharedFavorites = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const favoriteId = urlParams.get('id');
        
        if (!favoriteId) {
          setError("No favorite ID provided");
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:8080/favorite/share?id=${favoriteId}`);
        
        if (response.data) {
          // Set user info from the response
          setUserInfo({
            firstName: response.data.firstName || "User's",
            lastName: response.data.lastName || "Favorites"
          });
          
          // Set books if they exist in the response
          if (response.data.books && Array.isArray(response.data.books)) {
            setFavorites(response.data.books);
            // Fetch authors and genres for each book
            fetchAuthorsForBooks(response.data.books);
            fetchGenresForBooks(response.data.books);
          } else {
            console.warn("No books found in the response");
            setFavorites([]);
          }
        } else {
          console.warn("Unexpected response format");
          setFavorites([]);
        }

      } catch (error) {
        console.error("Error fetching shared favorites:", error);
        setError("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    const fetchAuthorsForBooks = async (books) => {
      const authorsMap = {};
      for (const book of books) {
        try {
          const response = await axios.get(`http://localhost:8080/bookauthor/get_authors_by_book?bookId=${book.id}`);
          if (response.data && Array.isArray(response.data)) {
            authorsMap[book.id] = response.data.map(author => 
              `${author.firstName} ${author.lastName}`
            ).join(", ");
          } else {
            authorsMap[book.id] = "Unknown Author";
          }
        } catch (error) {
          console.error(`Error fetching authors for book ${book.id}:`, error);
          authorsMap[book.id] = "Unknown Author";
        }
      }
      setBookAuthors(authorsMap);
    };

    const fetchGenresForBooks = async (books) => {
      const genresMap = {};
      for (const book of books) {
        try {
          const response = await axios.get(`http://localhost:8080/bookgenre/get_genres_by_book?bookId=${book.id}`);
          if (response.data && Array.isArray(response.data)) {
            genresMap[book.id] = response.data.map(genre => genre.name).join(", ");
          } else {
            genresMap[book.id] = "Unknown Genre";
          }
        } catch (error) {
          console.error(`Error fetching genres for book ${book.id}:`, error);
          genresMap[book.id] = "Unknown Genre";
        }
      }
      setBookGenres(genresMap);
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
    <div className="fav-share-container">
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
                      <strong>ISBN:</strong> {book.isbn}
                    </p>
                    <p>
                      <strong>Author:</strong>{" "}
                      {bookAuthors[book.id] || "Unknown Author"}
                    </p>
                    <p>
                      <strong>Genre:</strong>{" "}
                      {bookGenres[book.id] || "Unknown Genre"}
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

export default FavPageShare;
