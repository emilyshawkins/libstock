/* ./SignInPage/ForgotPass.js */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPass.css";

function ForgotPass() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Verify Email Exists
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8080/user/forgot-password", { email });
            
            if (response.data.success) {
                setMessage("Check your email to reset password");
            } else {
                setMessage("Email not found.");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Error checking email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-container">
            <h2>Forgot Password</h2>
            {message && <p className="error-message">{message}</p>}
                <form onSubmit={handleEmailSubmit} className="forgot-form">
                    <label htmlFor="email">Enter your email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Checking..." : "Verify Email"}
                    </button>
                </form>

        </div>
    );
}

export default ForgotPass;
