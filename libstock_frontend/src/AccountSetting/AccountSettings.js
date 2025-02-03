import React, { useState } from "react";
import Sidebar from "../Navbar/Sidebar"; // ✅ Import Sidebar
import Topbar from "../Navbar/Topbar"; // ✅ Import Topbar
import axios from "axios";
import "./AccountSettings.css";

function UserSettings() {
    const [selectedSetting, setSelectedSetting] = useState(null);
    const [userData, setUserData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        currentPassword: "",
        newPassword: "",
    });

    const handleSettingChange = (setting) => {
        setSelectedSetting(selectedSetting === setting ? null : setting);
    };

    return (
        <div className="settings-container">
            <Topbar /> {/* ✅ Now using Topbar from ../Navbar/Topbar */}
            
            <div className="main-content">
                <Sidebar /> {/* ✅ Sidebar remains included */}

                <div className="settings-content">
                    <h2>User Account Settings</h2>
                    <div className="accordion">
                        <label className="accordion-label" onClick={() => handleSettingChange("email")}>
                            <span>Change Email</span>
                        </label>
                        {selectedSetting === "email" && (
                            <div className="accordion-content">
                                <input type="email" placeholder="New Email" />
                                <button>Update Email</button>
                            </div>
                        )}

                        <label className="accordion-label" onClick={() => handleSettingChange("name")}>
                            <span>Change Name</span>
                        </label>
                        {selectedSetting === "name" && (
                            <div className="accordion-content">
                                <input type="text" placeholder="First Name" />
                                <input type="text" placeholder="Last Name" />
                                <button>Update Name</button>
                            </div>
                        )}

                        <label className="accordion-label" onClick={() => handleSettingChange("password")}>
                            <span>Change Password</span>
                        </label>
                        {selectedSetting === "password" && (
                            <div className="accordion-content">
                                <input type="password" placeholder="Current Password" />
                                <input type="password" placeholder="New Password" />
                                <button>Update Password</button>
                            </div>
                        )}

                        <label className="accordion-label delete-label" onClick={() => handleSettingChange("delete")}>
                            <span>Delete Account</span>
                        </label>
                        {selectedSetting === "delete" && (
                            <div className="accordion-content">
                                <button className="delete-button">Delete My Account</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserSettings;
