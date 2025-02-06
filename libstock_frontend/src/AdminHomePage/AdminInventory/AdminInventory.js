import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminInventory.css";
import AddBook from "./AddBook";
import { Link } from "react-router-dom";

const API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY; // Access API key from .env

const AdminInventory = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/book/get-all");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleBookAdded = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
  };

  const searchBooks = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          searchQuery
        )}&key=${API_KEY}`
      );

      if (response.data.items) {
        setBooks(response.data.items.slice(0, 5)); // Show top 5 results
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const addBookToDatabase = async (book) => {
    const bookData = {
      isbn: book.volumeInfo.industryIdentifiers?.[0]?.identifier || "Unknown",
      title: book.volumeInfo.title,
      summary: "No description available",
      publicationDate: book.volumeInfo.publishedDate || "Unknown", // Default timestamp format
      price: 50, // Default price
      purchaseable: true,
      count: 50,
      numCheckedOut: 1,
    };
    try {
      const response = await axios.post(
        "http://localhost:8080/book/create",
        bookData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        alert("Book added successfully!");
        handleBookAdded(bookData); // Update UI
      }
    } catch (error) {
      console.error("Error adding book to database:", error);
      alert("Failed to add book.");
    }
  };

  return (
    <div id="main-container" className="main-container nav-effect-1">
      {/* MAIN CONTENT WRAPPER */}
      <div className="main clearfix">
        {/* HEADER */}
        <header id="header" className="page-header">
          <div className="page-header-container row">
            <div className="menu-search">
              {/* Main Navigation */}
              <div className="main-navigation">
                <a href="#">Menu</a>
              </div>
            </div>
          </div>
        </header>

        <div className="search-container">
          <h2>Search Books</h2>
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={searchBooks}>Search</button>

          {/* Display search results */}
          <div className="book-results">
            {books.map((book) => {
              const volumeInfo = book.volumeInfo; // Shortcut for readability
              return (
                <div key={book.id} className="book-card">
                  <img
                    src={volumeInfo.imageLinks?.thumbnail || "placeholder.jpg"}
                    alt={volumeInfo.title}
                  />
                  <h3>{volumeInfo.title}</h3>
                  <p>
                    <strong>Author:</strong>{" "}
                    {volumeInfo.authors?.join(", ") || "Unknown Author"}
                  </p>
                  <p>
                    <strong>ISBN:</strong>{" "}
                    {volumeInfo.industryIdentifiers?.[0]?.identifier || "N/A"}
                  </p>
                  <p>
                    <strong>Publisher:</strong>{" "}
                    {volumeInfo.publisher || "Unknown Publisher"}
                  </p>
                  <p>
                    <strong>Publication Date:</strong>{" "}
                    {volumeInfo.publishedDate || "Unknown Date"}
                  </p>
                  <button onClick={() => addBookToDatabase(book)}>
                    Add to Database
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        {/* PAGE CONTAINER */}
        <div className="page-container">
          <div className="page-title category-title">
            {/* <h1>Book Viewer</h1> */}
          </div>

          {/* BOOK LIST SECTION */}
          <section id="book_list">
            {/* Filter + Sort Toolbar */}
            <div className="toolbar row">
              {/* <div className="filter-options small-12 medium-9 columns">
                <a href="#" className="filter-item active" data-group="all">
                  All Categories
                </a>
                <a href="#" className="filter-item" data-group="fantasy">
                  Fantasy
                </a>
                <a href="#" className="filter-item" data-group="sci-fi">
                  Sci-Fi
                </a>
                <a href="#" className="filter-item" data-group="classic">
                  Classics
                </a>
                <a href="#" className="filter-item" data-group="fairy">
                  Fairy Tale
                </a>
                <a href="#" className="filter-item" data-group="young">
                  Young Adult
                </a>
              </div> */}
              {/* Sort Option */}
              <div className="small-12 medium-3 columns">
                <select className="sort-options">
                  <option value="" disabled defaultValue>
                    Sort by
                  </option>
                  <option value="">Featured</option>
                  <option value="title">Alphabetical</option>
                  <option value="date-created">Published</option>
                </select>
              </div>
            </div>
            {/* Create Button */}
            <Link to="/admin/inventory/add-book">
              <button
                onClick={() => {
                  console.log("Create Button Clicked");
                }}
              >
                Create a Book
              </button>
            </Link>

            {/* Grid Shuffle */}
            <div className="grid-shuffle">
              <ul id="grid" className="row">
                {/* BOOK ITEM #1 */}
                <li
                  className="book-item small-12 medium-6 columns"
                  data-groups='["classic"]'
                  data-date-creat
                  ed="1937"
                  data-title="Of Mice and Men"
                  data-color="#fcc278"
                >
                  <div className="bk-img">
                    <div className="bk-wrapper">
                      <div className="bk-book bk-bookdefault">
                        <div className="bk-front">
                          <div
                            className="bk-cover"
                            style={{
                              backgroundImage:
                                "url('http://interactivejoe.com/book-viewer/assets/images/bk_1-small.jpg')",
                            }}
                          ></div>
                        </div>
                        <div className="bk-back"></div>
                        <div className="bk-left"></div>
                      </div>
                    </div>
                  </div>
                  <div className="item-details">
                    <h3 className="book-item_title">Of Mice and Men</h3>
                    <p className="author">by John Steinbeck &bull; 1937</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Etiam tellus nisi, eget pulvinar in, molestie et arcu.
                    </p>
                    <a href="#" className="button ">
                      Details
                    </a>
                  </div>
                </li>
                {/* BOOK ITEM #2 */}
                <li
                  className="book-item small-12 medium-6 columns"
                  data-groups='["classic"]'
                  data-date-created="1937"
                  data-title="Of Mice and Men"
                  data-color="#fcc278"
                >
                  <div className="bk-img">
                    <div className="bk-wrapper">
                      <div className="bk-book bk-bookdefault">
                        <div className="bk-front">
                          <div
                            className="bk-cover"
                            style={{
                              backgroundImage:
                                "url('http://interactivejoe.com/book-viewer/assets/images/bk_1-small.jpg')",
                            }}
                          ></div>
                        </div>
                        <div className="bk-back"></div>
                        <div className="bk-left"></div>
                      </div>
                    </div>
                  </div>
                  <div className="item-details">
                    <h3 className="book-item_title">Of Mice and Men</h3>
                    <p className="author">by John Steinbeck &bull; 1937</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Etiam tellus nisi, eget pulvinar in, molestie et arcu.
                    </p>
                    <a href="#" className="button ">
                      Details
                    </a>
                  </div>
                </li>
                {/* BOOK ITEM #3 */}
                <li
                  className="book-item small-12 medium-6 columns"
                  data-groups='["classic"]'
                  data-date-created="1937"
                  data-title="Of Mice and Men"
                  data-color="#fcc278"
                >
                  <div className="bk-img">
                    <div className="bk-wrapper">
                      <div className="bk-book bk-bookdefault">
                        <div className="bk-front">
                          <div
                            className="bk-cover"
                            style={{
                              backgroundImage:
                                "url('http://interactivejoe.com/book-viewer/assets/images/bk_1-small.jpg')",
                            }}
                          ></div>
                        </div>
                        <div className="bk-back"></div>
                        <div className="bk-left"></div>
                      </div>
                    </div>
                  </div>
                  <div className="item-details">
                    <h3 className="book-item_title">Of Mice and Men</h3>
                    <p className="author">by John Steinbeck &bull; 1937</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Etiam tellus nisi, eget pulvinar in, molestie et arcu.
                    </p>
                    <a href="#" className="button ">
                      Details
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </div>
      {/* /main */}

      <div className="main-overlay">
        <div className="overlay-full"></div>
      </div>
    </div>
  );
};

export default AdminInventory;
