/* src/SearchBar.js */
import React from 'react';
import './SearchBar.css'; 

function SearchBar() {
    return (
        <div className="search-bar">
            <input type="text" placeholder="Search..." />
            <button className="search-button">Search</button>
        </div>
    );
}

export default SearchBar;
