// src/components/ProgramLeaderDashboard.jsx
import React, { useState } from "react";
import ProgramLeaderCourses from "./ProgramLeaderCourses";
import ProgramLeaderReports from "./ProgramLeaderReports";
import ProgramLeaderMonitoring from "./ProgramLeaderMonitoring";
import ProgramLeaderClasses from "./ProgramLeaderClasses";
import "../style/ProgramLeaderPortal.css";

function ProgramLeaderDashboard({ programLeader, onLogout }) {
  const [activeTab, setActiveTab] = useState("courses");

  const tabs = [
    { id: "courses", label: "📚 Courses" },
    { id: "reports", label: "📝 Reports" },
    { id: "monitoring", label: "📊 Monitoring" },
    { id: "classes", label: "🏫 Classes" },
   
  ];

  return (
    <div className="pl-portal">
      {/* Header */}
      <header className="portal-header">
        <h1>Program Leader Dashboard</h1>
        <div className="pl-info">
          <span>Welcome, {programLeader.firstName}!</span>
          <span className="faculty-tag">{programLeader.faculty} • {programLeader.department}</span>
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
        {activeTab === "courses" && <ProgramLeaderCourses programLeaderId={programLeader.id} />}
        {activeTab === "reports" && <ProgramLeaderReports programLeaderId={programLeader.id} />}
        {activeTab === "monitoring" && <ProgramLeaderMonitoring programLeaderId={programLeader.id} />}
        {activeTab === "classes" && <ProgramLeaderClasses programLeaderId={programLeader.id} />}
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

export default ProgramLeaderDashboard;