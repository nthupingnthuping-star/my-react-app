// src/components/Classes.jsx
import React, { useState, useEffect } from "react";
import "../style/LecturerPortal.css"; // ✅ Correct for Lecturer role

function Classes({ lecturerId }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lecturerId) {
      setError("Lecturer ID is missing");
      setLoading(false);
      return;
    }

    const fetchClasses = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/classes`);
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        const data = await response.json();
        const assignedClasses = data.filter(cls => cls.lecturer_id === lecturerId);
        setClasses(assignedClasses);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("❌ Unable to load classes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [lecturerId]);

  if (loading) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Assigned Classes
        </h2>
        <p>Loading your classes...</p>
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
          Assigned Classes
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
        Assigned Classes
      </h2>

      {classes.length === 0 ? (
        <p className="no-classes">You have no assigned classes at the moment.</p>
      ) : (
        <div className="classes-list">
          {classes.map((cls) => (
            <div key={cls.class_id} className="class-card">
              <div className="class-header">
                <h3>{cls.class_name}</h3>
                <span className="course-id-tag">{cls.course_id}</span>
              </div>
              <div className="class-details-grid">
                <div className="class-detail-item">
                  <div className="detail-label">Schedule</div>
                  <div className="detail-value">{cls.class_time || "Not set"}</div>
                </div>
                <div className="class-detail-item">
                  <div className="detail-label">Venue</div>
                  <div className="detail-value">{cls.venue || "—"}</div>
                </div>
                <div className="class-detail-item">
                  <div className="detail-label">Students</div>
                  <div className="detail-value">— / — registered</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Classes;