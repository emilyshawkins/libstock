/*src/AddBook/ManualAdd.js*/

import React, { useState } from "react";
import "./ManualAdd.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function AddBook() {
  // State variables for form inputs
  const [isbn, setISBN] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [price, setPrice] = useState("");
  const [purchasable, setPurchasable] = useState(false);
  const [count, setCount] = useState("");
  const [numCheckedOut, setNumCheckedOut] = useState("");

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Handles form submission and sends book data to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validate required fields
    if (
      !isbn ||
      !title ||
      !summary ||
      !publicationDate ||
      !price ||
      count === "" ||
      numCheckedOut === ""
    ) {
      setErrorMessage("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      // Send request to create a new book in the database
      const response = await axios.post(
        "http://localhost:8080/book/create",
        {
          isbn,
          title,
          summary,
          publicationDate,
          price,
          purchasable,
          count,
          numCheckedOut,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Book added successfully!", response.data);
      setSuccessMessage("Book added successfully!");

      // Redirect to the inventory page after successful addition
      navigate("/admin/inventory");
    } catch (error) {
      console.error("Error adding book", error);
      setErrorMessage(error.response?.data?.message || "Failed to add book.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add a New Book</h2>

      {/* Display error or success messages */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="add-book-form">
        {/* ISBN Field */}
        <div className="input-group">
          <label htmlFor="isbn">ISBN</label>
          <input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setISBN(e.target.value)}
            placeholder="Enter ISBN (e.g., 978-3-16-148410-0)"
            required
          />
        </div>

        {/* Title Field */}
        <div className="input-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            required
          />
        </div>

        {/* Summary Field */}
        <div className="input-group">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter book summary"
            required
          />
        </div>

        {/* Publication Date Field */}
        <div className="input-group">
          <label htmlFor="publicationDate">Publication Date</label>
          <input
            type="date"
            id="publicationDate"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
            required
          />
        </div>

        {/* Price Field */}
        <div className="input-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter book price"
            required
          />
        </div>

        {/* Purchasable Checkbox */}
        <div className="input-group purchasable-group">
          <label htmlFor="purchasable">Purchasable</label>
          <input
            type="checkbox"
            id="purchasable"
            checked={purchasable}
            onChange={(e) => setPurchasable(e.target.checked)}
          />
        </div>

        {/* Total Count Field */}
        <div className="input-group">
          <label htmlFor="count">Total Count</label>
          <input
            type="number"
            id="count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="Enter total book count"
            required
          />
        </div>

        {/* Number Checked Out Field */}
        <div className="input-group">
          <label htmlFor="numCheckedOut">Number Checked Out</label>
          <input
            type="number"
            id="numCheckedOut"
            value={numCheckedOut}
            onChange={(e) => setNumCheckedOut(e.target.value)}
            placeholder="Enter number of checked-out books"
            required
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding Book..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}

export default AddBook;
