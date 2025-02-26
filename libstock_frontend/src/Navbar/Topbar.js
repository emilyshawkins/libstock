/* src/Navbar/Topbar.js */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Topbar.css"; // Ensure correct styles

function Topbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({ firstName: "", lastName: "", email: "", admin: false });
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
                        admin: response.data.admin || false,
                    });

                    // If user has uploaded a profile picture, use it
                    if (response.data.image ) {
                        setPreviewImage(`data:image/png;base64,${response.data.image }`);
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
        if (callback) callback();
    };

    const handleSettingsClick = () => {
        closeDropdown(() => navigate(userInfo.admin ? "/admin/settings" : "/user/settings"));
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
                    onError={(e) => { e.target.src = "/user-icon.png"; }} // Replace broken images
                    onClick={toggleDropdown}
                />
                {isDropdownOpen && (
                    <div className="dropdown-menu">
                        <div className="dropdown-user-info">
                            <p><strong>{`${userInfo.firstName} ${userInfo.lastName}`}</strong></p>
                            <p>{userInfo.email || ""}</p>
                        </div>
                        <button className="account-setting" onClick={handleSettingsClick}>
                            Account Settings
                        </button>
                        <button className="log-out" onClick={handleLogout}>
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Topbar;
