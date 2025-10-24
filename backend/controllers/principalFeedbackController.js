// backend/controllers/principalFeedbackController.js
const db = require("../db");

// POST /api/principal-feedback
exports.createFeedback = (req, res) => {
  const { report_id, principal_id, comments } = req.body;

  if (!report_id || !principal_id || !comments?.trim()) {
    return res.status(400).json({ error: "report_id, principal_id, and comments are required" });
  }

  const query = `
    INSERT INTO principal_feedback (report_id, principal_id, comments)
    VALUES (?, ?, ?)
  `;

  db.query(query, [report_id, principal_id, comments.trim()], (err, result) => {
    if (err) {
      console.error("❌ DB Error (create feedback):", err);
      return res.status(500).json({ error: "Failed to submit feedback" });
    }
    res.status(201).json({
      message: "Feedback submitted successfully",
      feedbackId: result.insertId
    });
  });
};

// PUT /api/principal-feedback/:id
exports.updateFeedback = (req, res) => {
  const { id } = req.params;
  const { principal_id, comments } = req.body;

  if (!comments?.trim()) {
    return res.status(400).json({ error: "Comments are required" });
  }

  const checkQuery = `
    SELECT created_at FROM principal_feedback 
    WHERE id = ? AND principal_id = ?
  `;
  db.query(checkQuery, [id, principal_id], (err, results) => {
    if (err) {
      console.error("❌ DB Error (check update):", err);
      return res.status(500).json({ error: "Update failed" });
    }
    if (results.length === 0) {
      return res.status(403).json({ error: "You do not own this feedback or it does not exist." });
    }

    const createdAt = new Date(results[0].created_at).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - createdAt > fiveMinutes) {
      return res.status(403).json({ error: "You can only edit feedback within 5 minutes of submission." });
    }

    const updateQuery = `
      UPDATE principal_feedback 
      SET comments = ?, updated_at = NOW() 
      WHERE id = ?
    `;
    db.query(updateQuery, [comments.trim(), id], (err) => {
      if (err) {
        console.error("❌ DB Error (update):", err);
        return res.status(500).json({ error: "Failed to update feedback" });
      }
      res.json({ message: "Feedback updated successfully" });
    });
  });
};

// DELETE /api/principal-feedback/:id
exports.deleteFeedback = (req, res) => {
  const { id } = req.params;
  const { principal_id } = req.body;

  const checkQuery = `
    SELECT created_at FROM principal_feedback 
    WHERE id = ? AND principal_id = ?
  `;
  db.query(checkQuery, [id, principal_id], (err, results) => {
    if (err) {
      console.error("❌ DB Error (check delete):", err);
      return res.status(500).json({ error: "Delete failed" });
    }
    if (results.length === 0) {
      return res.status(403).json({ error: "You do not own this feedback or it does not exist." });
    }

    const createdAt = new Date(results[0].created_at).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    if (now - createdAt > fiveMinutes) {
      return res.status(403).json({ error: "You can only delete feedback within 5 minutes of submission." });
    }

    const deleteQuery = "DELETE FROM principal_feedback WHERE id = ?";
    db.query(deleteQuery, [id], (err) => {
      if (err) {
        console.error("❌ DB Error (delete):", err);
        return res.status(500).json({ error: "Failed to delete feedback" });
      }
      res.json({ message: "Feedback deleted successfully" });
    });
  });
};

// GET /api/principal-feedback/report/:reportId
exports.getFeedbackByReport = (req, res) => {
  const { reportId } = req.params;

  const query = `
    SELECT pf.id, pf.comments, pf.created_at, pf.updated_at,
           u.full_names AS principal_name
    FROM principal_feedback pf
    JOIN users u ON pf.principal_id = u.user_id
    WHERE pf.report_id = ?
    ORDER BY pf.created_at DESC
  `;

  db.query(query, [reportId], (err, results) => {
    if (err) {
      console.error("❌ DB Error (get feedback):", err);
      return res.status(500).json({ error: "Failed to fetch feedback" });
    }
    res.json(results);
  });
};

// ✅ NEW: Get all principal feedback with report and lecturer context (for Program Leader)
exports.getAllPrincipalFeedback = (req, res) => {
  const query = `
    SELECT 
      pf.id,
      pf.comments AS content,
      pf.created_at AS date,
      u.full_names AS principal_name,
      lr.topic_taught AS report_topic,
      lr.class_id,
      lr.user_id AS lecturer_id,
      lu.full_names AS lecturer_name,
      f.faculty_name
    FROM principal_feedback pf
    INNER JOIN users u ON pf.principal_id = u.user_id
    INNER JOIN lecturer_reports lr ON pf.report_id = lr.report_id
    INNER JOIN users lu ON lr.user_id = lu.user_id
    LEFT JOIN faculties f ON lu.faculty_id = f.faculty_id
    ORDER BY pf.created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching all principal feedback:", err);
      return res.status(500).json({ error: "Failed to load reports" });
    }
    res.json(results);
  });
};