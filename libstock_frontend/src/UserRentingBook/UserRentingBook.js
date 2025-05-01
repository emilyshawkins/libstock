import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CheckedOutBooks from "./CheckedOutBooks";
import PurchasedBooks from "./PurchasedBooks";
import "./UserRentingBook.css";

const UserRentingBook = () => {
  const [checkedOutBooks, setCheckedOutBooks] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [overdueBooks, setOverdueBooks] = useState([]);
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

        if (!userId) {
          throw new Error("User ID not found. Please log in again.");
        }

        // Fetch all checkouts for the user
        const allCheckoutsResponse = await axios.get(
          `http://localhost:8080/checkout/get_all_by_user?userId=${userId}`
        ).catch(error => {
          console.error("Error fetching all checkouts:", error.response?.data || error.message);
          throw new Error("Failed to fetch checkout history");
        });
        console.log("All checkouts response:", allCheckoutsResponse.data);
        const allCheckoutBookIds = allCheckoutsResponse.data.map(checkout => checkout.bookId);

        // Fetch currently checked out books
        const checkoutResponse = await axios.get(
          `http://localhost:8080/checkout/get_all_checked_out?userId=${userId}`
        ).catch(error => {
          console.error("Error fetching checked out books:", error.response?.data || error.message);
          throw new Error("Failed to fetch checked out books");
        });
        console.log("Checked out books response:", checkoutResponse.data);
        const checkedOutBookIds = checkoutResponse.data.map(checkout => checkout.bookId);

        // Fetch overdue books with fee calculations
        const overdueResponse = await axios.get(
          `http://localhost:8080/checkout/get_all_overdue?userId=${userId}`
        ).catch(error => {
          console.error("Error fetching overdue books:", error.response?.data || error.message);
          throw new Error("Failed to fetch overdue books");
        });
        console.log("Overdue books response:", overdueResponse.data);
        const overdueBookIds = overdueResponse.data.map(checkout => checkout.bookId);
        
        // Fetch purchased books
        const purchaseResponse = await axios.get(
          `http://localhost:8080/history/get?userId=${userId}`
        ).catch(error => {
          console.error("Error fetching purchased books:", error.response?.data || error.message);
          throw new Error("Failed to fetch purchase history");
        });
        console.log("Purchased books response:", purchaseResponse.data);
        const purchasedBookIds = purchaseResponse.data.map(purchase => purchase.bookId);

        // Fetch book details for checked out books
        const checkedOutBooksData = await Promise.all(
          checkedOutBookIds.map(async (bookId) => {
            const bookResponse = await axios.get(`http://localhost:8080/book/read?id=${bookId}`)
              .catch(error => {
                console.error(`Error fetching book details for book ${bookId}:`, error.response?.data || error.message);
                throw new Error(`Failed to fetch details for book ${bookId}`);
              });
            const checkoutInfo = checkoutResponse.data.find(checkout => checkout.bookId === bookId);
            return {
              ...bookResponse.data,
              checkoutId: checkoutInfo.id,
              checkoutDate: checkoutInfo.checkoutDate,
              dueDate: checkoutInfo.dueDate,
              status: checkoutInfo.status
            };
          })
        );

        // Fetch book details for overdue books
        const overdueBooksData = await Promise.all(
          overdueBookIds.map(async (bookId) => {
            const bookResponse = await axios.get(`http://localhost:8080/book/read?id=${bookId}`)
              .catch(error => {
                console.error(`Error fetching overdue book details for book ${bookId}:`, error.response?.data || error.message);
                throw new Error(`Failed to fetch details for overdue book ${bookId}`);
              });
            const overdueInfo = overdueResponse.data.find(checkout => checkout.bookId === bookId);
            return {
              ...bookResponse.data,
              overdueFee: overdueInfo.overdueFee,
              daysOverdue: overdueInfo.daysOverdue
            };
          })
        );

        // Fetch book details for purchased books
        const purchasedBooksData = await Promise.all(
          purchasedBookIds.map(async (bookId) => {
            const bookResponse = await axios.get(`http://localhost:8080/book/read?id=${bookId}`)
              .catch(error => {
                console.error(`Error fetching purchased book details for book ${bookId}:`, error.response?.data || error.message);
                throw new Error(`Failed to fetch details for purchased book ${bookId}`);
              });
            const purchaseInfo = purchaseResponse.data.find(purchase => purchase.bookId === bookId);
            return {
              ...bookResponse.data,
              purchaseDate: purchaseInfo.purchaseDate,
              quantity: purchaseInfo.quantity,
              cost: purchaseInfo.cost
            };
          })
        );

        setCheckedOutBooks(checkedOutBooksData);
        setOverdueBooks(overdueBooksData);
        setPurchasedBooks(purchasedBooksData);

        // Fetch authors and genres for all books
        const allBookIds = [...allCheckoutBookIds, ...purchasedBookIds];
        await Promise.all([
          fetchBookAuthors(allBookIds),
          fetchBookGenres(allBookIds)
        ]);

      } catch (error) {
        console.error("Error in fetchData:", error);
        setError(error.message || "Failed to load your books. Please try again.");
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
      
      {/* Overdue Books Section */}
      <div className="books-section">
        <h2>Overdue Books</h2>
        {overdueBooks.length > 0 ? (
          <div className="book-grid">
            {overdueBooks.map((book) => (
              <div key={book.id} className="book-card overdue" onClick={() => handleBookClick(book.id)}>
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
                  <strong>Days Overdue:</strong> {book.daysOverdue}
                </p>
                <p>
                  <strong>Overdue Fee:</strong> ${book.overdueFee.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No overdue books.</p>
        )}
      </div>

      {/* Checked Out Books Section */}
      <CheckedOutBooks 
        books={checkedOutBooks}
        bookAuthors={bookAuthors}
        bookGenres={bookGenres}
        onBookClick={handleBookClick}
      />

      {/* Purchased Books Section */}
      <PurchasedBooks 
        books={purchasedBooks}
        bookAuthors={bookAuthors}
        bookGenres={bookGenres}
        onBookClick={handleBookClick}
      />
    </div>
  );
};

export default UserRentingBook; 