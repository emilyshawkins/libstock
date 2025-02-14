import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserHomePage.css';

function UserHomePage() {
    const [databaseBooks, setDatabaseBooks] = useState([]); // Books in DB
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]); // Books after filtering
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const mounted = useRef(false); // Prevents unnecessary re-renders

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true;
            fetchUserData();
        }
    }, []);

    async function fetchUserData() {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                alert("User ID not found. Please log in again.");
                navigate('/signin');
                return;
            }

            // Fetch user data
            const userResponse = await axios.get(`http://localhost:8080/user/get?id=${userId}`);
            if (userResponse.data) {
                setUserInfo({
                    firstName: userResponse.data.firstName || 'Unknown',
                    lastName: userResponse.data.lastName || '',
                    email: userResponse.data.email || 'No email available',
                });
                setIsAdmin(userResponse.data.isAdmin || false);
            }

            // Fetch borrowed items
            const itemsResponse = await axios.get('http://localhost:8080/user/home');
            setDatabaseBooks(itemsResponse.data);
            setFilteredBooks(itemsResponse.data);

        } catch (err) {
            console.error('Error fetching data:', err);
            alert('Failed to load data. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const removeBook = async (id) => {
        try {
          await axios.delete(`http://localhost:8080/book/delete?id=${id}`);
          setDatabaseBooks((prevBooks) =>
            prevBooks.filter((book) => book.id !== id)
          );
          setFilteredBooks((prevBooks) =>
            prevBooks.filter((book) => book.id !== id)
          );
        } catch (error) {
          console.error("Error deleting book", error);
        }
    };

    // Handle Search Input
    const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = databaseBooks.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

    // Organizing books alphabetically
    const booksByLetter = filteredBooks.reduce((acc, book) => {
        const firstLetter = book.title[0].toUpperCase();
        if (!acc[firstLetter]) acc[firstLetter] = [];
        acc[firstLetter].push(book);
        return acc;
    }, {});

    const handleManageItem = (itemId) => {
        console.log(`Managing item with ID: ${itemId}`);
    };

    return (
        <div className="home-container">
            <h1>Welcome, {userInfo.firstName} {userInfo.lastName}</h1>
            {isAdmin && <p>You have admin privileges.</p>}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="content">
                <p>Manage your borrowed items and account here.</p>
            </div>
            {loading ? <p>Loading items...</p> : (
                <div className="book-list">
                <h2>Your Rented Textbooks</h2>
                <span className="book-count">Total Books: {filteredBooks.length}</span>
                {filteredBooks.length > 0 ? (
                  Object.keys(booksByLetter)
                    .sort()
                    .map((letter) => (
                      <div key={letter} className="book-section">
                        <h2 className="section-title">{letter}</h2>
                        <div className="book-grid">
                          {booksByLetter[letter].map((book) => (
                            <div key={book.isbn} className="book-card">
                              <h3>{book.title}</h3>
                              <p><strong>Author:</strong> {book.author || "Unknown Author"}</p>
                              <p><strong>ISBN:</strong> {book.isbn}</p>
                              <p><strong>Publisher:</strong> {book.publisher || "Unknown Publisher"}</p>
                              <p><strong>Publication Date:</strong> {book.publicationDate}</p>
                              <button onClick={() => removeBook(book.id)}>Remove</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No books in the database.</p>
                )}
              </div>
            )}
        </div>
    );
}

export default UserHomePage;
