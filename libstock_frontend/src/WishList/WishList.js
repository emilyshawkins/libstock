/* src/WishList/WishList.js */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShareIcon from "@mui/icons-material/Share";
import "./WishList.css";

const WishListPage = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [userId] = useState(localStorage.getItem("userId") || "");
  const [shareLink, setShareLink] = useState("");
  const [wishlistId, setWishlistId] = useState("");
  const [bookAuthors, setBookAuthors] = useState({});
  const [bookGenres, setBookGenres] = useState({});

  useEffect(() => {
    fetchUserWishlist();
  }, []);

  // Fetch user's Wishlist books
  const fetchUserWishlist = async () => {
    if (!userId) return;
  
    try {
      // First get the Wishlist ID
      const wishResponse = await axios.get(
        `http://localhost:8080/wishlist/get?userId=${userId}`
      );
      setWishlistId(wishResponse.data.id);
      
      // Then get the Wishlist books details
      const response = await axios.get(
        `http://localhost:8080/wishlist/get_wishlist_by_user?userId=${userId}`
      );
      setWishlist(response.data);
      // Fetch authors and genres for each book
      fetchAuthorsForBooks(response.data);
      fetchGenresForBooks(response.data);
    } catch (error) {
      console.error("Error fetching Wishlist:", error);
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

  // Toggle Wishlist book
  const handleWishlistToggle = async (bookId) => {
    try {
      if (wishlist.some((book) => book.id === bookId)) {
        // Remove from Wishlist
        await axios.delete(`http://localhost:8080/wishlist/delete`, {
          params: { userId, bookId },
        });
        setWishlist((prev) => prev.filter((book) => book.id !== bookId));
        // Remove from bookAuthors and bookGenres maps
        setBookAuthors(prev => {
          const newMap = { ...prev };
          delete newMap[bookId];
          return newMap;
        });
        setBookGenres(prev => {
          const newMap = { ...prev };
          delete newMap[bookId];
          return newMap;
        });
      } else {
        // Add to Wishlist
        await axios.post(`http://localhost:8080/wishlist/create?userId=${userId}&bookId=${bookId}`);
        fetchUserWishlist();
      }
    } catch (error) {
      console.error("Error updating wishlist status:", error);
    }
  };

  const handleBookClick = (bookId) => {
    const book = wishlist.find(book => book.id === bookId);
    const author = bookAuthors[bookId] ? bookAuthors[bookId].join(", ") : "Unknown Author";
    const genre = bookGenres[bookId] ? bookGenres[bookId].join(", ") : "Unknown Genre";
    const isFavorite = false; // We don't know this from wishlist page
    const isInWishlist = true; // Since this is from wishlist page
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
    const link = `${window.location.origin}/wishlist/share?id=${wishlistId}`;
    setShareLink(link);
    navigator.clipboard.writeText(link);
    alert("Wishlist link copied to clipboard!");
  };

  // Organize books alphabetically
  const booksByLetter = wishlist.reduce((acc, book) => {
    const firstLetter = book.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(book);
    return acc;
  }, {});

  return (
    <div className="wishlist-container">
      <h1>Your WishList</h1>

      <button className="share-button" onClick={generateShareLink}>
        <ShareIcon /> Share WishList
      </button>

      {shareLink && (
        <p className="share-link">
          Share this link: <a href={shareLink}>{shareLink}</a>
        </p>
      )}

      {wishlist.length > 0 ? (
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
                    <h3 className="book-title">{book.title}</h3>
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
                    <button
                      className="wishlist-button"
                      onClick={(e) => {
                        handleWishlistToggle(book.id);
                        e.stopPropagation();
                      }}
                    >
                      {wishlist.some((b) => b.id === book.id)
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
      ) : (
        <p>No book in your wishlist yet.</p>
      )}
    </div>
  );
};

export default WishListPage;
