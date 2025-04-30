import React from 'react';
import './UserRentingBook.css';

const PurchasedBooks = ({ books, bookAuthors, bookGenres, onBookClick }) => {
  return (
    <div className="books-section">
      <h2>Purchased Books</h2>
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
                <strong>Purchase Date:</strong> {new Date(book.purchaseDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Quantity:</strong> {book.quantity}
              </p>
              <p>
                <strong>Cost:</strong> ${book.cost.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No books purchased yet.</p>
      )}
    </div>
  );
};

export default PurchasedBooks; 