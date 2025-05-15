import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CollectionPage.css";

const CollectionPage = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]); // List of collections
  const [newCollectionName, setNewCollectionName] = useState(""); // New collection name
  const [newCollectionDescription, setNewCollectionDescription] = useState(""); // New collection description
  const [selectedCollection, setSelectedCollection] = useState(null); // Selected collection for adding books
  const [books, setBooks] = useState([]); // Available books to add
  const [selectedBooks, setSelectedBooks] = useState([]); // Selected books to add/remove
  const [userId] = useState(localStorage.getItem("userId") || ""); // Get user ID from localStorage
  const [collectionSearchQuery, setCollectionSearchQuery] = useState("");
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedCollection, setExpandedCollection] = useState(null); // Track which collection is expanded
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (userId) {
      fetchUserCollections();
      fetchBooks();
    }
  }, [userId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter collections based on search query
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(collectionSearchQuery.toLowerCase())
  );

  // Filter books based on search query
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(bookSearchQuery.toLowerCase())
  );

  // Fetch user's collections from the backend
  const fetchUserCollections = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/admin_collection/get_users?userId=${userId}`
      );
      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  // Fetch available books from the backend
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/book/get_all");
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  // Create a new collection
  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      alert("Collection name cannot be empty!");
      return;
    }

    // Check if collection name already exists
    const collectionExists = collections.some(
      (collection) =>
        collection.name.toLowerCase() === newCollectionName.trim().toLowerCase()
    );

    if (collectionExists) {
      alert(
        "A collection with this name already exists. Please choose a different name."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/admin_collection/create",
        {
          userId,
          name: newCollectionName,
          description: newCollectionDescription,
          visible: false,
          books: [],
        }
      );

      setCollections([...collections, response.data]);
      setNewCollectionName("");
      setNewCollectionDescription("");
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Error creating collection. Please try again.");
    }
  };

  // Delete a collection
  const handleDeleteCollection = async (collectionId) => {
    try {
      await axios.delete(
        `http://localhost:8080/admin_collection/delete?id=${collectionId}`
      );
      setCollections(
        collections.filter((collection) => collection.id !== collectionId)
      );
    } catch (error) {
      console.error("Error deleting collection:", error);
      alert("Error deleting collection. Please try again.");
    }
  };

  // Add books to collection
  const handleAddBooksToCollection = async (bookIds) => {
    if (!selectedCollection || bookIds.length === 0) {
      alert("Please select a collection and at least one book!");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8080/admin_collection/add_books?id=${selectedCollection}`,
        bookIds
      );
      setCollections(
        collections.map((collection) =>
          collection.id === selectedCollection ? response.data : collection
        )
      );
      setSelectedBooks(bookIds);
    } catch (error) {
      console.error("Error adding books to collection:", error);
      alert("Error adding books to collection. Please try again.");
    }
  };

  // Remove books from collection
  const handleRemoveBooksFromCollection = async (bookIds) => {
    if (!selectedCollection || bookIds.length === 0) {
      alert("Please select a collection and at least one book!");
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:8080/admin_collection/remove_book?id=${selectedCollection}`,
        bookIds
      );
      setCollections(
        collections.map((collection) =>
          collection.id === selectedCollection ? response.data : collection
        )
      );
      setSelectedBooks(bookIds);
    } catch (error) {
      console.error("Error removing books from collection:", error);
      alert("Error removing books from collection. Please try again.");
    }
  };

  // Function to handle book click and navigate to details
  const handleBookClick = (bookId) => {
    navigate(`/admin/home/book?id=${bookId}`); // Navigate to book details page
  };

  return (
    <div className="collection-page">
      <h1>Your Collections</h1>
      {/* Existing Collections */}
      <div className="collections-list">
        <h2>List Collections</h2>
        <div className="collection-grid">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className={`collection-card ${
                expandedCollection === collection.id ? "expanded" : ""
              }`}
              onClick={() =>
                setExpandedCollection(
                  expandedCollection === collection.id ? null : collection.id
                )
              }
            >
              <h3>{collection.name}</h3>
              <p>{collection.description}</p>
              <p>Books: {collection.books.length}</p>
              <div className="collection-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCollection(collection.id);
                  }}
                >
                  Delete
                </button>
              </div>
              {expandedCollection === collection.id && (
                <div className="collection-books">
                  <h4>Books in Collection:</h4>
                  <div className="books-list">
                    {books
                      .filter((book) => collection.books.includes(book.id))
                      .map((book) => (
                        <div
                          key={book.id}
                          className="book-item-in-collection"
                          onClick={(e) => handleBookClick(book.id)}
                        >
                          <span>{book.title}</span>
                        </div>
                      ))}
                    {collection.books.length === 0 && (
                      <p className="no-books">No books in this collection</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Create New Collection */}
      <div className="collection-form">
        <h3>Create a New Collection</h3>
        <input
          type="text"
          placeholder="Enter collection name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
        />
        <textarea
          placeholder="Enter collection description"
          value={newCollectionDescription}
          onChange={(e) => setNewCollectionDescription(e.target.value)}
        />
        <button className="collection-button" onClick={handleCreateCollection}>
          Create Collection
        </button>
      </div>

      {/* Select Collection to Manage Books */}
      <div className="collection-select">
        <h3>Manage Collection Books</h3>
        <div className="searchable-dropdown" ref={dropdownRef}>
          <div className="dropdown-header">
            <input
              type="text"
              placeholder={
                selectedCollection
                  ? collections.find((c) => c.id === selectedCollection)?.name
                  : "Search or select collection..."
              }
              value={collectionSearchQuery}
              onChange={(e) => {
                setCollectionSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onClick={(e) => e.stopPropagation()}
            />
            <span className="dropdown-arrow">▼</span>
          </div>
          {isDropdownOpen && (
            <div className="dropdown-content">
              {filteredCollections.map((collection) => (
                <div
                  key={collection.id}
                  className={`dropdown-item ${
                    selectedCollection === collection.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedCollection(collection.id);
                    setCollectionSearchQuery("");
                    setIsDropdownOpen(false);
                  }}
                >
                  {collection.name}
                </div>
              ))}
              {filteredCollections.length === 0 && (
                <div className="dropdown-item no-results">
                  No collections found
                </div>
              )}
            </div>
          )}
        </div>

        {selectedCollection && (
          <div className="selected-collection-info">
            <h4>
              Editing Collection:{" "}
              {collections.find((c) => c.id === selectedCollection)?.name}
            </h4>
          </div>
        )}

        <div className="book-selection">
          <div className="book-selection-header">
            <h3>Select Books</h3>
            <div className="book-search">
              <input
                type="text"
                placeholder="Search books..."
                value={bookSearchQuery}
                onChange={(e) => setBookSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="book-list">
            {filteredBooks.map((book) => {
              const isInCollection =
                selectedCollection &&
                collections
                  .find((c) => c.id === selectedCollection)
                  ?.books.includes(book.id);

              return (
                <div key={book.id} className="book-item">
                  <label className="book-title">{book.title}</label>
                  {selectedCollection && (
                    <button
                      className={`book-action-btn ${
                        isInCollection ? "remove-btn" : "add-btn"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isInCollection) {
                          handleRemoveBooksFromCollection([book.id]);
                        } else {
                          handleAddBooksToCollection([book.id]);
                        }
                      }}
                    >
                      {isInCollection ? "Remove" : "Add"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedCollection && (
          <div className="collection-select-footer">
            <button
              className="done-button"
              onClick={() => {
                setSelectedCollection(null);
                setCollectionSearchQuery("");
                setBookSearchQuery("");
              }}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;