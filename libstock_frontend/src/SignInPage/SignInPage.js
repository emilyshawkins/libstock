/* src/SignInPage.js */
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import './SignInPage.css';

function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage(""); 

        if (!email || !password) {
            setErrorMessage("Email and password are required.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:8080/user/login',
                { email, password },
                { headers: { 'Content-Type': 'application/json' } }
            );
            console.log("Login successful:", response.data);

            // Redirect to the homepage upon successful login
            navigate("/user/home");
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Your email or password is incorrect.");
        } finally {
            setLoading(false);
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
                <div className="input-group password-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                </div>
                <div className="input-group remember-me">
                    <label>
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                        />
                        Remember Me
                    </label>
                </div>
                <button type="submit" className="signin-button" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                </button>
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
