import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserRentingBook.css";

const UserRentingBook = () => {
  const [checkedOutBooks, setCheckedOutBooks] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookAuthors, setBookAuthors] = useState({});
  const [bookGenres, setBookGenres] = useState({});
  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch checked out books
        const checkoutResponse = await axios.get(
          `http://localhost:8080/checkout/get_all_checked_out?userId=${userId}`
        );
        const checkedOutBookIds = checkoutResponse.data.map(checkout => checkout.bookId);
        
        // Fetch purchased books
        const purchaseResponse = await axios.get(
          `http://localhost:8080/purchase/get_purchases_by_user?userId=${userId}`
        );
        const purchasedBookIds = purchaseResponse.data.map(purchase => purchase.bookId);

        // Fetch book details for checked out books
        const checkedOutBooksData = await Promise.all(
          checkedOutBookIds.map(async (bookId) => {
            const bookResponse = await axios.get(`http://localhost:8080/book/read?id=${bookId}`);
            return bookResponse.data;
          })
        );

        // Fetch book details for purchased books
        const purchasedBooksData = await Promise.all(
          purchasedBookIds.map(async (bookId) => {
            const bookResponse = await axios.get(`http://localhost:8080/book/read?id=${bookId}`);
            return bookResponse.data;
          })
        );

        setCheckedOutBooks(checkedOutBooksData);
        setPurchasedBooks(purchasedBooksData);

        // Fetch authors and genres for all books
        const allBookIds = [...checkedOutBookIds, ...purchasedBookIds];
        await Promise.all([
          fetchBookAuthors(allBookIds),
          fetchBookGenres(allBookIds)
        ]);

      } catch (error) {
        console.error("Error fetching user books:", error);
        setError("Failed to load your books. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const fetchBookAuthors = async (bookIds) => {
    const authors = {};
    await Promise.all(
      bookIds.map(async (bookId) => {
        try {
          const response = await axios.get(
            `http://localhost:8080/bookauthor/get_authors_by_book?bookId=${bookId}`
          );
          authors[bookId] = response.data.map(
            (author) => `${author.firstName} ${author.lastName}`
          );
        } catch (error) {
          console.error(`Error fetching authors for book ${bookId}:`, error);
          authors[bookId] = ["Unknown Author"];
        }
      })
    );
    setBookAuthors(authors);
  };

  const fetchBookGenres = async (bookIds) => {
    const genres = {};
    await Promise.all(
      bookIds.map(async (bookId) => {
        try {
          const response = await axios.get(
            `http://localhost:8080/bookgenre/get_genres_by_book?bookId=${bookId}`
          );
          genres[bookId] = response.data.map((genre) => genre.name);
        } catch (error) {
          console.error(`Error fetching genres for book ${bookId}:`, error);
          genres[bookId] = ["Unknown Genre"];
        }
      })
    );
    setBookGenres(genres);
  };

  const handleBookClick = (bookId) => {
    const book = [...checkedOutBooks, ...purchasedBooks].find(book => book.id === bookId);
    const author = bookAuthors[bookId] ? bookAuthors[bookId].join(", ") : "Unknown Author";
    const genre = bookGenres[bookId] ? bookGenres[bookId].join(", ") : "Unknown Genre";
    navigate(`/user/home/book?id=${bookId}`, { 
      state: { 
        book,
        author,
        genre
      } 
    });
  };

  if (loading) {
    return <div className="loading">Loading your books...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-renting-container">
      <h1>My Books</h1>
      
      {/* Checked Out Books Section */}
      <div className="books-section">
        <h2>Currently Checked Out</h2>
        {checkedOutBooks.length > 0 ? (
          <div className="book-grid">
            {checkedOutBooks.map((book) => (
              <div key={book.id} className="book-card" onClick={() => handleBookClick(book.id)}>
                <h3>{book.title}</h3>
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
                  <strong>Due Date:</strong>{" "}
                  {new Date(book.dueDate * 1000).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No books currently checked out.</p>
        )}
      </div>

      {/* Purchased Books Section */}
      <div className="books-section">
        <h2>Purchased Books</h2>
        {purchasedBooks.length > 0 ? (
          <div className="book-grid">
            {purchasedBooks.map((book) => (
              <div key={book.id} className="book-card" onClick={() => handleBookClick(book.id)}>
                <h3>{book.title}</h3>
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
                  <strong>Purchase Date:</strong>{" "}
                  {new Date(book.purchaseDate * 1000).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No purchased books yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserRentingBook; 