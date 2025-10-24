// backend/controllers/feedbackController.js
const db = require("../db"); // ✅ Ensure this matches your actual db.js file

// ✅ Get all ratings for a specific lecturer (with student info)
exports.getRatingsByLecturer = (req, res) => {
  const { lecturerId } = req.params;

  const query = `
    SELECT 
      r.rating_id, 
      r.rating_value,
      u.full_names AS student_name, 
      u.user_email AS student_email
    FROM ratings r
    JOIN users u ON r.student_id = u.user_id
    WHERE r.lecturer_id = ?
    ORDER BY r.rating_id DESC
  `;

  db.query(query, [lecturerId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching ratings:", err);
      return res.status(500).json({ error: "Failed to fetch ratings" });
    }
    res.json(results);
  });
};

// ✅ Get all complaints for a specific lecturer (with student info)
exports.getComplaintsByLecturer = (req, res) => {
  const { lecturerId } = req.params;

  const query = `
    SELECT 
      c.id AS complaint_id, 
      c.complaint_text, 
      c.status,
      c.created_at,
      c.updated_at,
      u.full_names AS student_name, 
      u.user_email AS student_email
    FROM complaints c
    JOIN users u ON c.student_id = u.user_id
    WHERE c.lecturer_id = ?
    ORDER BY c.id DESC
  `;

  db.query(query, [lecturerId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching complaints:", err);
      return res.status(500).json({ error: "Failed to fetch complaints" });
    }
    res.json(results);
  });
};

// ✅ Get summary of ALL lecturers' ratings (for Principal view)
exports.getRatingsSummary = (req, res) => {
  const query = `
    SELECT 
      u.user_id AS lecturer_id,
      u.full_names AS lecturer_name,
      u.user_email,
      COUNT(r.rating_id) AS total_ratings,
      AVG(r.rating_value) AS avg_rating,
      SUM(CASE WHEN r.rating_value = 5 THEN 1 ELSE 0 END) AS five_star,
      SUM(CASE WHEN r.rating_value = 4 THEN 1 ELSE 0 END) AS four_star,
      SUM(CASE WHEN r.rating_value = 3 THEN 1 ELSE 0 END) AS three_star,
      SUM(CASE WHEN r.rating_value = 2 THEN 1 ELSE 0 END) AS two_star,
      SUM(CASE WHEN r.rating_value = 1 THEN 1 ELSE 0 END) AS one_star
    FROM users u
    LEFT JOIN ratings r ON u.user_id = r.lecturer_id
    WHERE u.user_role = 'lecturer'
    GROUP BY u.user_id, u.full_names, u.user_email
    ORDER BY avg_rating DESC;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching ratings summary:", err);
      return res.status(500).json({ error: "Failed to fetch ratings summary" });
    }
    res.json(results);
  });
};

// ✅ Get detailed ratings for a specific lecturer (for drill-down)
exports.getRatingsDetails = (req, res) => {
  const { lecturerId } = req.params;

  const query = `
    SELECT 
      r.rating_value,
      ur.full_names AS rater_name,
      ur.user_role AS rater_role,
      ur.user_email AS rater_email
    FROM ratings r
    JOIN users ur ON r.student_id = ur.user_id
    WHERE r.lecturer_id = ?
    ORDER BY r.rating_id DESC
  `;

  db.query(query, [lecturerId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching rating details:", err);
      return res.status(500).json({ error: "Failed to fetch rating details" });
    }
    res.json(results);
  });
};
