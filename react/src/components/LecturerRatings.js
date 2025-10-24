// src/components/LecturerRatings.jsx
import React, { useState, useEffect } from "react";
import "../style/LecturerPortal.css";

function LecturerRatings({ lecturerId }) {
  const [ratings, setRatings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lecturerId) {
      setError("Lecturer ID is missing");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch ratings given TO this lecturer
        const ratingsRes = await fetch(
          `http://localhost:5000/api/feedback/ratings/${lecturerId}`
        );
        if (!ratingsRes.ok) throw new Error("Failed to load ratings");
        const ratingsData = await ratingsRes.json();

        // Fetch complaints filed AGAINST this lecturer
        const complaintsRes = await fetch(
          `http://localhost:5000/api/feedback/complaints/${lecturerId}`
        );
        if (!complaintsRes.ok) throw new Error("Failed to load complaints");
        const complaintsData = await complaintsRes.json();

        setRatings(ratingsData);
        setComplaints(complaintsData);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("❌ Failed to load feedback. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lecturerId]);

  if (loading) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">📊 My Feedback</h2>
        <p>Loading your ratings and complaints...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">📊 My Feedback</h2>
        <div className="status-message error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h2 className="report-title">📊 My Feedback</h2>

      {/* Ratings Table */}
      <div className="feedback-section">
        <h3>⭐ Student Ratings</h3>
        {ratings.length === 0 ? (
          <p className="no-feedback">No ratings received yet.</p>
        ) : (
          <div className="table-container">
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Rating</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((rating) => (
                  <tr key={rating.id}>
                    <td>{rating.student_name || "Anonymous"}</td>
                    <td>{rating.student_email}</td>
                    <td>
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`star ${i < rating.rating_value ? "filled" : ""}`}
                        >
                          ★
                        </span>
                      ))}
                    </td>
                    <td>{new Date(rating.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Complaints Table */}
      <div className="feedback-section">
        <h3>📢 Student Complaints</h3>
        {complaints.length === 0 ? (
          <p className="no-feedback">No complaints received yet.</p>
        ) : (
          <div className="table-container">
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Complaint</th>
                  <th>Status</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>{complaint.student_name || "Anonymous"}</td>
                    <td>{complaint.student_email}</td>
                    <td>
                      <div className="complaint-text">
                        {complaint.complaint_text}
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${complaint.status || "pending"}`}>
                        {complaint.status || "Pending"}
                      </span>
                    </td>
                    <td>{new Date(complaint.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default LecturerRatings;