import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CustomListPage.css";

const CustomListPage = ({ currentUser }) => {
  const [customLists, setCustomLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [selectedListBooks, setSelectedListBooks] = useState([]);
  const [selectedListName, setSelectedListName] = useState("");
  const [newListName, setNewListName] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all custom lists for the current user
  useEffect(() => {
    if (!currentUser?.email) return;

    axios
      .get("/customList/findByEmail", {
        params: { email: currentUser.email },
      })
      .then((res) => {
        const lists = res.data || [];
        setCustomLists(lists);

        if (lists.length > 0) {
          setSelectedListId(lists[0].id);
          setSelectedListName(lists[0].listName);
        }
      })
      .catch((err) => {
        console.error("Error fetching custom lists:", err);
        setMessage("Failed to load lists.");
      });
  }, [currentUser]);

  // Fetch books for selected list
  useEffect(() => {
    if (!selectedListId) return;

    axios
      .get("/customList/read", {
        params: { id: selectedListId },
      })
      .then(async (res) => {
        const list = res.data;
        setSelectedListName(list.listName);

        const bookResponses = await Promise.all(
          list.bookIds.map((isbn) =>
            axios.get("/books/isbn", { params: { isbn } }).then((r) => r.data)
          )
        );
        setSelectedListBooks(bookResponses);
      })
      .catch((err) => {
        console.error("Error fetching list books:", err);
        setMessage("Failed to load books.");
      });
  }, [selectedListId]);

  const handleCreateList = () => {
    if (!newListName.trim()) {
      setMessage("List name cannot be empty.");
      return;
    }

    axios
      .post("/customList/create", {
        email: currentUser.email,
        listName: newListName.trim(),
      })
      .then((res) => {
        setMessage("List created successfully.");
        setCustomLists((prev) => [...prev, res.data]);
        setNewListName("");
      })
      .catch((err) => {
        console.error("Error creating list:", err);
        setMessage("Failed to create list.");
      });
  };

  const handleChange = (e) => {
    setSelectedListId(e.target.value);
  };

  return (
    <div className="custom-list-page">
      <h2>Your Custom Lists</h2>

      {message && <p className="action-message">{message}</p>}

      <div className="create-list-form">
        <input
          type="text"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          placeholder="New List Name"
          className="input-field"
        />
        <button onClick={handleCreateList} className="create-list-button">
          Create List
        </button>
      </div>

      {customLists.length > 0 ? (
        <>
          <select
            value={selectedListId}
            onChange={handleChange}
            className="dropdown"
          >
            {customLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.listName}
              </option>
            ))}
          </select>

          <h3>{selectedListName}</h3>

          <div className="book-grid">
            {selectedListBooks.length > 0 ? (
              selectedListBooks.map((book) => (
                <div className="book-card" key={book.ISBN}>
                  <img
                    src={book.coverImage || "/placeholder.png"}
                    alt={book.title}
                  />
                  <div className="book-details">
                    <h4>{book.title}</h4>
                    <p>{book.author}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No books in this list.</p>
            )}
          </div>
        </>
      ) : (
        <p>You have no custom lists yet.</p>
      )}
    </div>
  );
};

export default CustomListPage;
