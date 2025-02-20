/* src/Navbar/Topbar.js */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Topbar.css"; // Ensure correct styles

function Topbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({ firstName: "", lastName: "", email: "" });
    const navigate = useNavigate();

    // Profile Picture State (Default: user-icon.png)
    const [previewImage, setPreviewImage] = useState("/user-icon.png");

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) return;

                const response = await axios.get(`http://localhost:8080/user/get?id=${userId}`);
                if (response.data) {
                    setUserInfo({
                        firstName: response.data.firstName || "Unknown",
                        lastName: response.data.lastName || "",
                        email: response.data.email || "No email available",
                        isAdmin: response.data.isAdmin || false,
                        currentPassword: "",
                        newPassword: "",
                    });
                    if (response.data) {
                        setUserInfo({
                            firstName: response.data.firstName || "Unknown",
                            lastName: response.data.lastName || "",
                            email: response.data.email || "No email available",
                        });
                    }
                    if (response.data.image) {
                        setPreviewImage(`data:image/png;base64,${response.data.image}`);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const closeDropdown = (callback) => {
        setIsDropdownOpen(false);
        callback();
    };

    const handleSettingsClick = () => {
        closeDropdown(() => navigate("/user/settings"));
    };

    const handleLogout = () => {
        closeDropdown(() => {
            window.localStorage.clear();
            navigate("/signin");
        });
    };

    return (
        <div className="top-bar">
            <div className="notification-icon">
                <img src="/notification-icon.png" alt="Notifications" />
            </div>
            <div className="user-icon-container">
                <img
                    src={previewImage}
                    alt="User Avatar"
                    className="user-icon"
                    style={{ cursor: "pointer" }}
                    onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <div className="dropdown-user-info">
                            <p><strong>{`${userInfo.firstName} ${userInfo.lastName}`}</strong></p>
                            <p>{userInfo.email || ""}</p>
                        </div>
                        <button className="dropdown-item" onClick={handleSettingsClick}>
                            Account Settings
                        </button>
                        <button className="dropdown-item logout-button" onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Topbar;
