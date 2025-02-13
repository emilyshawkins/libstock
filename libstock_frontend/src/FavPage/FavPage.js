// src/FavoritePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./FavPage.css";

const FavoritePage = () => {
    const [favorites, setFavorites] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    useEffect(() => {
        fetchFavorites();
    }, []);

    // Fetch favorite items
    const fetchFavorites = async () => {
        try {
            const userId = localStorage.getItem("userId");
            const response = await axios.get(`http://localhost:8080/user/favorites?id=${userId}`);
            setFavorites(response.data);
        } catch (error) {
            console.error("Error fetching favorite items:", error);
        }
    };

    // Remove item from favorites
    const removeFavorite = async (itemId) => {
        try {
            await axios.delete(`http://localhost:8080/user/favorites/remove?id=${itemId}`);
            setFavorites(favorites.filter(item => item.id !== itemId));
        } catch (error) {
            console.error("Error removing favorite item:", error);
        }
    };

    // Start editing an item
    const startEditing = (item) => {
        setEditingItem(item.id);
        setEditedTitle(item.title);
        setEditedDescription(item.description);
    };

    // Save edited item
    const saveEdit = async (itemId) => {
        try {
            await axios.patch(`http://localhost:8080/user/favorites/edit?id=${itemId}`, {
                title: editedTitle,
                description: editedDescription
            });
            setFavorites(favorites.map(item =>
                item.id === itemId ? { ...item, title: editedTitle, description: editedDescription } : item
            ));
            setEditingItem(null);
        } catch (error) {
            console.error("Error updating item:", error);
        }
    };

    // Share favorite item (copy link)
    const shareItem = (itemId) => {
        const shareLink = `http://localhost:3000/user/favorite/${itemId}`;
        navigator.clipboard.writeText(shareLink);
        alert("Link copied to clipboard!");
    };

    return (
        <div className="favorite-container">
            <h1>My Favorite Items</h1>
            {favorites.length === 0 ? (
                <p>No favorite items found.</p>
            ) : (
                <div className="favorite-list">
                    {favorites.map(item => (
                        <div key={item.id} className="favorite-card">
                            {editingItem === item.id ? (
                                <div className="edit-container">
                                    <input
                                        type="text"
                                        value={editedTitle}
                                        onChange={(e) => setEditedTitle(e.target.value)}
                                    />
                                    <textarea
                                        value={editedDescription}
                                        onChange={(e) => setEditedDescription(e.target.value)}
                                    />
                                    <button onClick={() => saveEdit(item.id)}>Save</button>
                                    <button onClick={() => setEditingItem(null)}>Cancel</button>
                                </div>
                            ) : (
                                <>
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                    <div className="favorite-actions">
                                        <button onClick={() => shareItem(item.id)}>Share</button>
                                        <button onClick={() => startEditing(item)}>Edit</button>
                                        <button onClick={() => removeFavorite(item.id)} className="remove-btn">Remove</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritePage;
