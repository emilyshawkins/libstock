/* ./SignInPage/ForgotPass.js */
import React, { useState } from "react";
import axios from "axios";
import "./ForgotPass.css";

function ForgotPass() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);

    // Verify Email Exists
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.get(`http://localhost:8080/user/forgot_password?email=${email}`);
            
            if (response.status == 200) {
                setMessage("Check your email to reset password.");
                setMessageType("success");
            } else {
                setMessage("Email not found.");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Error requesting password reset:", error);
            setMessage(error.response?.data?.message || "Error checking email.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-container">
            <h1>Forgot Password</h1>
            {message && (
                <p className={messageType === "success" ? "success-message" : "error-message"}>
                    {message}
                </p>
            )}
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