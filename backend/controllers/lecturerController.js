const db = require('../db');

// Get list of lecturers (for dropdowns)
exports.getLecturers = (req, res) => {
  const query = `
    SELECT 
      user_id AS id,
      full_names AS name
    FROM users 
    WHERE user_role = 'lecturer'
    ORDER BY full_names ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('❌ Database error in getLecturers:', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch lecturers list.'
      });
    }

    const lecturers = Array.isArray(results) ? results : [];
    res.status(200).json(lecturers);
  });
  // ✅ Properly closed here — no extra exports inside!
};

// Get summary of all lecturers' ratings
exports.getRatingsSummary = (req, res) => {
  const query = `
    SELECT 
      u.user_id AS lecturer_id,
      u.full_names AS lecturer_name,
      u.user_email,
      COUNT(r.rating_id) AS total_ratings,        -- ✅ FIXED: rating_id not id
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

// Get detailed ratings for a specific lecturer
exports.getRatingsDetails = (req, res) => {
  const { lecturerId } = req.params;
  const query = `
    SELECT 
      r.rating_value, 
      r.created_at, 
      u.full_names AS rater_name, 
      u.user_role AS rater_role
    FROM ratings r
    JOIN users u ON r.student_id = u.user_id
    WHERE r.lecturer_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(query, [lecturerId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching rating details:", err);
      return res.status(500).json({ error: "Failed to fetch rating details" });
    }
    res.json(results);
  });
};