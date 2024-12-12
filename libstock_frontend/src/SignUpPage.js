import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SignUpPage.css';

function SignUpPage() {
    // State for form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // Toggle between admin and user

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password) {
            alert('All fields are required!');
            return;
        }
        try {
            const endpoint = isAdmin 
                ? 'http://localhost:3000/user/admin_signup' 
                : 'http://localhost:3000/user/signup';
            const response = await axios.post(
                endpoint,
                {
                    firstName,
                    lastName,
                    email,
                    password,
                    isAdmin
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setMessage('Sign Up Successful! You can now log in.');
            console.log(response.data);
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred');
            console.error(error);
        }
    };

    return (
        <div className="signup-container">
            <h2>{isAdmin ? 'Create an Admin Account' : 'Create an User Account'}</h2>
            <div className="toggle-role">
                <label>
                    <input
                        type="checkbox"
                        checked={isAdmin}
                        onChange={() => setIsAdmin(!isAdmin)}
                    />
                    Sign up as Admin
                </label>
            </div>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="input-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
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
                <button type="submit" className="signup-button">
                    {isAdmin ? 'Sign Up as Admin' : 'Sign Up as User'}
                </button>
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