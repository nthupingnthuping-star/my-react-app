// src/components/PrincipalLecturerAuth.jsx
import React, { useState } from "react";
import "../style/PrincipalLecturerAuth.css";

function PrincipalLecturerAuth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    // Login fields
    email: "",
    password: "",
    // Register fields
    fullNames: "",
    user_email: "",
    user_password: "",
    faculty_id: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let response, data;

      if (isLogin) {
        // 🔐 Login via backend
        response = await fetch("http://localhost:5000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
      } else {
        // ✍️ Register via backend
        response = await fetch("http://localhost:5000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullNames: formData.fullNames,
            user_email: formData.user_email,
            user_password: formData.user_password,
            user_role: "principal_lecturer", // Enforced role
            faculty_id: formData.faculty_id,
          }),
        });
      }

      data = await response.json();

      if (!response.ok) {
        setError(data.message || (isLogin ? "Login failed" : "Registration failed"));
      } else {
        if (isLogin) {
          // ✅ Role validation
          if (data.role !== "principal_lecturer") {
            setError("Access denied: Principal Lecturer role required");
          } else {
            onLogin(data);
          }
        } else {
          // ✅ Auto-switch to login after successful registration
          alert("Principal Lecturer account created successfully! Please log in.");
          setIsLogin(true);
          setFormData({
            email: data.user_email || "",
            password: "",
            fullNames: "",
            user_email: "",
            user_password: "",
            faculty_id: "",
          });
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prl-auth-container">
      <div className="prl-auth-card">
        <div className="auth-header">
          <button
            className={`tab-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
            disabled={loading}
          >
            Login
          </button>
          <button
            className={`tab-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
            disabled={loading}
          >
            Register
          </button>
        </div>

        <h2>{isLogin ? "Principal Lecturer Login" : "Principal Lecturer Registration"}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <input
                type="email"
                name="email"
                placeholder="Principal Lecturer Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          ) : (
            <>
              <input
                type="text"
                name="fullNames"
                placeholder="Full Names"
                value={formData.fullNames}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="user_email"
                placeholder="Email Address"
                value={formData.user_email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="user_password"
                placeholder="Password"
                value={formData.user_password}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="faculty_id"
                placeholder="Faculty ID (e.g., PRL-5001)"
                value={formData.faculty_id}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading
              ? isLogin
                ? "Logging in..."
                : "Registering..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PrincipalLecturerAuth;