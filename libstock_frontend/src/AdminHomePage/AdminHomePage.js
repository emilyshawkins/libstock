import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminHomePage.css";

const AdminHomePage = () => {
  // State for storing books from the database
  const [databaseBooks, setDatabaseBooks] = useState([]);

  // State for storing authors linked to books
  const [bookAuthors, setBookAuthors] = useState({});
  const [bookGenres, setBookGenres] = useState({});

  // State for filtered books (for search functionality)
  const [filteredBooks, setFilteredBooks] = useState([]);

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate(); // Initialize navigate function

  const handleBookClick = (bookId) => {
    navigate(`/admin/home/book?id=${bookId}`); // Navigate to book details page
  };

  // Fetch books and authors when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const books = await fetchBooks(); // Wait for books to load
      fetchBookAuthors(books); // Fetch authors only after books are available
      fetchBookGenres(books);
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
      fetchBookGenres(response.data);
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

  const fetchBookGenres = async (books) => {
    if (!books || books.length === 0) return;

    try {
      const bookGenresMap = {};

      for (const book of books) {
        try {
          const genreResponse = await axios.get(
            `http://localhost:8080/bookgenre/get_genres_by_book?bookId=${book.id}`
          );

          if (genreResponse.data.length > 0) {
            const genreNames = genreResponse.data.map((genre) => genre.name);
            bookGenresMap[book.id] = genreNames;
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

  // Remove a book from the database
  const removeBook = async (bookId) => {
    try {
      console.log(`Fetching book-author relationships for book ID: ${bookId}`);

      // 1️⃣ Fetch all book-author relationships for the book
      const bookAuthorResponse = await axios.get(
        `http://localhost:8080/bookauthor/get_ids?bookId=${bookId}`
      );

      console.log("Book-Author response:", bookAuthorResponse.data);

      if (
        Array.isArray(bookAuthorResponse.data) &&
        bookAuthorResponse.data.length > 0
      ) {
        // Delete each book-author entry using bookauthorId
        for (const entry of bookAuthorResponse.data) {
          if (!entry.id) {
            console.warn("Skipping delete: bookauthorId is undefined", entry);
            continue;
          }

          console.log(`Deleting book_author entry ID: ${entry.id}`);
          await axios.delete(
            `http://localhost:8080/bookauthor/delete?id=${entry.id}`
          );
        }
      }

      console.log(`Fetching book-genre relationships for book ID: ${bookId}`);

      // 2️⃣ Fetch all book-genre relationships for the book
      const bookGenreResponse = await axios.get(
        `http://localhost:8080/bookgenre/get_ids?bookId=${bookId}`
      );

      console.log("Book-Genre response:", bookGenreResponse.data);

      if (
        Array.isArray(bookGenreResponse.data) &&
        bookGenreResponse.data.length > 0
      ) {
        // Delete each book-genre entry using bookgenreId
        for (const entry of bookGenreResponse.data) {
          if (!entry.id) {
            console.warn("Skipping delete: bookgenreId is undefined", entry);
            continue;
          }

          console.log(`Deleting book_genre entry ID: ${entry.id}`);
          await axios.delete(
            `http://localhost:8080/bookgenre/delete?id=${entry.id}`
          );
        }
      }

      // 3️⃣ Delete the book itself
      console.log(`Deleting book ID: ${bookId}`);
      await axios.delete(`http://localhost:8080/book/delete?id=${bookId}`);

      // 4️⃣ Update UI after deletion
      setDatabaseBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookId)
      );
      setFilteredBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookId)
      );

      alert("Book, authors, and genres removed successfully!");
    } catch (error) {
      console.error("Error deleting book, author, and genre links:", error);
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
    <div className="admin-home-container">
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
                      <div
                        key={book.id}
                        className="book-card"
                        onClick={() => handleBookClick(book.id)} // Add click event
                        style={{ cursor: "pointer" }}
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
                          <strong>Publication Date:</strong>{" "}
                          {book.publicationDate}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent click from triggering book navigation
                            removeBook(book.id);
                          }}
                        >
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
