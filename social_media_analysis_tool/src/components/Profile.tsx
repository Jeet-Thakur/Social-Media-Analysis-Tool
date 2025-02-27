import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");

  // Decode token to get user id
  const token = localStorage.getItem("token");
  let userId: number | null = null;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userId = decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  // Optionally, fetch user data on mount to prefill form fields
  useEffect(() => {
    // You can implement a GET /profile/:id endpoint to fetch user data and prefill the form.
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedProfile = {
      id: userId,
      email,
      full_name: fullName,
      date_of_birth: dob,
      phone,
      profile_picture: profilePicture,
    };
    try {
      const response = await fetch("http://localhost:5000/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Profile updated successfully!");
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="min-vh-100" style={{ background: "linear-gradient(45deg, #FF9A9E, #FAD0C4)" }}>
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
        <div
          className="card p-4"
          style={{
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "#FFFFFF",
            border: "none",
            borderRadius: "15px",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          }}
        >
          <h2 className="text-center mb-4" style={{ color: "#333" }}>
            Edit Profile
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Profile Picture</label>
              <input type="file" className="form-control" onChange={handleImageChange} />
              {profilePicture && (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="img-thumbnail mt-2"
                  style={{ height: "100px", width: "100px" }}
                />
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn" style={{ backgroundColor: "#FF6B6B", color: "#fff" }}>
                Save Profile
              </button>
              <button
                type="button"
                className="btn"
                style={{ backgroundColor: "#4ECDC4", color: "#fff" }}
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
