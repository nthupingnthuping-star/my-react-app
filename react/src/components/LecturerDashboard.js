// src/components/LecturerDashboard.jsx
import React, { useState } from "react";
import Classes from "./Classes";
import Reports from "./Reports";
import LecturerRatings from "./LecturerRatings";
import "../style/LecturerPortal.css";

function LecturerDashboard({ lecturer, onLogout }) {
  const [activeTab, setActiveTab] = useState("classes");

  const tabs = [
    { id: "classes", label: "📚 Classes" },
    { id: "reports", label: "📝 Reports" },
    { id: "ratings", label: "⭐ Ratings" }
  ];

  return (
    <div className="lecturer-portal">
      {/* Header */}
      <header className="portal-header">
        <h1>Lecturer Dashboard</h1>
        <div className="lecturer-info">
          <span>Welcome, {lecturer.firstName}!</span>
          <span className="faculty-tag">{lecturer.faculty} • {lecturer.department}</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="dashboard-content">
        {activeTab === "classes" && <Classes lecturerId={lecturer.id} />}
        {activeTab === "reports" && <Reports lecturerId={lecturer.id} />}
        {activeTab === "ratings" && <LecturerRatings lecturerId={lecturer.id} />}
      </main>

      {/* Logout */}
      <footer className="portal-footer">
        <button onClick={onLogout} className="logout-btn">
          ← Back to Home
        </button>
      </footer>
    </div>
  );
}

export default LecturerDashboard;