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
  const [searchQuery, setSearchQuery] = useState("");
  const userId = localStorage.getItem("userId") || "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!userId) {
          setError("User ID not found. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("Fetching data for user ID:", userId);

        // Fetch checked out books
        const checkoutResponse = await axios
          .get(
            `http://localhost:8080/checkout/get_all_checked_out?userId=${userId}`
          )
          .catch((error) => {
            console.error(
              "Error fetching checked out books:",
              error.response?.data || error.message
            );
            throw new Error(
              `Failed to fetch checked out books: ${
                error.response?.data?.message || error.message
              }`
            );
          });

        console.log("Checkout response:", checkoutResponse.data);

        if (!Array.isArray(checkoutResponse.data)) {
          console.error(
            "Invalid checkout response format:",
            checkoutResponse.data
          );
          throw new Error("Invalid response format for checked out books");
        }

        const checkedOutBookIds = checkoutResponse.data.map(
          (checkout) => checkout.bookId
        );
        console.log("Checked out book IDs:", checkedOutBookIds);

        // Fetch purchased books
        const purchaseResponse = await axios
          .get(`http://localhost:8080/history/get?userId=${userId}`)
          .catch((error) => {
            console.error(
              "Error fetching purchased books:",
              error.response?.data || error.message
            );
            throw new Error(
              `Failed to fetch purchased books: ${
                error.response?.data?.message || error.message
              }`
            );
          });

        console.log("Purchase response:", purchaseResponse.data);

        if (!Array.isArray(purchaseResponse.data)) {
          console.error(
            "Invalid purchase response format:",
            purchaseResponse.data
          );
          throw new Error("Invalid response format for purchased books");
        }

        const purchasedBookIds = purchaseResponse.data.map(
          (purchase) => purchase.bookId
        );
        console.log("Purchased book IDs:", purchasedBookIds);

        // Fetch book details for checked out books
        const checkedOutBooksData = await Promise.all(
          checkedOutBookIds.map(async (bookId) => {
            try {
              console.log(`Fetching details for book ID: ${bookId}`);
              const bookResponse = await axios.get(
                `http://localhost:8080/book/read?id=${bookId}`
              );
              const checkoutInfo = checkoutResponse.data.find(
                (checkout) => checkout.bookId === bookId
              );

              if (!bookResponse.data || !checkoutInfo) {
                console.error(`Missing data for book ID ${bookId}:`, {
                  bookResponse,
                  checkoutInfo,
                });
                return null;
              }

              return {
                ...bookResponse.data,
                checkoutId: checkoutInfo.id,
                checkoutDate: checkoutInfo.checkoutDate,
                dueDate: checkoutInfo.dueDate,
                status: checkoutInfo.status,
              };
            } catch (error) {
              console.error(
                `Error fetching book details for book ID ${bookId}:`,
                error.response?.data || error.message
              );
              return null;
            }
          })
        )
          .then((books) => books.filter((book) => book !== null))
          .then((books) =>
            books.sort((a, b) => a.title.localeCompare(b.title))
          );

        console.log("Processed checked out books:", checkedOutBooksData);

        // Fetch book details for purchased books
        const purchasedBooksData = await Promise.all(
          purchasedBookIds.map(async (bookId) => {
            try {
              console.log(`Fetching details for book ID: ${bookId}`);
              const bookResponse = await axios.get(
                `http://localhost:8080/book/read?id=${bookId}`
              );
              const purchaseInfo = purchaseResponse.data.find(
                (purchase) => purchase.bookId === bookId
              );

              if (!bookResponse.data || !purchaseInfo) {
                console.error(`Missing data for book ID ${bookId}:`, {
                  bookResponse,
                  purchaseInfo,
                });
                return null;
              }

              return {
                ...bookResponse.data,
                purchaseDate: purchaseInfo.purchaseDate,
                quantity: purchaseInfo.quantity,
                cost: purchaseInfo.cost,
              };
            } catch (error) {
              console.error(
                `Error fetching book details for book ID ${bookId}:`,
                error.response?.data || error.message
              );
              return null;
            }
          })
        )
          .then((books) => books.filter((book) => book !== null))
          .then((books) =>
            books.sort((a, b) => a.title.localeCompare(b.title))
          );

        console.log("Processed purchased books:", purchasedBooksData);

        setCheckedOutBooks(checkedOutBooksData);
        setPurchasedBooks(purchasedBooksData);

        // Fetch authors and genres for all books
        const allBookIds = [...checkedOutBookIds, ...purchasedBookIds];
        await Promise.all([
          fetchBookAuthors(allBookIds),
          fetchBookGenres(allBookIds),
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
    const book = [...checkedOutBooks, ...purchasedBooks].find(
      (book) => book.id === bookId
    );
    const author = bookAuthors[bookId]
      ? bookAuthors[bookId].join(", ")
      : "Unknown Author";
    const genre = bookGenres[bookId]
      ? bookGenres[bookId].join(", ")
      : "Unknown Genre";
    navigate(`/user/home/book?id=${bookId}`, {
      state: {
        book,
        author,
        genre,
      },
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    // Convert Unix timestamp (seconds) to milliseconds
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filterBooks = (books) => {
    if (!searchQuery) return books;

    const query = searchQuery.toLowerCase();
    return books.filter((book) => {
      const title = book.title?.toLowerCase() || "";
      const isbn = book.isbn?.toLowerCase() || "";
      const authors = bookAuthors[book.id]?.join(" ").toLowerCase() || "";

      return (
        title.includes(query) || isbn.includes(query) || authors.includes(query)
      );
    });
  };

  if (loading) {
    return <div className="loading">Loading your books...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const filteredCheckedOutBooks = filterBooks(checkedOutBooks);
  const filteredPurchasedBooks = filterBooks(purchasedBooks);

  return (
    <div className="user-renting-container">
      <h1>My Books</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Checked Out Books Section */}
      <div className="books-section">
        <h2>Currently Checked Out</h2>
        {filteredCheckedOutBooks.length > 0 ? (
          <div className="book-grid">
            {filteredCheckedOutBooks.map((book) => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => handleBookClick(book.id)}
              >
                <h3>{book.title}</h3>
                <p>
                  <strong>ISBN:</strong> {book.isbn}
                </p>
                <p>
                  <strong>Author:</strong>{" "}
                  {bookAuthors[book.id]
                    ? bookAuthors[book.id].join(", ")
                    : "Unknown Author"}
                </p>
                <p>
                  <strong>Genre:</strong>{" "}
                  {bookGenres[book.id]
                    ? bookGenres[book.id].join(", ")
                    : "Unknown Genre"}
                </p>
                <p>
                  <strong>Checkout Date:</strong>{" "}
                  {formatDate(book.checkoutDate)}
                </p>
                <p>
                  <strong>Due Date:</strong> {formatDate(book.dueDate)}
                </p>
                <p>
                  <strong>Status:</strong> {book.status}
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
        {filteredPurchasedBooks.length > 0 ? (
          <div className="book-grid">
            {filteredPurchasedBooks.map((book) => (
              <div
                key={book.id}
                className="book-card"
                onClick={() => handleBookClick(book.id)}
              >
                <h3>{book.title}</h3>
                <p>
                  <strong>ISBN:</strong> {book.isbn}
                </p>
                <p>
                  <strong>Author:</strong>{" "}
                  {bookAuthors[book.id]
                    ? bookAuthors[book.id].join(", ")
                    : "Unknown Author"}
                </p>
                <p>
                  <strong>Genre:</strong>{" "}
                  {bookGenres[book.id]
                    ? bookGenres[book.id].join(", ")
                    : "Unknown Genre"}
                </p>
                <p>
                  <strong>Purchase Date:</strong>{" "}
                  {formatDate(book.purchaseDate)}
                </p>
                <p>
                  <strong>Quantity:</strong> {book.quantity}
                </p>
                <p>
                  <strong>Cost:</strong> ${(book.cost / 100).toFixed(2)}
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
