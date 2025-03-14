/* src/Navbar/Topbar.js */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Topbar.css"; 

function Topbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotiDropdownOpen, setIsNotiDropdownOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({ firstName: "", lastName: "", email: "", admin: false });
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
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

                    if (response.data.image) {
                        setPreviewImage(`data:image/png;base64,${response.data.image}`);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }

        async function fetchNotifications() {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) return;

                const response = await axios.get(`http://localhost:8080/notification/get_all?userId=${userId}`);
                if (response.data) {
                    setNotifications(response.data);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        }

        fetchUserData();
        fetchNotifications();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setIsNotiDropdownOpen(false);
    };

    const toggleNotiDropdown = () => {
        setIsNotiDropdownOpen(!isNotiDropdownOpen);
        setIsDropdownOpen(false);
    };

    const closeDropdown = (callback) => {
        setIsDropdownOpen(false);
        setIsNotiDropdownOpen(false);
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
            <div className="notification-icon" >
                <img
                    src="/notification-icon.png" 
                    alt="Notifications" 
                    style={{ cursor: "pointer" }} 
                    onClick={toggleNotiDropdown}
                />
                {isNotiDropdownOpen && (
                    <div className="dropdown-menu notifications">
                        <h4>Notifications</h4>
                        {notifications.length > 0 ? (
                            <ul>
                                {notifications.map((noti, index) => (
                                    <li key={index}>{noti.message}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className= "noti-content"> No new notifications </p>
                        )}
                    </div>
                )}
            </div>

            <div className="user-icon-container">
                <img
                    src={previewImage}
                    alt="User Avatar"
                    className="user-icon"
                    style={{ cursor: "pointer" }}
                    onError={(e) => { e.target.src = "/user-icon.png"; }}
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