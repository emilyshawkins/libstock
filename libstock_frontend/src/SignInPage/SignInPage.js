// src/SignInPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignInPage.css';

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            alert('All fields are required!');
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:8080/user/login', 
                { email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log('Login successful:', response.data);

            // Redirect to the homepage upon successful login
            navigate('/user/home');
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || 'Your email or passwork is incorrect'
            );
            console.error('Login error:', error);
        }
    };

    return (
        <div className="signin-container">
            <h2>Sign In</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
            <form onSubmit={handleSubmit} className="signin-form">
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="signin-button">Sign In</button>
                <div className="signup-link">
                    <span>Don't have an account? 
                        <Link to="/signup"> Sign Up!</Link>
                    </span>
                </div>
            </form>
        </div>
    );
}

export default SignInPage;
