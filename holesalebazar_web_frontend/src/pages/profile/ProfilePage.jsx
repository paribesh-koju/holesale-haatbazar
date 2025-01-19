import React, { useState, useEffect } from "react";
import { fetchUserProfile, updateUserProfile } from "../../apis/Api";
import { toast } from "react-toastify";
import "./Profile.css";

const ProfilePage = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userProfile = await fetchUserProfile();
        setUsername(userProfile.username);
        setEmail(userProfile.email);
        console.log("User profile loaded:", userProfile);
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast.error("Failed to load profile.");
      }
    };

    loadUserProfile();
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (password) {
      formData.append("password", password);
    }
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const response = await updateUserProfile(formData);
      if (response.data.success) {
        toast.success("Profile updated successfully");
        onClose();
      } else {
        toast.error("Failed to update profile.");
        console.error("Error response:", response.data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="profileImage">Profile Image</label>
          <input type="file" id="profileImage" onChange={handleImageUpload} />
          {previewImage && (
            <img
              src={previewImage}
              alt="Profile Preview"
              className="profile-preview"
            />
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
