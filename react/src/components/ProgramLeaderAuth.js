// src/components/ProgramLeaderAuth.jsx
import React, { useState } from "react";
import "../style/ProgramLeaderAuth.css";

function ProgramLeaderAuth({ onLogin }) {
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
        // 🔐 Login - Updated endpoint
        response = await fetch("http://localhost:5000/api/program-leaders/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
      } else {
        // ✍️ Register as Program Leader
        response = await fetch("http://localhost:5000/api/program-leaders/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullNames: formData.fullNames,
            email: formData.user_email,
            password: formData.user_password,
            faculty_id: formData.faculty_id,
          }),
        });
      }

      data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || (isLogin ? "Login failed" : "Registration failed"));
      } else {
        if (isLogin) {
          // ✅ Check if we have valid program leader data
          if (data.id && data.email) {
            // Format the data for the dashboard
            const programLeaderData = {
              id: data.id,
              firstName: data.fullNames?.split(' ')[0] || 'Program',
              lastName: data.fullNames?.split(' ')[1] || 'Leader',
              fullName: data.fullNames,
              email: data.email,
              faculty: data.faculty_id,
              role: 'program_leader'
            };
            onLogin(programLeaderData);
          } else {
            setError("Invalid program leader data received");
          }
        } else {
          // ✅ Success: switch to login
          alert("Program Leader account created successfully! Please log in.");
          setIsLogin(true);
          setFormData({
            email: data.email || "",
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
      setError("Cannot connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pl-auth-container">
      <div className="pl-auth-card">
        <div className="auth-header">
          <button
            type="button"
            className={`tab-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
            disabled={loading}
          >
            Login
          </button>
          <button
            type="button"
            className={`tab-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
            disabled={loading}
          >
            Register
          </button>
        </div>

        <h2>{isLogin ? "Program Leader Login" : "Program Leader Registration"}</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isLogin ? (
            <>
              <div className="input-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Program Leader Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </>
          ) : (
            <>
              <div className="input-group">
                <input
                  type="text"
                  name="fullNames"
                  placeholder="Full Names"
                  value={formData.fullNames}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  name="user_email"
                  placeholder="Email Address"
                  value={formData.user_email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  name="user_password"
                  placeholder="Password"
                  value={formData.user_password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  name="faculty_id"
                  placeholder="Faculty ID (e.g., FAC-001)"
                  value={formData.faculty_id}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </>
          )}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? (
              <span className="loading-text">
                {isLogin ? "Logging in..." : "Registering..."}
              </span>
            ) : (
              isLogin ? "Login" : "Register"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <button
            type="button"
            className="back-btn"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProgramLeaderAuth;