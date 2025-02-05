/* src/AccountSetting.js */
import React, { useState } from "react";
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

// Profile Picture State
const [profilePicture, setProfilePicture] = useState(null);
const [previewImage, setPreviewImage] = useState("/default-profile.png"); // Default profile image

const handleSettingChange = (setting) => {
    setSelectedSetting(selectedSetting === setting ? null : setting);
};

// Handle Profile Picture Change
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
        <div className="accordion">
            <h2>User Account Settings</h2>
            {/* Edit Profile Picture Section */}
            <label className="accordion-label" onClick={() => handleSettingChange("profilePicture")}>
                <span>Edit Profile Picture</span>
            </label>
            {selectedSetting === "profilePicture" && (
                <div className="accordion-content">
                    <img src={previewImage} alt="Profile Preview" className="profile-preview" />
                    <input type="file" accept="image/*" onChange={handleProfilePictureChange} />
                    <button onClick={handleUploadProfilePicture}>Update Profile Picture</button>
                </div>
            )}

            {/* Other Settings (Email, Name, Password, Delete) */}
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
);
}

export default UserSettings;
