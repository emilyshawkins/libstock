/* src/UserHomePage.js */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './UserHomePage.css';

function HomePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [borrowedItems, setBorrowedItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: '', email: '' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserData() {
            setLoading(true);
            try {
                // Get user ID from localStorage (or sessionStorage)
                const userId = localStorage.getItem('userId'); // Ensure this is stored after login

                if (!userId) {
                    console.error("No user ID found!");
                    setError("User ID not found. Please log in again.");
                    return;
                }

                // Fetch user info using new endpoint
                const userResponse = await axios.get(`http://localhost:8080/get?id=${userId}`);
                setUserInfo(userResponse.data);

                // Fetch borrowed items
                const itemsResponse = await axios.get('http://localhost:8080/user/home');
                setBorrowedItems(itemsResponse.data);
                setFilteredItems(itemsResponse.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        }
        fetchUserData();
    }, []);

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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('userId'); // Clear user session
        navigate('/signin');
    };

    return (
        <div className="home-container">
            <h1>Welcome to Your Dashboard</h1>
            {error && <p className="error-message">{error}</p>}
            <div className="top-bar">
                <div className="notification-icon">
                    <img src="/notification-icon.png" alt="Notifications" />
                </div>
                <div className="user-icon-container">
                    <img
                        src="/user-icon.png"
                        alt="User Account"
                        className="user-icon"
                        onClick={toggleDropdown}
                    />
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <div className="dropdown-user-info">
                                <p><strong>{userInfo.name}</strong></p>
                                <p>{userInfo.email}</p>
                            </div>
                            <Link to="/account-settings" className="dropdown-item">
                                Account Settings
                            </Link>
                            <button className="dropdown-item logout-button" onClick={handleLogout}>
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="main-content">
                <div className="left-bar">
                    <div className="logo-container">
                        <Link to="/">
                            <img src="/logo.png" alt="Logo" className="logo" />
                        </Link>
                        <h1 className="site-title">LibStock</h1>
                    </div>
                    <button className="left-bar-button">Bestseller</button>
                    <button className="left-bar-button">Collection</button>
                    <button className="left-bar-button">Wishlist</button>
                    <button className="left-bar-button">Favorite</button>
                    <button className="left-bar-button">Inventory Setting</button>
                </div>
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
