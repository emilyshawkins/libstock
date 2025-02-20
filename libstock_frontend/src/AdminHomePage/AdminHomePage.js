import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminHomePage.css";

const AdminHomePage = () => {
  // State for storing books from the database
  const [databaseBooks, setDatabaseBooks] = useState([]);

  // State for storing authors linked to books
  const [bookAuthors, setBookAuthors] = useState({});

  // State for filtered books (for search functionality)
  const [filteredBooks, setFilteredBooks] = useState([]);

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch books and authors when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const books = await fetchBooks(); // Wait for books to load
      fetchBookAuthors(books); // Fetch authors only after books are available
    };

    fetchData();
  }, []);

  // Fetch all books from the database
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/book/get_all");
      setDatabaseBooks(response.data);
      setFilteredBooks(response.data);

      // Call fetchBookAuthors after books are loaded
      fetchBookAuthors(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  // Fetch all book-author relationships and resolve author names
  const fetchBookAuthors = async (books) => {
    if (!books || books.length === 0) return; // Prevent API call if no books exist

    try {
      const bookAuthorsMap = {}; // Store authors for each book

      for (const book of books) {
        try {
          // Fetch authors for the given book ID
          const authorResponse = await axios.get(
            `http://localhost:8080/bookauthor/get_authors_by_book?bookId=${book.id}`
          );

          if (authorResponse.data.length > 0) {
            const authorNames = authorResponse.data.map(
              (author) => `${author.firstName} ${author.lastName}`
            );
            bookAuthorsMap[book.id] = authorNames;
          } else {
            bookAuthorsMap[book.id] = ["Unknown Author"];
          }
        } catch (error) {
          console.error(`Error fetching authors for book ${book.id}:`, error);
          bookAuthorsMap[book.id] = ["Unknown Author"];
        }
      }

      setBookAuthors(bookAuthorsMap); // Update state with book-author mapping
    } catch (error) {
      console.error("Error fetching book authors:", error);
    }
  };

  // Remove a book from the database
  const removeBook = async (bookId) => {
    try {
      // Step 1: Fetch all book-author relationships for the book
      const bookAuthorResponse = await axios.get(
        `http://localhost:8080/bookauthor/get_authors_by_book?bookId=${bookId}`
      );

      if (bookAuthorResponse.data.length > 0) {
        // Step 2: Delete each book-author entry using bookauthorId
        for (const entry of bookAuthorResponse.data) {
          console.log(`Deleting book_author entry ID: ${entry.id}`); // Debugging
          await axios.delete(
            `http://localhost:8080/bookauthor/delete?id=${entry.id}`
          );
        }
      }

      // Step 3: Delete the book itself
      console.log(`Deleting book ID: ${bookId}`);
      await axios.delete(`http://localhost:8080/book/delete?id=${bookId}`);

      // Step 4: Update UI after deletion
      setDatabaseBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookId)
      );
      setFilteredBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookId)
      );

      alert("Book and associated author relationships removed successfully!");
    } catch (error) {
      console.error("Error deleting book and author link:", error);
      alert("Failed to delete book.");
    }
  };

  // Handle search input and filter books
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter books that match the search query
    const filtered = databaseBooks.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  // Organize books alphabetically
  const booksByLetter = filteredBooks.reduce((acc, book) => {
    const firstLetter = book.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(book);
    return acc;
  }, {});

  return (
    <div className="home-container">
      <h1>Welcome to Your Dashboard</h1>

      <div className="main-content">
        {/* Search bar for filtering books */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Display books in the database */}
        <div className="book-list">
          <h2>Books in Database</h2>
          <span className="book-count">
            Total Books: {filteredBooks.length}
          </span>

          {filteredBooks.length > 0 ? (
            Object.keys(booksByLetter)
              .sort()
              .map((letter) => (
                <div key={letter} className="book-section">
                  <h2 className="section-title">{letter}</h2>
                  <div className="book-grid">
                    {booksByLetter[letter].map((book) => (
                      <div key={book.id} className="book-card">
                        <h3>{book.title}</h3>
                        <p>
                          <strong>Author:</strong>{" "}
                          {bookAuthors[book.id]
                            ? bookAuthors[book.id].join(", ")
                            : "Unknown Author"}
                        </p>
                        <p>
                          <strong>ISBN:</strong> {book.isbn}
                        </p>
                        <p>
                          <strong>Publication Date:</strong>{" "}
                          {book.publicationDate}
                        </p>
                        <button onClick={() => removeBook(book.id)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <p>No books in the database.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
