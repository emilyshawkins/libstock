import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CollectionPage.css";

const CollectionPage = () => {
  const [collections, setCollections] = useState([]); // List of collections
  const [newCollectionName, setNewCollectionName] = useState(""); // New collection name
  const [selectedCollection, setSelectedCollection] = useState(null); // Selected collection for adding books
  const [books, setBooks] = useState([]); // Available books to add
  const [selectedBook, setSelectedBook] = useState(null); // Selected book to add

  useEffect(() => {
    fetchCollections();
    fetchBooks();
  }, []);

  // Fetch existing collections from the backend
  const fetchCollections = async () => {
    try {
      const response = await axios.get("http://localhost:8080/collections/all");
      setCollections(response.data);
    } catch (error) {
      console.error("Error fetching collections:", error);
    }
  };

  // Fetch available books from the backend
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/book/all");
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

    try {
      const response = await axios.post("http://localhost:8080/collections/create", {
        name: newCollectionName,
      });

      setCollections([...collections, response.data]); // Update the UI
      setNewCollectionName(""); // Reset input
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  // Add a book to the selected collection
  const handleAddBookToCollection = async () => {
    if (!selectedCollection || !selectedBook) {
      alert("Please select a collection and a book!");
      return;
    }

    try {
      await axios.post("http://localhost:8080/collections/addBook", {
        collectionId: selectedCollection,
        bookId: selectedBook,
      });

      alert("Book added to collection successfully!");
    } catch (error) {
      console.error("Error adding book to collection:", error);
    }
  };

  return (
    <div className="collection-page">
      <h1>Manage Your Book Collections</h1>

      {/* Create New Collection */}
      <div className="collection-form">
        <input
          type="text"
          placeholder="Enter collection name"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
        />
        <button onClick={handleCreateCollection}>Create Collection</button>
      </div>

      {/* Select Collection to Add Books */}
      <div className="collection-select">
        <h2>Add Book to Collection</h2>
        <select onChange={(e) => setSelectedCollection(e.target.value)}>
          <option value="">Select a collection</option>
          {collections.map((collection) => (
            <option key={collection.id} value={collection.id}>
              {collection.name}
            </option>
          ))}
        </select>

        <select onChange={(e) => setSelectedBook(e.target.value)}>
          <option value="">Select a book</option>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title}
            </option>
          ))}
        </select>

        <button onClick={handleAddBookToCollection}>Add Book</button>
      </div>

      {/* Existing Collections */}
      <div className="collections-list">
        <h2>Your Collections</h2>
        <ul>
          {collections.map((collection) => (
            <li key={collection.id}>{collection.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CollectionPage;
