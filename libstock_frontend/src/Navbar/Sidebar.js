/* src/Navbar/Sidebar.js */
import React from "react";
import { Link,useNavigate } from 'react-router-dom';  
import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate(); 
    return (
        <div className="left-bar">
            <div className="logo-container">
            <Link to="/user/home">
                    <img src="/logo.png" alt="Logo" className="logo" />
                </Link>
                <h1 className="site-title">LibStock</h1>
            </div> 
            <div className="left-bar-container">
                <button onClick={() => navigate("/user/home")} className="left-bar-button">
                    Dashboard
                </button>
                <button onClick={() => navigate("/user/renting")} className="left-bar-button">
                    My Books
                </button>
                <button onClick={() => navigate("/user/wishlist")} className="left-bar-button">
                    Wishlist
                </button>
                <button onClick={() => navigate("/user/favorite")} className="left-bar-button">
                    Favorite Items
                </button>
                <button onClick={() => navigate("/user/customList")} className="left-bar-button">
                    Custom Lists
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
