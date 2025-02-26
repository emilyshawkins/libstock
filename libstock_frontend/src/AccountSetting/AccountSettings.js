/* src/AccountSettings.js */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AccountSettings.css";

function UserSettings() {
    const [selectedSetting, setSelectedSetting] = useState(null);
    const [userInfo, setUserInfo] = useState({
        email: "",
        firstName: "",
        lastName: "",
        currentPassword: "",
        newPassword: "",
    });

    // Profile Picture State
    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState("/user-icon.png"); // Default profile image
    const [isImageOpen, setIsImageOpen] = useState(false); // State to track full-screen view


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

    // Handle Profile Picture Change
    const handleProfilePictureChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleUploadProfilePicture = async () => {
        if (!profilePicture) {
            alert("Please select a profile picture.");
            return;
        }

        const formData = new FormData();
        formData.append("profilePicture", profilePicture);
        const userId = localStorage.getItem("userId");

        try {
            const response = await axios.patch(`http://localhost:8080/user/set_profile_img?id=${userId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                alert("Profile picture updated successfully!");
                window.location.reload(); 
            } else {
                alert("Failed to update profile picture.");
            }
        } catch (error) {
            console.error("Error updating profile picture:", error);
            alert("An error occurred. Please try again.");
        }
    };

    // Handle Input Changes
    const handleInputChange = (event) => {
        setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
    };

    // Handle User Data Update
    const handleUpdate = async (field) => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User ID not found.");
            return;
        }

        let payload = { id: userId, isAdmin: userInfo.isAdmin };
        if (field === "email") {
            payload.email = userInfo.email;
        } else if (field === "name") {
            payload.firstName = userInfo.firstName;
            payload.lastName = userInfo.lastName;
        } else if (field === "password") {
            payload.currentPassword = userInfo.currentPassword;
            payload.newPassword = userInfo.newPassword;
        }

        try {
            const response = await axios.patch("http://localhost:8080/user/update", payload, {
                headers: { "Content-Type": "application/json" },
            });

            alert(response.data.message || "Update successful!");
            window.location.reload(); // Auto-reload page after update
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };

    // Delete Account
    const handleDeleteAccount = async () => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            alert("User ID not found.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:8080/user/delete?id=${userId}`
            );

            alert("Your account has been successfully deleted.");
            localStorage.clear();
            window.location.href = "/signin"; 
        } catch (error) {
            console.error("Error deleting account:", error);
            alert(error.response?.data?.message || "An error occurred while deleting the account.");
        }
    };


    return (
        <div className="settings-container">
            {/* User Profile Section */}
            <div className="profile-section">
                <div className="profile-avatar">
                    <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="profile-preview" 
                        onClick={() => setIsImageOpen(true)} // Click to open full-screen
                        style={{ cursor: "pointer" }} 
                    />
                    <label htmlFor="file-upload" className="edit-avatar">
                        <img src="/pencil.png" alt="edit" className="edit" />
                    </label>
                    <input id="file-upload" type="file" accept="image/*" onChange={handleProfilePictureChange} hidden />
                </div>
                <h3 className="user-name">{userInfo.firstName} {userInfo.lastName}</h3>
                <p className="user-email">{userInfo.email}</p>
                <button className="update-profile-button" onClick={handleUploadProfilePicture}>
                    Update Profile Picture
                </button>
            </div>

            {isImageOpen && (
                <div className="fullscreen-overlay" onClick={() => setIsImageOpen(false)}>
                    <div className="fullscreen-content">
                        <img src={previewImage} alt="Full Profile" className="fullscreen-image" />
                    </div>
                </div>
            )}

            {/* Account Settings */}
            <div className="accordion">
                {/* Change Email */}
                <label className="accordion-label" onClick={() => setSelectedSetting("email")}>
                    <span>Change Email</span>
                </label>
                {selectedSetting === "email" && (
                    <div className="accordion-content">
                        <input type="email" name="email" placeholder="New Email" value={userInfo.email} onChange={handleInputChange} />
                        <button onClick={() => handleUpdate("email")}>Update Email</button>
                    </div>
                )}

                {/* Change Name */}
                <label className="accordion-label" onClick={() => setSelectedSetting("name")}>
                    <span>Change Name</span>
                </label>
                {selectedSetting === "name" && (
                    <div className="accordion-content">
                        <input type="text" name="firstName" placeholder="First Name" value={userInfo.firstName} onChange={handleInputChange} />
                        <input type="text" name="lastName" placeholder="Last Name" value={userInfo.lastName} onChange={handleInputChange} />
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
                        <button className="delete-button" onClick={handleDeleteAccount}>Delete My Account</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserSettings;
