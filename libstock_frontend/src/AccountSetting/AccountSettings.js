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
        currentPassword:"",
        newPassword:"",
    });

    // Profile Picture State
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState("/user-icon.png"); // Default profile image is user-icon img

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
                        currentPassword:"",
                        newPassword:"",
                    });

                    // If the user has a profile picture, use it; otherwise, use the default `user-icon.png`
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
            const userId = localStorage.getItem("userId");
            const response = await axios.post(`http://localhost:8080/user/set_profile_img?id=${userId}`, formData, {
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

    const handleInputChange = (event) => {
        setUserData({ ...userData, [event.target.name]: event.target.value });
    };

    // Handle Update Request
    const handleUpdate = async (field) => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User ID not found.");
            return;
        }

        let payload = { id: userId };

        if (field === "email") {
            payload.email = userData.email;
        } else if (field === "name") {
            payload.firstName = userData.firstName;
            payload.lastName = userData.lastName;
        } else if (field === "password") {
            payload.currentPassword = userData.currentPassword;
            payload.newPassword = userData.newPassword;
        }

        try {
            const response = await axios.patch(`http://localhost:8080/user/update?id=${userId}`, payload, {
                headers: { "Content-Type": "application/json" },
            });

            alert(response.data.message || "Update successful!");
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred. Please try again.");
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
                {/* Change Email */}
                <label className="accordion-label" onClick={() => setSelectedSetting("email")}>
                    <span>Change Email</span>
                </label>
                {selectedSetting === "email" && (
                    <div className="accordion-content">
                        <input type="email" name="email" placeholder="New Email" value={userData.email} onChange={handleInputChange} />
                        <button onClick={() => handleUpdate("email")}>Update Email</button>
                    </div>
                )}

                {/* Change Name */}
                <label className="accordion-label" onClick={() => setSelectedSetting("name")}>
                    <span>Change Name</span>
                </label>
                {selectedSetting === "name" && (
                    <div className="accordion-content">
                    <input type="text" name="firstName" placeholder="First Name" value={userData.firstName} onChange={handleInputChange} />
                    <input type="text" name="lastName" placeholder="Last Name" value={userData.lastName} onChange={handleInputChange} />
                    <button onClick={() => handleUpdate("name")}>Update Name</button>
                </div>
                )}

                {/* Change Password */}
                <label className="accordion-label" onClick={() => setSelectedSetting("password")}>
                    <span>Change Password</span>
                </label>
                {selectedSetting === "password" && (
                    <div className="accordion-content">
                        <input type="password" name="currentPassword" placeholder="Current Password" onChange={handleInputChange} />
                        <input type="password" name="newPassword" placeholder="New Password" onChange={handleInputChange} />
                        <button onClick={() => handleUpdate("password")}>Update Password</button>
                    </div>
                )}

                {/* Delete Account */}
                <label className="accordion-label delete-label" onClick={() => setSelectedSetting("delete")}>
                    <span>Delete Account</span>
                </label>
                {selectedSetting === "delete" && (
                    <div className="accordion-content">
                        <button className="delete-button" onClick={() => handleUpdate("delete")}>Delete My Account</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserSettings;
