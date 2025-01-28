// src/SignUpPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUpPage.css';

function SignUpPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setMessage('');

        const newErrors = {};
        if (!firstName) newErrors.firstName = 'First name is required.';
        if (!lastName) newErrors.lastName = 'Last name is required.';
        if (!email) {
            newErrors.email = 'Email is required.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Invalid email format.';
        }
        if (!password) {
            newErrors.password = 'Password is required.';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const endpoint = isAdmin
                ? 'http://localhost:8080/user/admin_signup'
                : 'http://localhost:8080/user/signup';

            const response = await axios.post(
                endpoint,
                { firstName, lastName, email, password, isAdmin },
                { headers: { 'Content-Type': 'application/json' } }
            );

            setMessage('Sign Up Successful! You can now log in.');
            console.log(response.data);
            navigate('/login');
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                setMessage(error.response.data.message);
            } else {
                setMessage('An error occurred during signup.');
            }
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
                    {errors.firstName && <p className="error">{errors.firstName}</p>}
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
                    {errors.lastName && <p className="error">{errors.lastName}</p>}
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
                    {errors.email && <p className="error">{errors.email}</p>}
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
                    {errors.password && <p className="error">{errors.password}</p>}
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