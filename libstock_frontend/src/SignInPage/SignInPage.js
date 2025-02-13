/* src/SignInPage.js */
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./SignInPage.css";

function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
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
                "http://localhost:8080/user/login",
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            console.log("Login successful:", response.data);

            // Extract user data from response
            const { id, token, name, admin } = response.data;

            if (id) {
                // Store user data in localStorage
                localStorage.setItem("userId", id);
                localStorage.setItem("userName", name);
                localStorage.setItem("isAdmin", admin);
                if (token) {
                    localStorage.setItem("token", token);
                }

                // Redirect based on user role
                if (admin) {
                    navigate("/admin/home");
                } else {
                    navigate("/user/home");
                }
            } else {
                console.error("No user ID found in response");
            }
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
                            type={showPassword ? "text" : "password"}
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
                <div className="remember-me-container">
                    <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label>Remember Me</label>
                </div>
                <button type="submit" className="signin-button" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                </button>
                <div className="signup-link">
                    <span>
                        Don't have an account?
                        <Link to="/signup"> Sign Up!</Link>
                    </span>
                </div>
            </form>
        </div>
    );
}

export default SignInPage;
