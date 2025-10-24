// backend/controllers/ratingsController.js
const db = require("../db"); // assuming your db connection is named 'db'

// ✅ Only createRating is needed
exports.createRating = (req, res) => {
  const { student_id, lecturer_id, rating_value } = req.body;

  // Validate required fields
  if (student_id == null || lecturer_id == null || rating_value == null) {
    return res.status(400).json({
      error: "student_id, lecturer_id, and rating_value are required"
    });
  }

  // Validate rating range (1 to 5)
  if (rating_value < 1 || rating_value > 5) {
    return res.status(400).json({
      error: "rating_value must be between 1 and 5"
    });
  }

  // Ensure lecturer exists and is actually a lecturer
  const roleCheckQuery = "SELECT user_role FROM users WHERE user_id = ?";
  db.query(roleCheckQuery, [lecturer_id], (err, userResult) => {
    if (err) {
      console.error("❌ Error checking lecturer:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!userResult.length || userResult[0].user_role !== 'lecturer') {
      return res.status(400).json({ error: "Invalid lecturer ID or user is not a lecturer" });
    }

    // Insert rating
    const insertQuery = "INSERT INTO ratings (student_id, lecturer_id, rating_value) VALUES (?, ?, ?)";
    db.query(insertQuery, [student_id, lecturer_id, rating_value], (err, result) => {
      if (err) {
        // Handle duplicate rating (optional)
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: "You have already rated this lecturer" });
        }
        console.error("❌ Error creating rating:", err);
        return res.status(500).json({ error: "Failed to submit rating" });
      }

      res.status(201).json({
        message: "Rating submitted successfully",
        ratingId: result.insertId,
      });
    });
  });
};