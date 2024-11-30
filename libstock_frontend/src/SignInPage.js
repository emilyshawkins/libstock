// src/SignInPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SignInPage.css'; 

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle sign-in logic here (e.g., authentication)
        console.log('Sign In attempt with', email, password);
    };

    return (
        <div className="signin-container">
            <h2>Admin Sign In</h2>
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
