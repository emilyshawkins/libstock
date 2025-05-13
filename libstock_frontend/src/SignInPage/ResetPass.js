/* ./SignInPage/ResetPass.js */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import "./ResetPass.css";

function ResetPass() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();
    const queryParms = new URLSearchParams(location.search);
    const resetToken = queryParms.get("token");

    // Retrieve user ID from localStorage
    const userId = localStorage.getItem("id");

    // Reset Password
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!userId) {
            setMessage("User ID is missing. Please log in again.");
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match!");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.patch("http://localhost:8080/user/reset_password", { 
                id: userId, 
                newPassword,
                resetToken
            });

            if (response.data.success) {
                alert("Password reset successful! You can sign in now!");
                navigate("/signin");
            } else {
                setMessage("Failed to reset password. Please try again.");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Error resetting password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-container">
            <h2>Reset Password</h2>
            {message && <p className="error-message">{message}</p>}
            <form onSubmit={handlePasswordSubmit} className="reset-form">
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
        </div>
    );
}

export default ResetPass;
