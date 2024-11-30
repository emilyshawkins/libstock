// src/SignUpPage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SignUpPage.css';

function SignUpPage() {
    // State for form fields
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fullName || !email || !password || !phoneNumber) {
            alert('All fields are required!');
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/users/signup', {
                fullName,
                email,
                password,
                phoneNumber,
            });
            setMessage('Sign Up Successful! You can now log in.');
            console.log(response.data);
        } catch (error) {
            setMessage(error.response.data.message || 'An error occurred');
            console.error(error);
        }
    };

    return (
        <div className="signup-container">
            <h2>Create an Admin Account</h2>
            {message && <p>{message}</p>} {/* Display success/error message */}
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="input-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
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
                <div className="input-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="text"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="signup-button">Sign Up</button>
                <div className="signin-link">
                    <span>Already have an account? 
                        <Link to="/signin"> Sign In!</Link>
                    </span>
                </div>
            </form>
        </div>
    );
}

export default SignUpPage;
