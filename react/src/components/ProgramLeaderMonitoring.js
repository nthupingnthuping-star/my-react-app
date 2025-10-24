// src/components/ProgramLeaderMonitoring.jsx
import React, { useState, useEffect } from "react";
import "../style/ProgramLeaderMonitoring.css";

function ProgramLeaderMonitoring({ programLeaderId }) {
  const [data, setData] = useState({
    stats: {
      totalLecturers: 0,
      totalCourses: 0,
      avgTeachingRating: 0,
      coursesOnTrack: 0
    },
    lecturers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/monitoring/performance");
        if (!response.ok) throw new Error("Failed to load data");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching performance data:", err);
        setError("❌ Failed to load lecturer performance data.");
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Teaching Program Monitoring
        </h2>
        <p>Loading performance data...</p>
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
          Teaching Program Monitoring
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
        Teaching Program Monitoring
      </h2>

      {/* Stats Grid — Already Horizontal */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Lecturers</div>
          <div className="stat-value">{data.stats.totalLecturers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Courses</div>
          <div className="stat-value">{data.stats.totalCourses}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg Teaching Rating</div>
          <div className="stat-value">
            {data.stats.avgTeachingRating > 0 ? data.stats.avgTeachingRating.toFixed(1) : "—"}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Courses On Track</div>
          <div className="stat-value">{data.stats.coursesOnTrack}</div>
        </div>
      </div>

      {/* Horizontal Lecturer Performance Carousel */}
      <h3>Lecturer Performance</h3>
      {data.lecturers.length === 0 ? (
        <p className="no-classes">No lecturers found.</p>
      ) : (
        <div className="lecturers-carousel">
          {data.lecturers.map(lecturer => (
            <div key={lecturer.id} className="lecturer-card">
              <h3>{lecturer.name}</h3>
              <p><strong>Courses:</strong> {lecturer.courses.length > 0 ? lecturer.courses.join(", ") : "—"}</p>
              <p><strong>Faculty:</strong> {lecturer.faculty}</p>
              <p><strong>Ratings:</strong> {lecturer.totalRatings} reviews</p>
              <div className="lecturer-metrics">
                <div className="star-rating">
                  ⭐ {lecturer.teachingRating > 0 ? lecturer.teachingRating : "No rating"}
                </div>
                <div
                  className={`performance-badge ${
                    lecturer.teachingRating >= 4
                      ? "performance-on-track"
                      : "performance-needs-attention"
                  }`}
                >
                  {lecturer.teachingRating >= 4 ? "On Track" : "Needs Attention"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProgramLeaderMonitoring;