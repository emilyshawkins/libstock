/* src/AccountSetting.js */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountSettings.css";

function UserSettings() {
    const [selectedSetting, setSelectedSetting] = useState(null);
    const [userData, setUserData] = useState({
        email: "",
        firstName: "",
        lastName: "",
    });

    // Profile Picture State
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState("/user-icon.png"); // Default profile image

    useEffect(() => {
        // Fetch user info (name, email, profile picture)
        async function fetchUserData() {
            try {
                const userId = localStorage.getItem("userId");
                if (!userId) return;
                
                const response = await axios.get(`http://localhost:8080/user/get?id=${userId}`);
                if (response.data) {
                    setUserData({
                        firstName: response.data.firstName || "Unknown",
                        lastName: response.data.lastName || "",
                        email: response.data.email || "No email available",
                    });

                    // If the user has a profile picture, use it; otherwise, use the default `user-icon.png`
                    if (response.data.profilePicture) {
                        setPreviewImage(response.data.profilePicture);
                    }
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        }
        fetchUserData();
    }, []);

    // Profile Picture Change
    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewImage(URL.createObjectURL(file)); // Show preview
        }
    };

    // Upload Profile Picture
    const handleUploadProfilePicture = async () => {
        if (!profilePicture) {
            alert("Please select a profile picture.");
            return;
        }

        const formData = new FormData();
        formData.append("profilePicture", profilePicture);

        try {
            const response = await axios.post("http://localhost:8080/user/set_profile_img", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                alert("Profile picture updated successfully!");
            } else {
                alert("Failed to update profile picture.");
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="settings-container">
            {/* User Profile Section */}
            <div className="profile-section">
                <div className="profile-avatar">
                    <img src={previewImage} alt="Profile" className="profile-preview" />
                    
                    <label htmlFor="file-upload" className="edit-avatar">
                        <img src="/pencil.png" alt="edit" className="edit" />
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        hidden
                    />
                </div>
                <h3 className="user-name">{userData.firstName} {userData.lastName}</h3>
                <p className="user-email">{userData.email}</p>
                <button className="update-profile-button" onClick={handleUploadProfilePicture}>
                    Update Profile Picture
                </button>
            </div>

            {/* Account Settings */}
            <div className="accordion">
                <label className="accordion-label" onClick={() => setSelectedSetting("email")}>
                    <span>Change Email</span>
                </label>
                {selectedSetting === "email" && (
                    <div className="accordion-content">
                        <input type="email" placeholder="New Email" />
                        <button>Update Email</button>
                    </div>
                )}

                <label className="accordion-label" onClick={() => setSelectedSetting("name")}>
                    <span>Change Name</span>
                </label>
                {selectedSetting === "name" && (
                    <div className="accordion-content">
                        <input type="text" placeholder="First Name" />
                        <input type="text" placeholder="Last Name" />
                        <button>Update Name</button>
                    </div>
                )}

                <label className="accordion-label" onClick={() => setSelectedSetting("password")}>
                    <span>Change Password</span>
                </label>
                {selectedSetting === "password" && (
                    <div className="accordion-content">
                        <input type="password" placeholder="Current Password" />
                        <input type="password" placeholder="New Password" />
                        <button>Update Password</button>
                    </div>
                )}

                <label className="accordion-label delete-label" onClick={() => setSelectedSetting("delete")}>
                    <span>Delete Account</span>
                </label>
                {selectedSetting === "delete" && (
                    <div className="accordion-content">
                        <button className="delete-button">Delete My Account</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserSettings;
