// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './Navbar'; // Import Navbar
import SignInPage from './SignInPage'; // Import SignInPage
import SignUpPage from './SignUpPage'; // Import SignUpPage
import UserHomePage from './UserHomePage'; // Import UserHomePage

function App() {
    return (
        <Router>
            <MainContent />
        </Router>
    );
}

function MainContent() {
    const location = useLocation(); // Get the current route path

    // Determine if Navbar should be displayed
    const isNavbarVisible = location.pathname !== '/user/home';

    return (
        <>
            {/* Display Navbar only if not on /user/home */}
            {isNavbarVisible && <Navbar />}
            <Routes>
                <Route path="/" element={<Home />} /> {/* Home page */}
                <Route path="/signin" element={<SignInPage />} /> {/* Sign In page */}
                <Route path="/signup" element={<SignUpPage />} /> {/* Sign Up page */}
                <Route path="/user/home" element={<UserHomePage />} /> {/* User Home page */}
                <Route path="*" element={<NotFound />} /> {/* Catch-all route */}
            </Routes>
        </>
    );
}

function Home() {
    return <h1>Welcome to LibStock</h1>; // Placeholder home page
}

function NotFound() {
    return <h1>404 - Page Not Found</h1>; // Catch-all page
}

export default App;
