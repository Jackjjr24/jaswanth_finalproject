import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { get, put } from "../api/apiService";
import { API_ENDPOINTS } from "../api/config";
import "./Auth.css";

function UserProfile() {
  const { user } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});

  const inputStyle = {
    width: "100%",
    padding: "12px",
    border: `2px solid #e2e8f0`,
    borderRadius: "6px",
    boxSizing: "border-box",
    fontSize: "14px",
    fontFamily: "Arial",
    transition: "border-color 0.3s",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setSuccess(false);
  };

  const validateProfile = () => {
    const newErrors = {};
    if (!profileData.name || profileData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!profileData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (profileData.phone && !/^\d{10}$/.test(profileData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    setLoading(true);
    setError(null);
    try {
      await put(API_ENDPOINTS.users.profile, profileData);
      setSuccess(true);
      setEditMode(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", paddingBottom: "40px" }}>
      <h1 style={{ marginBottom: "10px" }}>My Profile</h1>
      <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Manage your account information and preferences</p>

      {error && (
        <div style={{ background: "white", padding: "12px", borderRadius: "6px", color: "var(--danger)", marginBottom: "20px", border: "1px solid var(--danger)" }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{ background: "white", padding: "12px", borderRadius: "6px", color: "var(--success)", marginBottom: "20px", border: "1px solid var(--success)" }}>
          Profile updated successfully!
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
        <div style={{ background: "white", border: "1px solid var(--border)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ margin: 0 }}>Account Information</h3>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {!editMode ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Full Name</p>
                <p style={{ fontWeight: "600", fontSize: "16px" }}>{profileData.name || "Not provided"}</p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Email</p>
                <p style={{ fontWeight: "600", fontSize: "16px" }}>{profileData.email || "Not provided"}</p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Phone</p>
                <p style={{ fontWeight: "600", fontSize: "16px" }}>{profileData.phone || "Not provided"}</p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "8px", fontWeight: "500" }}>Address</p>
                <p style={{ fontWeight: "600", fontSize: "16px" }}>{profileData.address || "Not provided"}</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
                {errors.name && <p style={{ color: "var(--danger)", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.name}</p>}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
                {errors.email && <p style={{ color: "var(--danger)", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.email}</p>}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder="10 digit number"
                  style={inputStyle}
                />
                {errors.phone && <p style={{ color: "var(--danger)", fontSize: "12px", margin: "4px 0 0 0" }}>{errors.phone}</p>}
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px" }}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  style={inputStyle}
                />
              </div>

              <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "var(--success)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setProfileData({
                      name: user?.name || "",
                      email: user?.email || "",
                      phone: "",
                      address: "",
                    });
                    setErrors({});
                  }}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "white",
                    color: "var(--dark)",
                    border: "2px solid var(--border)",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ background: "white", border: "1px solid var(--border)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h3 style={{ marginBottom: "20px" }}>Saved Addresses</h3>
          <div style={{ padding: "20px", textAlign: "center", backgroundColor: "var(--bg)", borderRadius: "6px" }}>
            <p style={{ color: "#94a3b8", marginBottom: "12px" }}>No addresses saved yet</p>
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
              }}
            >
              Add Address
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
