// src/CustomListPage/CustomListPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CustomListPage.css";

const CustomListPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [customLists, setCustomLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [listBooks, setListBooks] = useState([]);
  const [bookAuthors, setBookAuthors] = useState({});
  const [bookGenres, setBookGenres] = useState({});
  const [newListTitle, setNewListTitle] = useState("");
  const [newBookISBN, setNewBookISBN] = useState("");

  useEffect(() => {
    if (userId) fetchUserCustomLists();
  }, [userId]);

  useEffect(() => {
    if (selectedListId) fetchBooksForList(selectedListId);
  }, [selectedListId]);

  const fetchUserCustomLists = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/custom_list/get_by_user?userId=${userId}`);
      setCustomLists(res.data);
      if (res.data.length > 0) setSelectedListId(res.data[0].id);
    } catch (error) {
      console.error("Error fetching custom lists:", error);
    }
  };

  const fetchBooksForList = async (listId) => {
    try {
      const res = await axios.get(`http://localhost:8080/custom_list/get_books_by_list?listId=${listId}`);
      setListBooks(res.data);
      fetchAuthors(res.data);
      fetchGenres(res.data);
    } catch (error) {
      console.error("Error fetching books in custom list:", error);
    }
  };

  const fetchAuthors = async (books) => {
    const authorsMap = {};
    for (const book of books) {
      try {
        const res = await axios.get(`http://localhost:8080/bookauthor/get_authors_by_book?bookId=${book.id}`);
        authorsMap[book.id] = res.data.map(a => `${a.firstName} ${a.lastName}`);
      } catch {
        authorsMap[book.id] = ["Unknown Author"];
      }
    }
    setBookAuthors(authorsMap);
  };

  const fetchGenres = async (books) => {
    const genresMap = {};
    for (const book of books) {
      try {
        const res = await axios.get(`http://localhost:8080/bookgenre/get_genres_by_book?bookId=${book.id}`);
        genresMap[book.id] = res.data.map(g => g.name);
      } catch {
        genresMap[book.id] = ["Unknown Genre"];
      }
    }
    setBookGenres(genresMap);
  };

  const handleCreateList = async () => {
    if (!newListTitle.trim()) return;
    try {
      await axios.post("http://localhost:8080/custom_list/create", {
        userId,
        title: newListTitle,
        isbn: newBookISBN || null
      });
      setNewListTitle("");
      setNewBookISBN("");
      fetchUserCustomLists();
    } catch (error) {
      console.error("Error creating custom list:", error);
    }
  };

  const handleBookClick = (bookId) => {
    const book = listBooks.find((b) => b.id === bookId);
    navigate(`/user/home/book?id=${bookId}`, {
      state: {
        book,
        author: bookAuthors[bookId]?.join(", ") || "Unknown Author",
        genre: bookGenres[bookId]?.join(", ") || "Unknown Genre"
      }
    });
  };

  return (
    <div className="customlist-container">
      <h1>Your Custom Book Lists</h1>

      {/* Create new list */}
      <div className="new-list-form">
        <input
          type="text"
          placeholder="List title"
          value={newListTitle}
          onChange={(e) => setNewListTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Optional Book ISBN"
          value={newBookISBN}
          onChange={(e) => setNewBookISBN(e.target.value)}
        />
        <button onClick={handleCreateList}>Create List</button>
      </div>

      {/* Select list */}
      <div className="list-selector">
        <label>Select a list: </label>
        <select
          value={selectedListId || ""}
          onChange={(e) => setSelectedListId(e.target.value)}
        >
          {customLists.map((list) => (
            <option key={list.id} value={list.id}>
              {list.title}
            </option>
          ))}
        </select>
      </div>

      {/* Books in selected list */}
      <div className="book-grid">
        {listBooks.length > 0 ? (
          listBooks.map((book) => (
            <div key={book.id} className="book-card" onClick={() => handleBookClick(book.id)}>
              <h3>{book.title}</h3>
              <p><strong>ISBN:</strong> {book.isbn}</p>
              <p><strong>Author:</strong> {bookAuthors[book.id]?.join(", ") || "Unknown"}</p>
              <p><strong>Genre:</strong> {bookGenres[book.id]?.join(", ") || "Unknown"}</p>
              <p><strong>Publication:</strong> {book.publicationDate}</p>
              <p><strong>Price:</strong> ${book.price?.toFixed(2) || "N/A"}</p>
            </div>
          ))
        ) : (
          <p>No books in this list.</p>
        )}
      </div>
    </div>
  );
};

export default CustomListPage;
