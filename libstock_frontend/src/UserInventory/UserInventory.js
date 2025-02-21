import React, { useState, useEffect } from "react";
import axios from "axios";

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
    fetchBooks();
    fetchBookAuthors();
  }, []);

  // Fetch all books from the database
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/book/get_all");
      setDatabaseBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  // Fetch book-author relationships and store them
  const fetchBookAuthors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/bookauthor/read_all"
      );
      const bookAuthorMappings = response.data;

      const authorDetails = {};

      // Fetch each author linked to a book
      for (const mapping of bookAuthorMappings) {
        const authorResponse = await axios.get(
          `http://localhost:8080/author/read?id=${mapping.authorId}`
        );

        if (authorResponse.data) {
          if (!authorDetails[mapping.bookId]) {
            authorDetails[mapping.bookId] = [];
          }
          authorDetails[mapping.bookId].push(
            `${authorResponse.data.firstName} ${authorResponse.data.lastName}`
          );
        }
      }

      setBookAuthors(authorDetails);
    } catch (error) {
      console.error("Error fetching book authors:", error);
    }
  };

  // Remove a book from the database
  const removeBook = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/book/delete?id=${id}`);
      setDatabaseBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== id)
      );
      setFilteredBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== id)
      );
    } catch (error) {
      console.error("Error deleting book", error);
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
    <div className="User-home-container">
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
