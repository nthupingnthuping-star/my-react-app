// src/components/Reports.jsx
import React, { useState, useEffect, useCallback } from "react";
import "../style/LecturerPortal.css"; // ✅ Correct for Lecturer

function Reports({ lecturerId }) {
  const [reportData, setReportData] = useState({
    week_of_reporting: "",
    date_of_lecture: "",
    class_id: "",
    topic_taught: "",
    learning_outcome: "",
    lecturer_recommendations: "",
    number_of_students_present: "",
    total_number_of_students_registered: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentReportId, setCurrentReportId] = useState(null);
  const [showPastReports, setShowPastReports] = useState(false);
  const [reports, setReports] = useState([]);

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reports/user/${lecturerId}`
      );
      if (!response.ok) throw new Error("Failed to fetch reports");
      const data = await response.json();
      setReports(data);
    } catch (err) {
      console.error("Fetch reports error:", err);
      setMessage("❌ Failed to load past reports.");
    }
  }, [lecturerId]);

  useEffect(() => {
    if (showPastReports) {
      fetchReports();
    }
  }, [showPastReports, fetchReports]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReportData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (
      !reportData.week_of_reporting ||
      !reportData.date_of_lecture ||
      !reportData.class_id ||
      !reportData.topic_taught
    ) {
      setMessage("❌ Please fill in all required fields.");
      setLoading(false);
      return;
    }

    const payload = {
      user_id: Number(lecturerId),
      week_of_reporting: reportData.week_of_reporting,
      date_of_lecture: reportData.date_of_lecture,
      class_id: reportData.class_id,
      topic_taught: reportData.topic_taught,
      learning_outcome: reportData.learning_outcome,
      lecturer_recommendations: reportData.lecturer_recommendations,
      number_of_students_present: Number(reportData.number_of_students_present),
      total_number_of_students_registered: Number(
        reportData.total_number_of_students_registered
      ),
    };

    try {
      let response;
      if (isEditing) {
        response = await fetch(
          `http://localhost:5000/api/reports/${currentReportId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      } else {
        response = await fetch("http://localhost:5000/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Operation failed");
      }

      setMessage(
        `✅ ${isEditing ? "Report updated" : "Report submitted"} successfully!`
      );

      setReportData({
        week_of_reporting: "",
        date_of_lecture: "",
        class_id: "",
        topic_taught: "",
        learning_outcome: "",
        lecturer_recommendations: "",
        number_of_students_present: "",
        total_number_of_students_registered: "",
      });
      setIsEditing(false);
      setCurrentReportId(null);

      if (showPastReports) fetchReports();
    } catch (error) {
      console.error("Submission error:", error);
      setMessage(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (report) => {
    setReportData({
      week_of_reporting: report.week_of_reporting,
      date_of_lecture: report.date_of_lecture,
      class_id: report.class_id,
      topic_taught: report.topic_taught,
      learning_outcome: report.learning_outcome || "",
      lecturer_recommendations: report.lecturer_recommenndations || "",
      number_of_students_present: String(report.number_of_students_present),
      total_number_of_students_registered: String(
        report.total_number_of_students_registered
      ),
    });
    setIsEditing(true);
    setCurrentReportId(report.report_id);
    setShowPastReports(false);
  };

  const handleDelete = async (id, createdAt) => {
    const createdTime = new Date(createdAt).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - createdTime > fiveMinutes) {
      setMessage("❌ You can only delete reports within 5 minutes of submission.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/reports/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: Number(lecturerId) }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Delete failed");
      }

      setMessage("✅ Report deleted successfully!");
      fetchReports();
    } catch (err) {
      console.error("Delete error:", err);
      setMessage(`❌ ${err.message}`);
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

  if (!showPastReports) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">
          {isEditing ? (
            <>
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '24px', height: '24px', fill: 'var(--accent)' }}>
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
              Edit Lecture Report
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '24px', height: '24px', fill: 'var(--accent)' }}>
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              Submit Lecture Report
            </>
          )}
        </h2>

        {message && (
          <div className={`status-message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label>Week of Reporting *</label>
            <input
              type="week"
              name="week_of_reporting"
              value={reportData.week_of_reporting}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Date of Lecture *</label>
            <input
              type="date"
              name="date_of_lecture"
              value={reportData.date_of_lecture}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Class ID *</label>
            <input
              type="text"
              name="class_id"
              value={reportData.class_id}
              onChange={handleChange}
              required
              placeholder="e.g., CS301"
            />
          </div>

          <div className="form-group">
            <label>Topic Taught *</label>
            <textarea
              name="topic_taught"
              value={reportData.topic_taught}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Describe the main topic covered"
            />
          </div>

          <div className="form-group">
            <label>Learning Outcome</label>
            <textarea
              name="learning_outcome"
              value={reportData.learning_outcome}
              onChange={handleChange}
              rows="3"
              placeholder="What should students have learned?"
            />
          </div>

          <div className="form-group">
            <label>Lecturer Recommendations</label>
            <textarea
              name="lecturer_recommendations"
              value={reportData.lecturer_recommendations}
              onChange={handleChange}
              rows="3"
              placeholder="Suggestions or concerns"
            />
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Students Present *</label>
              <input
                type="number"
                name="number_of_students_present"
                value={reportData.number_of_students_present}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="form-group half">
              <label>Total Registered *</label>
              <input
                type="number"
                name="total_number_of_students_registered"
                value={reportData.total_number_of_students_registered}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Processing..." : isEditing ? "Update Report" : "Submit Report"}
            </button>
            <button
              type="button"
              onClick={() => setShowPastReports(true)}
              className="view-reports-btn"
            >
              📂 View Past Reports
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h2 className="report-title">
        <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '24px', height: '24px', fill: 'var(--accent)' }}>
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
        My Past Lecture Reports
      </h2>

      {message && (
        <div className={`status-message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <button
        onClick={() => {
          setShowPastReports(false);
          setIsEditing(false);
          setCurrentReportId(null);
        }}
        className="back-btn"
      >
        ← Back to Report Form
      </button>

      {reports.length === 0 ? (
        <p className="no-classes">No reports found.</p>
      ) : (
        <ul className="reports-list">
          {reports.map((report) => {
            const createdTime = new Date(report.created_at).getTime();
            const now = Date.now();
            const canEditDelete = now - createdTime <= 5 * 60 * 1000;

            return (
              <li key={report.report_id} className="report-item">
                <div className="report-content">
                  <strong>{report.class_id}</strong> – {formatDate(report.created_at)}
                  <br />
                  <em>{report.topic_taught}</em>
                  <br />
                  <small>
                    Present: {report.number_of_students_present} / {report.total_number_of_students_registered}
                  </small>
                </div>
                <div className="report-actions">
                  <button
                    onClick={() => handleEdit(report)}
                    disabled={!canEditDelete}
                    className={`btn-edit ${!canEditDelete ? "disabled" : ""}`}
                    title={!canEditDelete ? "Editable only within 5 minutes" : ""}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(report.report_id, report.created_at)}
                    disabled={!canEditDelete}
                    className={`btn-delete ${!canEditDelete ? "disabled" : ""}`}
                    title={!canEditDelete ? "Deletable only within 5 minutes" : ""}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Reports;