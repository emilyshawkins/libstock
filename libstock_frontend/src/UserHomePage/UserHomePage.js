// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './UserHomePage.css';

// function UserHomePage() {
//     const [databaseBooks, setDatabaseBooks] = useState([]); // Books in DB
//     const [searchQuery, setSearchQuery] = useState('');
//     const [filteredBooks, setFilteredBooks] = useState([]); // Books after filtering
//     const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '' });
//     const [loading, setLoading] = useState(true);
//     const [isAdmin, setIsAdmin] = useState(false);
//     const navigate = useNavigate();
//     const mounted = useRef(false); // Prevents unnecessary re-renders

//     useEffect(() => {
//         if (!mounted.current) {
//             mounted.current = true;
//             fetchUserData();
//         }
//     }, []);

//     async function fetchUserData() {
//         setLoading(true);
//         try {
//             const userId = localStorage.getItem('userId');
//             if (!userId) {
//                 alert("User ID not found. Please log in again.");
//                 navigate('/signin');
//                 return;
//             }

//             // Fetch user data
//             const userResponse = await axios.get(`http://localhost:8080/user/get?id=${userId}`);
//             if (userResponse.data) {
//                 setUserInfo({
//                     firstName: userResponse.data.firstName || 'Unknown',
//                     lastName: userResponse.data.lastName || '',
//                     email: userResponse.data.email || 'No email available',
//                 });
//                 setIsAdmin(userResponse.data.isAdmin || false);
//             }

//             // Fetch borrowed items
//             const itemsResponse = await axios.get('http://localhost:8080/user/home');
//             setDatabaseBooks(itemsResponse.data);
//             setFilteredBooks(itemsResponse.data);

//         } catch (err) {
//             console.error('Error fetching data:', err);
//             alert('Failed to load data. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     }

//     const removeBook = async (id) => {
//         try {
//           await axios.delete(`http://localhost:8080/book/delete?id=${id}`);
//           setDatabaseBooks((prevBooks) =>
//             prevBooks.filter((book) => book.id !== id)
//           );
//           setFilteredBooks((prevBooks) =>
//             prevBooks.filter((book) => book.id !== id)
//           );
//         } catch (error) {
//           console.error("Error deleting book", error);
//         }
//     };

//     // Handle Search Input
//     const handleSearchChange = (e) => {
//     const query = e.target.value.toLowerCase();
//     setSearchQuery(query);
//     const filtered = databaseBooks.filter((book) =>
//       book.title.toLowerCase().includes(query)
//     );
//     setFilteredBooks(filtered);
//   };

//     // Organizing books alphabetically
//     const booksByLetter = filteredBooks.reduce((acc, book) => {
//         const firstLetter = book.title[0].toUpperCase();
//         if (!acc[firstLetter]) acc[firstLetter] = [];
//         acc[firstLetter].push(book);
//         return acc;
//     }, {});

//     const handleManageItem = (itemId) => {
//         console.log(`Managing item with ID: ${itemId}`);
//     };

//     return (
//         <div className="home-container">
//             <h1>Welcome, {userInfo.firstName} {userInfo.lastName}</h1>
//             {isAdmin && <p>You have admin privileges.</p>}
//             <div className="search-bar">
//                 <input
//                     type="text"
//                     placeholder="Search items..."
//                     value={searchQuery}
//                     onChange={handleSearchChange}
//                 />
//             </div>
//             <div className="content">
//                 <p>Manage your borrowed items and account here.</p>
//             </div>
//             {loading ? <p>Loading items...</p> : (
//                 <div className="book-list">
//                 <h2>Your Rented Textbooks</h2>
//                 <span className="book-count">Total Books: {filteredBooks.length}</span>
//                 {filteredBooks.length > 0 ? (
//                   Object.keys(booksByLetter)
//                     .sort()
//                     .map((letter) => (
//                       <div key={letter} className="book-section">
//                         <h2 className="section-title">{letter}</h2>
//                         <div className="book-grid">
//                           {booksByLetter[letter].map((book) => (
//                             <div key={book.isbn} className="book-card">
//                               <h3>{book.title}</h3>
//                               <p><strong>Author:</strong> {book.author || "Unknown Author"}</p>
//                               <p><strong>ISBN:</strong> {book.isbn}</p>
//                               <p><strong>Publisher:</strong> {book.publisher || "Unknown Publisher"}</p>
//                               <p><strong>Publication Date:</strong> {book.publicationDate}</p>
//                               <button onClick={() => removeBook(book.id)}>Remove</button>
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ))
//                 ) : (
//                   <p>No books in the database.</p>
//                 )}
//               </div>
//             )}
//         </div>
//     );
// }

// export default UserHomePage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";


const UserHomePage = () => {
  // State for storing books from the database
  const [databaseBooks, setDatabaseBooks] = useState([]);

  // State for storing authors linked to books
  const [bookAuthors, setBookAuthors] = useState({});

  // State for filtered books (for search functionality)
  const [filteredBooks, setFilteredBooks] = useState([]);

  // State for search input
  const [searchQuery, setSearchQuery] = useState("");

  // State for add/remove favorite items
  const [favoriteBooks, setFavoriteBooks] = useState(new Set());

  // Fetch books and authors when the component mounts
  useEffect(() => {
    fetchBooks();
    fetchBookAuthors();
    fetchUserFavorites();
  }, []);

  // Fetch all books from the database
  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/book/get_all");
      setDatabaseBooks(response.data);
      setFilteredBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  // Fetch book-author relationships and store them
  const fetchBookAuthors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/bookauthor/read_all"
      );
      const bookAuthorMappings = response.data;

      const authorDetails = {};

      // Fetch each author linked to a book
      for (const mapping of bookAuthorMappings) {
        const authorResponse = await axios.get(
          `http://localhost:8080/author/read?id=${mapping.authorId}`
        );

        if (authorResponse.data) {
          if (!authorDetails[mapping.bookId]) {
            authorDetails[mapping.bookId] = [];
          }
          authorDetails[mapping.bookId].push(
            `${authorResponse.data.firstName} ${authorResponse.data.lastName}`
          );
        }
      }

      setBookAuthors(authorDetails);
    } catch (error) {
      console.error("Error fetching book authors:", error);
    }
  };

   // Fetch user's favorite books
   const fetchUserFavorites = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await axios.get(`http://localhost:8080/user/favorites?id=${userId}`);
      const favoriteBookIds = new Set(response.data.map(book => book.id));
      setFavoriteBooks(favoriteBookIds);
    } catch (error) {
      console.error("Error fetching favorite books:", error);
    }
  };

  // Toggle book favorite status
  const handleFavoriteToggle = async (bookId) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      if (favoriteBooks.has(bookId)) {
        // Remove from favorites
        await axios.delete(`http://localhost:8080/user/remove_favorite?id=${userId}&bookId=${bookId}`);
        setFavoriteBooks(prev => {
          const updatedFavorites = new Set(prev);
          updatedFavorites.delete(bookId);
          return updatedFavorites;
        });
      } else {
        // Add to favorites
        await axios.post(`http://localhost:8080/user/add_favorite`, { userId, bookId });
        setFavoriteBooks(prev => { 
          const updatedFavorites = new Set(prev);
          updatedFavorites.add(bookId);
          return updatedFavorites;
        });
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  // Handle search input and filter books
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter books that match the search query
    const filtered = databaseBooks.filter((book) =>
      book.title.toLowerCase().includes(query)
    );
    setFilteredBooks(filtered);
  };

  // Organize books alphabetically
  const booksByLetter = filteredBooks.reduce((acc, book) => {
    const firstLetter = book.title[0].toUpperCase();
    if (!acc[firstLetter]) acc[firstLetter] = [];
    acc[firstLetter].push(book);
    return acc;
  }, {});

  return (
    <div className="home-container">
      <h1>Welcome to Your Dashboard</h1>

      <div className="main-content">
        {/* Search bar for filtering books */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Display books in the database */}
        <div className="book-list">
          <h2>Books in Database</h2>
          <span className="book-count">
            Total Books: {filteredBooks.length}
          </span>

          {filteredBooks.length > 0 ? (
            Object.keys(booksByLetter)
              .sort()
              .map((letter) => (
                <div key={letter} className="book-section">
                  <h2 className="section-title">{letter}</h2>
                  <div className="book-grid">
                    {booksByLetter[letter].map((book) => (
                      <div key={book.id} className="book-card">
                      {/* Title & Favorite Toggle in the Same Row */}
                      <div className="book-title-container">
                          <h3 className="book-title">{book.title}</h3>
                          
                          {/* Favorite Toggle */}
                          {favoriteBooks.has(book.id) ? (
                              <FavoriteIcon
                              style={{ cursor: "pointer", color: "red", fontSize: "24px", marginLeft: "280px" }}
                              onClick={() => handleFavoriteToggle(book.id)}
                              />
                          ) : (
                              <FavoriteBorderIcon
                                style={{ cursor: "pointer", color: "black", fontSize: "24px", marginLeft: "280px" }}
                                onClick={() => handleFavoriteToggle(book.id)}
                              />
                          )}
                      </div>
                      <p><strong>Author:</strong> {bookAuthors[book.id] ? bookAuthors[book.id].join(", ") : "Unknown Author"}</p>
                      <p><strong>ISBN:</strong> {book.isbn}</p>
                      <p><strong>Publication Date:</strong> {book.publicationDate}</p>
                      <button onClick={() => alert("renew")}>Renew</button>
                      <button onClick={() => alert("return")}>Return</button>
                      <button onClick={() => alert("Edit")}>Edit</button>
                  </div>
                  
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <p>No books in the database.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
