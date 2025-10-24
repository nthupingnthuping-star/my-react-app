// src/components/PrincipalRatings.jsx
import React, { useState, useEffect } from "react";
import "../style/PrincipalRatings.css"; // ✅ Correct import

function PrincipalRatings({ principalLecturerId }) {
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [ratingValue, setRatingValue] = useState(3);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/feedback/ratings-summary");
        if (!res.ok) throw new Error("Failed to load ratings");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Error:", err);
        setError("❌ Failed to load ratings summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  const handleOpenRatingModal = (lecturer) => {
    setSelectedLecturer(lecturer);
    setRatingValue(3);
    setShowRatingModal(true);
  };

  const handleSubmitPrincipalRating = async () => {
    if (!selectedLecturer) return;

    try {
      const payload = {
        student_id: principalLecturerId,
        lecturer_id: selectedLecturer.lecturer_id,
        rating_value: ratingValue,
      };

      const res = await fetch("http://localhost:5000/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      setMessage("✅ Rating submitted successfully!");
      setShowRatingModal(false);
      setSelectedLecturer(null);
      setRatingValue(3);

      const refreshRes = await fetch("http://localhost:5000/api/feedback/ratings-summary");
      const newData = await refreshRes.json();
      setSummary(newData);
    } catch (err) {
      console.error("Rating error:", err);
      setMessage(`❌ ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Lecturer Performance Dashboard
        </h2>
        <p>Loading ratings summary...</p>
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
          Lecturer Performance Dashboard
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
        Lecturer Performance Dashboard
      </h2>
      <p className="subtitle">Overview of all lecturer ratings and performance metrics</p>

      {message && (
        <div className={`status-message ${message.includes("✅") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      {/* Ratings Summary Table */}
      <div className="table-container">
        <table className="feedback-table">
          <thead>
            <tr>
              <th>Lecturer Name</th>
              <th>Email</th>
              <th>Avg Rating</th>
              <th>5★</th>
              <th>4★</th>
              <th>3★</th>
              <th>2★</th>
              <th>1★</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((lecturer) => {
              const total = lecturer.total_ratings || 0;
              const avg = lecturer.avg_rating ? parseFloat(lecturer.avg_rating).toFixed(1) : "—";

              const pct5 = total ? Math.round((lecturer.five_star / total) * 100) : 0;
              const pct4 = total ? Math.round((lecturer.four_star / total) * 100) : 0;
              const pct3 = total ? Math.round((lecturer.three_star / total) * 100) : 0;
              const pct2 = total ? Math.round((lecturer.two_star / total) * 100) : 0;
              const pct1 = total ? Math.round((lecturer.one_star / total) * 100) : 0;

              return (
                <tr key={lecturer.lecturer_id}>
                  <td>{lecturer.lecturer_name}</td>
                  <td>{lecturer.user_email}</td>
                  <td>
                    <strong>{avg}</strong>/5
                    {avg !== "—" && (
                      <div className="rating-bar">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`star small ${i < Math.round(avg) ? "filled" : ""}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>{pct5}%</td>
                  <td>{pct4}%</td>
                  <td>{pct3}%</td>
                  <td>{pct2}%</td>
                  <td>{pct1}%</td>
                  <td>{total}</td>
                  <td>
                    <button
                      className="btn-rate"
                      onClick={() => handleOpenRatingModal(lecturer)}
                    >
                      ⭐ Rate
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>⭐ Rate Lecturer: {selectedLecturer?.lecturer_name}</h3>
            <div className="rating-scale-large">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn-large ${ratingValue >= star ? "active" : ""}`}
                  onClick={() => setRatingValue(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <div className="rating-label">
              {ratingValue === 1 && "Poor"}
              {ratingValue === 2 && "Fair"}
              {ratingValue === 3 && "Good"}
              {ratingValue === 4 && "Very Good"}
              {ratingValue === 5 && "Excellent"}
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowRatingModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-submit"
                onClick={handleSubmitPrincipalRating}
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PrincipalRatings;