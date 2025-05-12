/* src/BookDetails/BookDetails.js */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import "./BookDetails.css";

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState("Unknown Author");
  const [genres, setGenres] = useState("Unknown Genre");
  const [isEditing, setIsEditing] = useState(false);
  const [editedBook, setEditedBook] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Extract book ID from URL
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get("id");

  useEffect(() => {
    // Check if user is admin
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);

    if (!bookId) return;

    const fetchBookDetails = async () => {
      try {
        // Fetch book details
        const bookResponse = await axios.get(
          `http://localhost:8080/book/read?id=${bookId}`
        );
        setBook(bookResponse.data);
        setEditedBook(bookResponse.data);

        // Fetch authors for the book
        const authorResponse = await axios.get(
          `http://localhost:8080/bookauthor/get_authors_by_book?bookId=${bookId}`
        );
        if (authorResponse.data.length > 0) {
          setAuthor(
            authorResponse.data
              .map((a) => `${a.firstName} ${a.lastName}`)
              .join(", ")
          );
        }

        // Fetch genres for the book
        const genreResponse = await axios.get(
          `http://localhost:8080/bookgenre/get_genres_by_book?bookId=${bookId}`
        );
        if (genreResponse.data.length > 0) {
          setGenres(genreResponse.data.map((genre) => genre.name).join(", "));
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updateData = {
        id: editedBook.id,
        isbn: editedBook.isbn,
        title: editedBook.title,
        summary: editedBook.summary,
        publicationDate: editedBook.publicationDate,
        price: Number(editedBook.price),
        purchasable: Boolean(editedBook.purchasable),
        count: Number(editedBook.count),
        numCheckedOut: Number(editedBook.numCheckedOut || 0),
        cover: editedBook.cover || null
      };

      console.log('Sending update data:', updateData); // Debug log

      const response = await axios.patch(
        "http://localhost:8080/book/update",
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data) {
        setBook(response.data);
        setIsEditing(false);
        alert("Book updated successfully!");
      }
    } catch (error) {
      console.error("Error updating book:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(`Error updating book: ${error.response.data.message || 'Please check the data and try again.'}`);
      } else {
        alert("Error updating book. Please try again.");
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`http://localhost:8080/book/delete?id=${bookId}`);
        alert("Book deleted successfully!");
        navigate("/admin/home");
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Error deleting book. Please try again.");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedBook({
      ...editedBook,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (!book) {
    return <p>Loading book details...</p>;
  }

  return (
    <div className="book-details-container">
      {isAdmin && !isEditing && (
        <div className="admin-actions">
          <Tooltip title="Edit Book">
            <IconButton 
              onClick={handleEdit} 
              className="edit-button"
              style={{
                cursor: "pointer",
                color: "#4CAF50",
                fontSize: "24px",
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Book">
            <IconButton 
              onClick={handleDelete} 
              className="delete-button"
              style={{
                cursor: "pointer",
                color: "#f44336",
                fontSize: "24px",
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      )}

      {isEditing ? (
        <div className="edit-form">
          <h1>
            <input
              type="text"
              name="title"
              value={editedBook.title}
              onChange={handleInputChange}
            />
          </h1>
          <p>
            <strong>ISBN:</strong>{" "}
            <input
              type="text"
              name="isbn"
              value={editedBook.isbn}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Summary:</strong>{" "}
            <textarea
              name="summary"
              value={editedBook.summary}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Publication Date:</strong>{" "}
            <input
              type="text"
              name="publicationDate"
              value={editedBook.publicationDate}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Price:</strong> $
            <input
              type="number"
              name="price"
              value={editedBook.price}
              onChange={handleInputChange}
              step="0.01"
            />
          </p>
          <p>
            <strong>Purchasable:</strong>{" "}
            <input
              type="checkbox"
              name="purchasable"
              checked={editedBook.purchasable}
              onChange={handleInputChange}
            />
          </p>
          <p>
            <strong>Count:</strong>{" "}
            <input
              type="number"
              name="count"
              value={editedBook.count}
              onChange={handleInputChange}
            />
          </p>
          <div className="edit-actions">
            <Tooltip title="Save Changes">
              <IconButton 
                onClick={handleSave} 
                className="save-button"
                style={{
                  cursor: "pointer",
                  color: "#476778",
                  fontSize: "24px",
                }}
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cancel">
              <IconButton
                onClick={() => {
                  setIsEditing(false);
                  setEditedBook(book);
                }}
                className="cancel-button"
                style={{
                  cursor: "pointer",
                  color: "#476778",
                  fontSize: "24px",
                }}
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ) : (
        <>
          <h1>{book.title}</h1>
          <p>
            <strong>ISBN:</strong> {book.isbn}
          </p>
          <p>
            <strong>Summary:</strong> {book.summary}
          </p>
          <p>
            <strong>Author(s):</strong> {author}
          </p>
          <p>
            <strong>Genres:</strong> {genres}
          </p>
          <p>
            <strong>Publication Date:</strong> {book.publicationDate}
          </p>
          <p>
            <strong>Price:</strong> ${book.price.toFixed(2)}
          </p>
          <p>
            <strong>Purchasable:</strong> {book.purchasable ? "Yes" : "No"}
          </p>
          <p>
            <strong>Count:</strong> {book.count}
          </p>
        </>
      )}
    </div>
  );
};

export default BookDetails;
