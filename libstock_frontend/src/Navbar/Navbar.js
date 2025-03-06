/* src/Navbar/Navbar.js */
import React from 'react';
import { Link } from 'react-router-dom'; 
import './Navbar.css';

function Navbar() {
    return (
        <header className="header">
            <div className="logo-container">
                <Link to="/">
                    <img src="/logo.png" alt="Logo" className="logo" />
                </Link>
                <h1 className="site-title">LibStock</h1>
            </div>
            <div className="main-nav">
                <div className="button-container">
                    <Link to="/">
                        <button className="nav-button">Home</button>
                    </Link>
                </div>
                <div className="button-container">
                    <button className="nav-button">About</button>
                </div>
                <div className="button-container">
                    <button className="nav-button">Contact</button>
                </div>
                <div className="button-container">
                    <Link to="/signin">
                        <button className="nav-button">Sign In</button>
                    </Link>
                    <div className="signup-link">
                        <span>Don't have an account? 
                            <Link to="/signup"> Sign Up!</Link>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
