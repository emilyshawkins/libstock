/* src/BookDetails/UserBookDetails.js */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";
import "./UserBookDetails.css";

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState("Unknown Author");
  const [genres, setGenres] = useState("Unknown Genre");
  const [favoriteBooks, setFavoriteBooks] = useState(new Set());
  const [userId] = useState(localStorage.getItem("userId") || "");
  const [wishlist, setWishlist] = useState(new Set());
  const navigate = useNavigate(); // Initialize navigate function
  const location = useLocation();

  // Extract book ID from URL
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get("id");

  useEffect(() => {
    if (!bookId) return;
    const fetchBookDetails = async () => {
      try {
        // Fetch book details
        const bookResponse = await axios.get(
          `http://localhost:8080/book/read?id=${bookId}`
        );
        setBook(bookResponse.data);

        // Fetch authors for the book
        const authorResponse = await axios.get(
          `http://localhost:8080/bookauthor/get_authors_by_book?bookId=${bookId}`
        );
        if (authorResponse.data.length > 0) {
          setAuthor(
            authorResponse.data
              .map((a) => `${a.firstName} ${a.lastName}`)
              .join(", ")
          );
        }

        // Fetch genres for the book
        const genreResponse = await axios.get(
          `http://localhost:8080/bookgenre/get_genres_by_book?bookId=${bookId}`
        );
        if (genreResponse.data.length > 0) {
          setGenres(genreResponse.data.map((genre) => genre.name).join(", "));
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } 
    fetchUserFavorites();
    fetchUserWishlist();
    };
    fetchBookDetails();
  }, [bookId]);

  if (!book) {
    return <p>Loading book details...</p>;
  }
//Favorite Handle
const fetchUserFavorites = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const response = await axios.get(`http://localhost:8080/favorite/get_favorites_by_user?userId=${userId}`);
    const favoriteId = new Set(response.data.map(book => book.id));
    setFavoriteBooks(favoriteId);
  } catch (error) {
    console.error("Error fetching favorite books:", error);
  }
};

// Toggle favorite book
const handleFavoriteToggle = async (bookId) => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    if (favoriteBooks.has(bookId)) {
      await axios.delete(`http://localhost:8080/favorite/delete`, {
        params: { userId, bookId }  
      });
      setFavoriteBooks(prev => {
        const updatedFavorites = new Set(prev);
        updatedFavorites.delete(bookId);
        return updatedFavorites;
      });
    } else {
      // Add to favorites
      await axios.post(`http://localhost:8080/favorite/create`, { userId, bookId });
      setFavoriteBooks(prev => {
        const updatedFavorites = new Set(prev);
        updatedFavorites.add(bookId);
        return updatedFavorites;
      });
    }
  } catch (error) {
    console.error("Error updating favorite status:", error);
  }
};

//Wishlist Handle
const fetchUserWishlist = async () => {
  if (!userId) return;
  try {
    const response = await axios.get(
      `http://localhost:8080/wishlist/get_wishlist_by_user?userId=${userId}`
    );
    const wishlistIds = new Set(response.data.map((book) => book.id));
    setWishlist(wishlistIds);
  } catch (error) {
    console.error("Error fetching Wishlist:", error);
  }
};

const handleWishlistToggle = async (bookId) => {
  try {
      await axios.post("http://localhost:8080/wishlist/create", { userId, bookId });
      setWishlist((prev) => new Set(prev).add(bookId));
      alert("Add to Wishlist success!")
  }
  catch (error) {
    console.error("Error updating wishlist status:", error);
  }
};

  return (
    <div className="UserBook-details-container">
      <h1>{book.title}</h1>
      {/* Favorite icon with toggle functionality */}
      <span className="favorite-icon" onClick={(e) => {handleFavoriteToggle(book.id); e.stopPropagation();}}>
                            {favoriteBooks.has(book.id) ? (
                              <FavoriteIcon style={{ cursor: "pointer", color: "red", fontSize: "24px", marginLeft: "-20px" }} />
                            ) : (
                              <FavoriteBorderIcon style={{ cursor: "pointer", color: "grey", fontSize: "24px", marginLeft: "-20px" }} />
                            )}
                          </span>
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
      {/* Wishlist with toggle functionality */}
      <button
        className="wishlist-button"
        onClick={(e) => {handleWishlistToggle(book.id) ; e.stopPropagation();}}
      >
        {wishlist.has(book.id) ? "Remove from Wishlist" : "Add to Wishlist"}
      </button>
    </div>
  );
};

export default BookDetails;
