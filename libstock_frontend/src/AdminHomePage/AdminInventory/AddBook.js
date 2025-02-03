import React, { useState } from "react";
import "./AddBook.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function AddBook() {
  const [isbn, setISBN] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [price, setPrice] = useState("");
  const [purchaseable, setPurchaseable] = useState(false);
  const [count, setCount] = useState("");
  const [numCheckedOut, setNumCheckedOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

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
      const response = await axios.post(
        "http://localhost:8080/book/create",
        {
          isbn,
          title,
          summary,
          publicationDate,
          price,
          purchaseable,
          count,
          numCheckedOut,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Book added successfully!", response.data);
      setSuccessMessage("Book added successfully!");
      navigate("/books");
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
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit} className="add-book-form">
        <div className="input-group">
          <label htmlFor="isbn">ISBN</label>
          <input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setISBN(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="summary">Summary</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>
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
        <div className="input-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>
            <input
              type="checkbox"
              checked={purchaseable}
              onChange={(e) => setPurchaseable(e.target.checked)}
            />
            Purchaseable
          </label>
        </div>
        <div className="input-group">
          <label htmlFor="count">Total Count</label>
          <input
            type="number"
            id="count"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="numCheckedOut">Number Checked Out</label>
          <input
            type="number"
            id="numCheckedOut"
            value={numCheckedOut}
            onChange={(e) => setNumCheckedOut(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Adding Book..." : "Add Book"}
        </button>
      </form>
    </div>
  );
}

export default AddBook;
