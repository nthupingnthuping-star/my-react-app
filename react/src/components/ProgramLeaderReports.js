// src/components/ProgramLeaderReports.jsx
import React, { useState, useEffect } from "react";
import "../style/ProgramLeaderReports.css"; 

function ProgramLeaderReports({ programLeaderId }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/principal-feedback/all");
        if (!response.ok) {
          throw new Error("Failed to load reports");
        }
        const data = await response.json();
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("❌ Failed to load Principal Lecturer reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Principal Lecturer Reports
        </h2>
        <p>Loading reports...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Principal Lecturer Reports
        </h2>
        <div className="status-message error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h2 className="report-title">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
        Principal Lecturer Reports
      </h2>
      {reports.length === 0 ? (
        <p className="no-classes">No reports found.</p>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="report-card">
            <div className="report-header">
              <h3 className="report-title">
                Feedback on {report.class_id}: {report.report_topic}
              </h3>
              <span className="report-source">by {report.principal_name}</span>
            </div>
            <p>
              <strong>Lecturer:</strong> {report.lecturer_name} (ID: {report.lecturer_id})
            </p>
            <p>
              <strong>Faculty:</strong> {report.faculty_name || "—"}
            </p>
            <p>
              <strong>Date:</strong> {new Date(report.date).toLocaleDateString()}
            </p>
            <div className="report-content">
              {report.content}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProgramLeaderReports;