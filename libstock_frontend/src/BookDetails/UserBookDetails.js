import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./UserBookDetails.css";

const BookDetails = () => {
  const [book, setBook] = useState(null);
  const [author, setAuthor] = useState("Unknown Author");
  const [genres, setGenres] = useState("Unknown Genre");
  const location = useLocation();

  // Extract book ID from URL
  const queryParams = new URLSearchParams(location.search);
  const bookId = queryParams.get("id");

  useEffect(() => {
    if (!bookId) return;

    const fetchBookDetails = async () => {
      try {
        // Fetch book details
        const bookResponse = await axios.get(
          `http://localhost:8080/book/read?id=${bookId}`
        );
        setBook(bookResponse.data);

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

  if (!book) {
    return <p>Loading book details...</p>;
  }

  return (
    <div className="UserBook-details-container">
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
      <p>
        <strong>Checked Out:</strong> {book.numCheckedOut}
      </p>
    </div>
  );
};

export default BookDetails;
