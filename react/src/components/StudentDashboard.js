import React, { useState, useEffect } from "react";
import "../style/StudentDashboard.css";

const DashboardNav = ({ activeTab, onTabChange }) => {
  return (
    <nav className="dashboard-nav">
      <button
        className={activeTab === 'overview' ? 'nav-btn active' : 'nav-btn'}
        onClick={() => onTabChange('overview')}
      >
        Overview
      </button>
      <button
        className={activeTab === 'ratings' ? 'nav-btn active' : 'nav-btn'}
        onClick={() => onTabChange('ratings')}
      >
        Rate Lecturers
      </button>
      <button
        className={activeTab === 'complaints' ? 'nav-btn active' : 'nav-btn'}
        onClick={() => onTabChange('complaints')}
      >
        File Complaints
      </button>
    </nav>
  );
};

const OverviewPage = () => {
  return (
    <div className="overview-page">
      <h2>Welcome to Your Dashboard</h2>
      <p>Select "Rate Lecturers" or "File Complaints" from the navigation above to get started.</p>
      <div className="overview-cards-grid">
        <div className="overview-card">
          <div className="card-icon">📊</div>
          <h3>Your Feedback Matters</h3>
          <p>Help us improve by rating your lecturers and sharing concerns.</p>
        </div>
      </div>
    </div>
  );
};

// FULLY REWRITTEN RATINGS PAGE
const RatingsPage = ({ student, lecturers, loadingLecturers, onTabChange }) => {
  const [ratingValue, setRatingValue] = useState(0);
  const [selectedLecturerId, setSelectedLecturerId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const renderStars = () => (
    [1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        className={`star ${star <= ratingValue ? 'filled' : ''}`}
        onClick={() => setRatingValue(star)}
        aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
      >
        ★
      </button>
    ))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLecturerId || !ratingValue) {
      alert("Please select a lecturer and provide a rating.");
      return;
    }

    setSubmitting(true);
    const payload = {
      student_id: student.id,
      lecturer_id: selectedLecturerId,
      rating_value: ratingValue,
    };

    try {
      const res = await fetch("http://localhost:5000/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        setRatingValue(0);
        setSelectedLecturerId("");
      } else {
        const data = await res.json();
        alert("Submission failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ratings-page">
      <button
        onClick={() => onTabChange('overview')}
        className="back-to-dashboard-btn"
      >
        ← Back to Dashboard
      </button>

      <h2>Rate Your Lecturer</h2>
      <form onSubmit={handleSubmit} className="feedback-form">
        <div className="form-group">
          <label htmlFor="lecturer-select"><strong>Select Lecturer *</strong></label>
          {loadingLecturers ? (
            <div className="loading-placeholder">Loading lecturers...</div>
          ) : (
            <select
              id="lecturer-select"
              value={selectedLecturerId}
              onChange={(e) => setSelectedLecturerId(e.target.value)}
              required
              className="custom-select"
            >
              <option value="">-- Choose a lecturer --</option>
              {lecturers.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-group">
          <label><strong>Lecturer Rating *</strong></label>
          <div className="stars-container">
            {renderStars()}
            <div className="rating-label">
              {ratingValue === 0 ? "Select a rating" : `${ratingValue} star${ratingValue > 1 ? 's' : ''}`}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={`submit-btn ${submitting ? 'disabled' : ''}`}
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Rating"}
        </button>

        {success && (
          <div className="success-message">
            ✅ Rating submitted successfully!
          </div>
        )}
      </form>
    </div>
  );
};

// COMPLAINTS PAGE (MINIMAL CHANGES FOR CONSISTENCY)
const ComplaintsPage = ({ student, lecturers, loadingLecturers, onTabChange }) => {
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [selectedLecturerId, setSelectedLecturerId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [view, setView] = useState('form');

  const fetchComplaints = async () => {
    setLoadingComplaints(true);
    try {
      const res = await fetch(`http://localhost:5000/api/complaints/student/${student.id}`);
      if (res.ok) {
        const data = await res.json();
        setComplaints(Array.isArray(data) ? data : []);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error("Failed to fetch complaints", err);
      setComplaints([]);
    } finally {
      setLoadingComplaints(false);
    }
  };

  const handleFileComplaint = async (e) => {
    e.preventDefault();
    if (!selectedLecturerId || !complaintText.trim()) {
      alert("Please select a lecturer and enter your complaint.");
      return;
    }

    setSubmitting(true);
    const payload = {
      student_id: student.id,
      lecturer_id: selectedLecturerId,
      complaint_text: complaintText,
    };

    try {
      const res = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("Complaint filed successfully!");
        setComplaintText("");
        setSelectedLecturerId("");
      } else {
        const data = await res.json();
        alert("Filing failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (view === 'form') {
    return (
      <div className="complaints-page">
        <button
          onClick={() => onTabChange('overview')}
          className="back-to-dashboard-btn"
        >
          ← Back to Dashboard
        </button>

        <h2>File a New Complaint</h2>
        <form onSubmit={handleFileComplaint} className="complaint-form">
          <div className="form-group">
            <label htmlFor="complaint-lecturer"><strong>Select Lecturer *</strong></label>
            {loadingLecturers ? (
              <div className="loading-placeholder">Loading lecturers...</div>
            ) : (
              <select
                id="complaint-lecturer"
                value={selectedLecturerId}
                onChange={(e) => setSelectedLecturerId(e.target.value)}
                required
                className="custom-select"
              >
                <option value="">-- Choose a lecturer --</option>
                {lecturers.map((lec) => (
                  <option key={lec.id} value={lec.id}>
                    {lec.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="complaint-text"><strong>Your Complaint *</strong></label>
            <textarea
              id="complaint-text"
              placeholder="Describe your concern about the lecturer..."
              rows="5"
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              required
              className="custom-textarea"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Filing..." : "File Complaint"}
          </button>
        </form>

        <button
          onClick={() => {
            fetchComplaints();
            setView('past');
          }}
          className="view-past-btn"
        >
          📂 View Past Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="complaints-page">
      <button
        onClick={() => onTabChange('overview')}
        className="back-to-dashboard-btn"
      >
        ← Back to Dashboard
      </button>

      <h2>📂 My Past Complaints</h2>

      <button
        onClick={() => setView('form')}
        className="back-to-form-btn"
      >
        ← Back to File Complaint
      </button>

      {loadingComplaints ? (
        <p className="loading-text">Loading your complaints...</p>
      ) : complaints.length === 0 ? (
        <p className="empty-state">You haven’t filed any complaints yet.</p>
      ) : (
        <div className="complaints-list">
          {complaints.map((c) => (
            <div key={c.id} className="complaint-card">
              <div className="complaint-header">
                <strong>To:</strong> {c.lecturer_name}
                <span className={`status-badge status-${c.status}`}>{c.status}</span>
              </div>
              <div className="complaint-body">{c.complaint_text}</div>
              <div className="complaint-meta">
                Filed: {new Date(c.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function StudentDashboard({ student, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [lecturers, setLecturers] = useState([]);
  const [loadingLecturers, setLoadingLecturers] = useState(true);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/lecturers");
        if (res.ok) {
          const data = await res.json();
          setLecturers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch lecturers", err);
        setLecturers([]);
      } finally {
        setLoadingLecturers(false);
      }
    };
    fetchLecturers();
  }, []);

  if (!student || !student.id) {
    return (
      <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>
        <h2>⚠️ Invalid Session</h2>
        <p>Please log in again.</p>
      </div>
    );
  }

  const course = student.course || "N/A";
  const faculty = student.faculty || "N/A";

  return (
    <div className="student-dashboard">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="student-info">
          <span className="welcome-text">Welcome, {student.firstName}!</span>
          <span className="student-badge">
            {course} • {faculty}
          </span>
        </div>
      </header>

      <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="dashboard-content">
        {activeTab === 'overview' && <OverviewPage />}
        {activeTab === 'ratings' && (
          <RatingsPage
            student={student}
            lecturers={lecturers}
            loadingLecturers={loadingLecturers}
            onTabChange={setActiveTab}
          />
        )}
        {activeTab === 'complaints' && (
          <ComplaintsPage
            student={student}
            lecturers={lecturers}
            loadingLecturers={loadingLecturers}
            onTabChange={setActiveTab}
          />
        )}
      </main>

      <footer className="dashboard-footer">
        <button onClick={onLogout} className="logout-btn">
          ← Logout
        </button>
      </footer>
    </div>
  );
}

export default StudentDashboard;