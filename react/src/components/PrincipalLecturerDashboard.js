// src/components/PrincipalLecturerDashboard.jsx
import React, { useState } from "react";
import Courses from "./Courses";
import Monitoring from "./PrincipalLecturerMonitoring";
import PrincipalRatings from "./PrincipalRatings";
import "../style/PrincipalLecturerPortal.css";

function PrincipalLecturerDashboard({ principalLecturer, onLogout }) {
  const [activeTab, setActiveTab] = useState("courses");

  const tabs = [
    { id: "courses", label: "📚 Courses" },
    { id: "monitoring", label: "📊 Monitoring" },
    { id: "ratings", label: "⭐ Ratings" }
  ];

  return (
    <div className="prl-portal">
      {/* Header */}
      <header className="portal-header">
        <h1>Principal Lecturer Dashboard</h1>
        <div className="prl-info">
          <span>Welcome, {principalLecturer.firstName}!</span>
          <span className="faculty-tag">{principalLecturer.faculty} • {principalLecturer.department}</span>
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
        {activeTab === "courses" && <Courses principalLecturerId={principalLecturer.id} />}
        {activeTab === "monitoring" && <Monitoring principalLecturerId={principalLecturer.id} />}
        {activeTab === "ratings" && <PrincipalRatings principalLecturerId={principalLecturer.id} />}
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

export default PrincipalLecturerDashboard;