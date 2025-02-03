/* src/Navbar/Sidebar.js */
import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css"; // Ensure correct styles

function Sidebar() {
    return (
        <div className="left-bar">
            <div className="logo-container">
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="logo" />
                </Link>
                <h1 className="site-title">LibStock</h1>
            </div>

            {/* Use <Link> instead of <button> for navigation */}
            <Link to="/user/bestseller" className="left-bar-button">Bestseller</Link>
            <Link to="/user/collection" className="left-bar-button">Collection</Link>
            <Link to="/user/wishlist" className="left-bar-button">Wishlist</Link>
            <Link to="/user/favorite" className="left-bar-button">Favorite</Link>
            <Link to="/user/inventory" className="left-bar-button">Inventory Setting</Link>
        </div>
    );
}

export default Sidebar;

