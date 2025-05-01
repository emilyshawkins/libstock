import React from 'react';
import './UserRentingBook.css';

const CheckedOutBooks = ({ books, bookAuthors, bookGenres, onBookClick }) => {
  return (
    <div className="books-section">
      <h2>Checked Out Books</h2>
      {books.length > 0 ? (
        <div className="book-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card" onClick={() => onBookClick(book.id)}>
              <h3>{book.title}</h3>
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
              <p>
                <strong>Author:</strong>{" "}
                {bookAuthors[book.id] ? bookAuthors[book.id].join(", ") : "Unknown Author"}
              </p>
              <p>
                <strong>Genre:</strong>{" "}
                {bookGenres[book.id] ? bookGenres[book.id].join(", ") : "Unknown Genre"}
              </p>
              <p>
                <strong>Checkout Date:</strong> {new Date(book.checkoutDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Due Date:</strong> {new Date(book.dueDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Status:</strong> {book.status}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No books currently checked out.</p>
      )}
    </div>
  );
};

export default CheckedOutBooks; 