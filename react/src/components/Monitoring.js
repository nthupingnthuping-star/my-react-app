// src/components/Monitoring.jsx
import React, { useState, useEffect } from "react";
import "../style/LectureReports.css";

function Monitoring({ lecturerId: propLecturerId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ensure lecturerId is a number
  const lecturerId = typeof propLecturerId === 'string' 
    ? parseInt(propLecturerId, 10) 
    : propLecturerId;

  useEffect(() => {
    if (!lecturerId || isNaN(lecturerId)) {
      setError("Invalid lecturer ID");
      setLoading(false);
      return;
    }

    const fetchMonitoringData = async () => {
      try {
        const url = `http://localhost:5000/api/monitoring/lecturer/${lecturerId}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Monitoring fetch error:", err);
        setError("❌ Unable to load monitoring data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMonitoringData();
  }, [lecturerId]);

  if (loading) return <div className="dashboard-card"><p className="loading-text">Loading monitoring data...</p></div>;
  if (error) return <div className="dashboard-card"><div className="status-message error">{error}</div></div>;
  if (!data || !data.reports || data.reports.length === 0) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">📊 Teaching Progress Monitoring</h2>
        <p className="no-classes">No reports found for this lecturer.</p>
      </div>
    );
  }

  const { stats, reports } = data;
  const avgRating = "4.6";

  return (
    <div className="dashboard-card">
      <h2 className="report-title">📊 Teaching Progress Monitoring</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Lectures Delivered</div>
          <div className="stat-value">{stats.lecturesDelivered}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Attendance</div>
          <div className="stat-value">{stats.avgAttendance}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Rating</div>
          <div className="stat-value">{avgRating}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Courses</div>
          <div className="stat-value">{stats.courses}</div>
        </div>
      </div>

      <div className="trend-card">
        <h3 className="trend-title">📈 Weekly Attendance Trend</h3>
        <div className="attendance-trend">
          {reports.slice(0, 7).map((report, index) => (
            <div key={index} className="attendance-bar" style={{ height: `${report.attendance.rate}%` }}>
              <span className="attendance-label">{report.attendance.rate}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="coverage-card">
        <h3 className="coverage-title">📚 Topic Coverage</h3>
        <ul className="topic-list">
          {reports.map((report, idx) => (
            <li key={report.reportId} className="topic-item">
              <strong>Week {idx + 1}:</strong> {report.topic} ✅
            </li>
          ))}
        </ul>
      </div>

      <div className="feedback-section">
        <h3 className="feedback-title">💬 Supervisor Feedback</h3>
        {reports.map(report => (
          <div key={report.reportId} className="feedback-card">
            <p className="feedback-text">"{report.feedback}"</p>
            <div className="feedback-meta">
              — Report from {new Date(report.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Monitoring;