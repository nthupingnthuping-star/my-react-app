// src/components/PrincipalLecturerMonitoring.jsx
import React, { useState, useEffect } from "react";
import "../style/PrincipalLecturerMonitoring.css"; // ✅ Correct import

function PrincipalLecturerMonitoring({ principalLecturerId }) {
  const [reports, setReports] = useState([]);
  const [expandedReports, setExpandedReports] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [newFeedbackText, setNewFeedbackText] = useState({});

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/monitoring/reports/all");
        if (!response.ok) throw new Error("Failed to load reports");
        const data = await response.json();

        const initialText = {};
        data.forEach(report => {
          initialText[report.report_id] = "";
        });

        setReports(data);
        setNewFeedbackText(initialText);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setMessage("❌ Failed to load reports.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const toggleExpand = (reportId) => {
    setExpandedReports(prev => {
      const newSet = new Set(prev);
      newSet.has(reportId) ? newSet.delete(reportId) : newSet.add(reportId);
      return newSet;
    });
  };

  const canEditDelete = (createdAt) => {
    if (!createdAt) return false;
    const createdTime = new Date(createdAt).getTime();
    const now = Date.now();
    return now - createdTime <= 5 * 60 * 1000;
  };

  const handleAddFeedback = async (reportId, comment) => {
    try {
      const payload = { report_id: reportId, principal_id: principalLecturerId, comments: comment };
      const res = await fetch("http://localhost:5000/api/principal-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Submission failed");

      setReports(prev =>
        prev.map(report =>
          report.report_id === reportId
            ? { ...report, hasFeedback: true, feedback: comment, feedbackId: null, feedbackCreatedAt: new Date().toISOString() }
            : report
        )
      );
      setNewFeedbackText(prev => ({ ...prev, [reportId]: "" }));
      setMessage("✅ Feedback submitted!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleUpdateFeedback = async (feedbackId, reportId, comment) => {
    try {
      const payload = { principal_id: principalLecturerId, comments: comment };
      const res = await fetch(`http://localhost:5000/api/principal-feedback/${feedbackId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Update failed");

      setReports(prev =>
        prev.map(report =>
          report.report_id === reportId
            ? { ...report, feedback: comment }
            : report
        )
      );
      setMessage("✅ Feedback updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleDeleteFeedback = async (feedbackId, reportId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      const payload = { principal_id: principalLecturerId };
      const res = await fetch(`http://localhost:5000/api/principal-feedback/${feedbackId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Delete failed");

      setReports(prev =>
        prev.map(report =>
          report.report_id === reportId
            ? { ...report, hasFeedback: false, feedback: "", feedbackId: null, feedbackCreatedAt: null }
            : report
        )
      );
      setMessage("✅ Feedback deleted!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const getAttendanceStatus = (present, total) => {
    if (!total) return { text: "N/A", color: "#64748b" };
    const percentage = (present / total) * 100;
    if (percentage >= 85) return { text: "Excellent", color: "#4caf50" };
    if (percentage >= 70) return { text: "Good", color: "#8bc34a" };
    if (percentage >= 50) return { text: "Fair", color: "#ff9800" };
    return { text: "Poor", color: "#f44336" };
  };

  if (loading) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Lecture Reports
        </h2>
        <p>Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h2 className="report-title">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
        Lecture Reports
      </h2>
      <p className="subtitle">Review reports and provide feedback</p>

      {message && (
        <div className={`status-message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      {reports.length === 0 ? (
        <p className="no-classes">No reports found.</p>
      ) : (
        reports.map(report => {
          const isExpanded = expandedReports.has(report.report_id);
          const attendance = getAttendanceStatus(
            report.number_of_students_present,
            report.total_number_of_students_registered
          );

          return (
            <div key={report.report_id} className="report-card">
              <div className="report-header">
                <div className="report-info">
                  <h3 className="report-course">{report.class_id || "Unknown Class"}</h3>
                  <div className="report-meta">
                    <span className="lecturer-name">by {report.lecturer}</span>
                    <span className="report-date">• Week: {report.week_of_reporting}</span>
                  </div>
                  <div className="lecturer-email">
                    📧 {report.lecturerEmail}
                  </div>
                </div>
                <div className="report-actions">
                  <div className="attendance-badge" style={{ backgroundColor: attendance.color }}>
                    {report.number_of_students_present}/{report.total_number_of_students_registered}
                    <span className="attendance-status">({attendance.text})</span>
                  </div>
                  <button className="expand-btn" onClick={() => toggleExpand(report.report_id)}>
                    {isExpanded ? '▲' : '▼'}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="report-details">
                  <p><strong>Topic:</strong> {report.topic_taught}</p>
                  <p><strong>Learning Outcome:</strong> {report.learning_outcome}</p>
                  <p><strong>Recommendations:</strong> {report.lecturer_recommenndations}</p>
                  <p><strong>Venue:</strong> {report.venue || "—"}</p>
                  <p><strong>Schedule:</strong> {report.class_time || "—"}</p>
                </div>
              )}

              {/* Feedback Section */}
              <div className="feedback-section">
                {report.hasFeedback && report.feedback ? (
                  <div className="existing-feedback">
                    <div className="feedback-content">
                      <p>"{report.feedback}"</p>
                      <div className="feedback-meta">
                        <span>by Principal</span>
                        <span> • {new Date(report.feedbackCreatedAt).toLocaleString()}</span>
                        {canEditDelete(report.feedbackCreatedAt) && (
                          <span className="feedback-actions">
                            <button
                              className="btn-edit"
                              onClick={() => {
                                const newComment = prompt("Edit your feedback:", report.feedback);
                                if (newComment && newComment.trim()) {
                                  handleUpdateFeedback(report.feedbackId, report.report_id, newComment.trim());
                                }
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteFeedback(report.feedbackId, report.report_id)}
                            >
                              Delete
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="new-feedback">
                    <textarea
                      className="feedback-textarea"
                      value={newFeedbackText[report.report_id] || ""}
                      onChange={(e) => setNewFeedbackText(prev => ({
                        ...prev,
                        [report.report_id]: e.target.value
                      }))}
                      placeholder="Write your feedback for this report..."
                      rows="3"
                    />
                    <button
                      className="submit-feedback-btn"
                      onClick={() => {
                        const comment = newFeedbackText[report.report_id]?.trim();
                        if (comment) {
                          handleAddFeedback(report.report_id, comment);
                        }
                      }}
                      disabled={!newFeedbackText[report.report_id]?.trim()}
                    >
                      Submit Feedback
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default PrincipalLecturerMonitoring;