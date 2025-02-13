/* src/Navbar/AdminSidebar.js */
import React from "react";
import { Link,useNavigate } from 'react-router-dom';  
import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate(); 
    return (
        <div className="left-bar">
            <div className="logo-container">
            <Link to="/admin/home">
                    <img src="/logo.png" alt="Logo" className="logo" />
                </Link>
                <h1 className="site-title">LibStock</h1>
            </div> 
            <div className="left-bar-container">
                <button onClick={() => navigate("/admin/home")} className="left-bar-button">
                    Dashboard
                </button>
                <button onClick={() => navigate("/admin/collection")} className="left-bar-button">
                    Collection
                </button>
                <button onClick={() => navigate("/admin/wishlist")} className="left-bar-button">
                    Wishlist
                </button>
                <button onClick={() => navigate("/admin/favorite")} className="left-bar-button">
                    Favorite
                </button>
                <button onClick={() => navigate("/admin/inventory")} className="left-bar-button">
                    Inventory Setting
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
