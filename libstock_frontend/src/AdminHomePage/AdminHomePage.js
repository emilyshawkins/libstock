// src/AdminHomePage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AdminHomePage.css";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [borrowedItems, setBorrowedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch borrowed items from the server when the component mounts
  useEffect(() => {
    async function fetchBorrowedItems() {
      try {
        const response = await axios.get("http://localhost:3000/admin/home");
        setBorrowedItems(response.data);
        setFilteredItems(response.data);
      } catch (error) {
        console.error("Error fetching borrowed items:", error);
      }
    }
    fetchBorrowedItems();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = borrowedItems.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };

  // Handle item management (e.g., return/renew an item)
  const handleManageItem = (itemId) => {
    // Example: Send a request to the server to manage the item
    console.log(`Managing item with ID: ${itemId}`);
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    // Perform logout logic here
  };

  return (
    <div className="home-container">
      <h1>Welcome to Your Dashboard</h1>
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
              <h2>User Name </h2>
              <p> Email@gmail.com </p>
              <Link to="/account-settings" className="dropdown-item">
                Account Settings
              </Link>
              <Link to="/signin" className="dropdown-item">
                Log Out
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="main-content">
        <div className="left-bar">
          <div className="logo-container">
            {/* Wrap logo with Link for navigation */}
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
      <div className="items-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>Due Date: {item.dueDate}</p>
              <button
                onClick={() => handleManageItem(item.id)}
                className="manage-button"
              >
                Manage
              </button>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
