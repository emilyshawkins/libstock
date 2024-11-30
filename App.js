// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import SignInPage from './SignInPage';  // Import SignInPage component
import SignUpPage from './SignUpPage';  // Import SignUpPage component

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />  {/* Home page */}
                <Route path="/signin" element={<SignInPage />} />  {/* Sign In page */}
                <Route path="/signup" element={<SignUpPage />} />  {/* Sign Up page */}
            </Routes>
        </Router>
    );
}

function Home() {
    return <h1>Welcome to LibStock</h1>;  // Placeholder home page
}

export default App;
