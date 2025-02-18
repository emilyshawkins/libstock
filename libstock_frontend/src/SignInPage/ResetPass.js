/* ./SignInPage/ForgotPass.js */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./ForgotPass.css";

function ForgotPass() {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Reset Password
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Verify Email Exists
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:8080/user/forgot-password", { email });
            
            if (response.data.success) {
                setStep(2); // if email exists, send an email to verify and link to reset password
            } else {
                setMessage("Email not found.");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Error checking email.");
        } finally {
            setLoading(false);
        }
    };

    //Reset Password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.patch("http://localhost:8080/user/reset_password", { email, newPassword });

            if (response.data.success) {
                alert("Password reset successful! You can sign in now!");
                navigate("/signin");
            } else {
                setMessage("Failed to reset password.");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-container">
            <h2>Forgot Password</h2>

            {message && <p className="error-message">{message}</p>}

            {step === 1 ? (
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
            ) : (
                <form onSubmit={handlePasswordSubmit} className="forgot-form">
                    <label htmlFor="newPassword">New Password:</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default ForgotPass;
