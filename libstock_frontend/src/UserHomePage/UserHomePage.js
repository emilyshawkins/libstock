/* src/UserHomePage.js */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './UserHomePage.css';

function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [borrowedItems, setBorrowedItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '' });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserData() {
            setLoading(true);
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.error("No user ID found!");
                    window.alert("User ID not found. Please log in again.");
                    navigate('/signin');
                    return;
                }

                const userResponse = await axios.get(`http://localhost:8080/user/get?id=${userId}`);
                if (userResponse.data) {
                    setUserInfo({
                        firstName: userResponse.data.firstName || 'Unknown',
                        lastName: userResponse.data.lastName || '',
                        email: userResponse.data.email || 'No email available'
                    });
                }

                const itemsResponse = await axios.get('http://localhost:8080/user/home');
                setBorrowedItems(itemsResponse.data);
                setFilteredItems(itemsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                window.alert('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, [navigate]);

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = borrowedItems.filter((item) =>
            item.name.toLowerCase().includes(query)
        );
        setFilteredItems(filtered);
    };

    const handleManageItem = (itemId) => {
        console.log(`Managing item with ID: ${itemId}`);
    };

    return (
        <div className="home-container">
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
                <div className="items-list">
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item) => (
                            <div key={item.id} className="item-card">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                                <p>Due Date: {item.dueDate}</p>
                                <button onClick={() => handleManageItem(item.id)} className="manage-button">
                                    Manage
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No items found</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default HomePage;

