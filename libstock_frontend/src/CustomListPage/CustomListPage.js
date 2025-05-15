import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './CustomListPage.css';

const CustomListPage = () => {
  const [email] = useState(localStorage.getItem('email') || '');
  const [listName, setListName] = useState('');
  const [isbn, setIsbn] = useState('');
  const [customList, setCustomList] = useState(null);
  const [message, setMessage] = useState('');
  const [allLists, setAllLists] = useState([]);

  const api = axios.create({
    baseURL: 'http://localhost:8080/customList',
  });

  const fetchUserLists = useCallback(async () => {
    if (!email) return;
    try {
      const response = await api.get('/all', { params: { email } });
      setAllLists(response.data.map((list) => list.listName));
    } catch (err) {
      setMessage('Failed to fetch user lists.');
    }
  }, [email, api]);

  useEffect(() => {
    fetchUserLists();
  }, [fetchUserLists]);

  const createList = async () => {
    if (!listName) {
      setMessage('Please enter a list name.');
      return;
    }
    try {
      const response = await api.post('/create', null, {
        params: { email, listName, ISBN: isbn },
      });
      setCustomList(response.data);
      setMessage('List created successfully!');
      fetchUserLists(); // refresh dropdown
    } catch (err) {
      setMessage(err.response?.data || 'Error creating list');
    }
  };

  const addBook = async () => {
    try {
      const response = await api.post('/addBook', null, {
        params: { email, listName, bookId: isbn },
      });
      setCustomList(response.data);
      setMessage('Book added successfully!');
    } catch (err) {
      setMessage(err.response?.data || 'Error adding book');
    }
  };

  const removeBook = async (bookId) => {
    try {
      await api.delete('/removeBook', {
        params: { email, listName, bookId },
      });
      setMessage('Book removed!');
      readList(); // Refresh
    } catch (err) {
      setMessage(err.response?.data || 'Error removing book');
    }
  };

  const readList = async () => {
    try {
      const response = await api.get('/read', {
        params: { email, listName },
      });
      setCustomList(response.data);
      setMessage('List loaded!');
    } catch (err) {
      setMessage('List not found');
      setCustomList(null);
    }
  };

  const deleteList = async () => {
    try {
      await api.delete('/delete', {
        params: { email, listName },
      });
      setCustomList(null);
      setMessage('List deleted!');
      fetchUserLists(); // refresh dropdown
    } catch (err) {
      setMessage('Error deleting list');
    }
  };

  return (
    <div className="customlist-page">
      <h2>Manage Your Custom Book List</h2>

      <div className="form-row">
        <select
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        >
          <option value="">-- Select a list --</option>
          {allLists.map((name, idx) => (
            <option key={idx} value={name}>
              {name}
            </option>
          ))}
        </select>

        <input
          placeholder="Or enter new list name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />

        <input
          placeholder="Book ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
      </div>

      <div className="form-row">
        <button onClick={createList}>Create List</button>
        <button onClick={addBook}>Add Book</button>
        <button onClick={() => removeBook(isbn)}>Remove Book</button>
        <button onClick={readList}>Read List</button>
        <button onClick={deleteList}>Delete List</button>
      </div>

      {message && <p><strong>{message}</strong></p>}

      {customList && (
        <>
          <h3>{customList.listName}</h3>
          <div className="book-grid">
            {customList.bookIds.map((bookId, index) => (
              <div key={index} className="book-card">
                <button
                  className="remove-btn"
                  onClick={() => removeBook(bookId)}
                  title="Remove Book"
                >
                  &times;
                </button>
                <p><strong>ISBN:</strong> {bookId}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomListPage;
