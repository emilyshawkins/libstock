/* src/WishList/WishList.js */
import React, { useState, useEffect } from "react";
import axios from "axios";
import ShareIcon from "@mui/icons-material/Share";
import "./WishList.css";

const WishListPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [userId] = useState(localStorage.getItem("userId") || "");
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    fetchUserWishlist();
  }, []);

  // Fetch user's Wishlist books
  const fetchUserWishlist = async () => {
    if (!userId) return;
  
    try {
      const response = await axios.get(
        `http://localhost:8080/wishlist/get_wishlist_by_user?userId=${userId}`
      );
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching Wishlist:", error);
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
      } else {
        // Add to Wishlist
        await axios.post(`http://localhost:8080/wishlist/create?userId=${userId}&bookId=${bookId}`);
        fetchUserWishlist();
      }
    } catch (error) {
      console.error("Error updating wishlist status:", error);
    }
  };

  // Generate shareable link
  const generateShareLink = () => {
    const link = `${window.location.origin}/wishlist/share?id=${userId}`;
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
                  <div key={book.id} className="book-card">
                    <h3 className="book-title">{book.title}</h3>
                    <p>
                      <strong>Author:</strong> {book.author || "Unknown Author"}
                    </p>
                    <p>
                      <strong>ISBN:</strong> {book.isbn}
                    </p>
                    <p>
                      <strong>Publication Date:</strong> {book.publicationDate}
                    </p>
                    <button
                      className="wishlist-button"
                      onClick={() => handleWishlistToggle(book.id)}
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
