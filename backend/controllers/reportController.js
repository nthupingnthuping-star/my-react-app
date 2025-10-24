const pool = require("../db");

// 🔒 Get all reports for a specific lecturer (by user_id)
exports.getReportsByLecturer = (req, res) => {
  const { userId } = req.params;

  if (isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  const query = "SELECT * FROM lecturer_reports WHERE user_id = ?";
  pool.query(query, [userId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching reports:", err);
      return res.status(500).json({ error: "Failed to fetch reports" });
    }
    res.json(results);
  });
};

// 🔒 Get a single report by ID
exports.getReportById = (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid report ID" });
  }

  const query = "SELECT * FROM lecturer_reports WHERE report_id = ?";
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching report:", err);
      return res.status(500).json({ error: "Failed to fetch report" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(results[0]);
  });
};

// ✅ Create a new report
exports.createReport = (req, res) => {
  const {
    user_id,
    week_of_reporting,
    date_of_lecture,
    class_id,
    topic_taught,
    learning_outcome,
    lecturer_recommendations,
    number_of_students_present,
    total_number_of_students_registered,
  } = req.body;

  // Validate required fields
  if (!user_id || !week_of_reporting || !date_of_lecture || !class_id || !topic_taught) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (isNaN(user_id)) {
    return res.status(400).json({ error: "Invalid user_id" });
  }

  const query = `
    INSERT INTO lecturer_reports (
      user_id,
      week_of_reporting,
      date_of_lecture,
      class_id,
      topic_taught,
      learning_outcome,
      lecturer_recommendations,
      number_of_students_present,
      total_number_of_students_registered,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  pool.query(
    query,
    [
      user_id,
      week_of_reporting,
      date_of_lecture,
      class_id,
      topic_taught,
      learning_outcome,
      lecturer_recommendations,
      number_of_students_present,
      total_number_of_students_registered,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error creating report:", err);
        return res.status(500).json({ error: "Failed to create report" });
      }

      res.status(201).json({
        message: "✅ Report created successfully",
        reportId: result.insertId,
      });
    }
  );
};

// ✏️ Update report — verify ownership + 5-minute rule
exports.updateReport = (req, res) => {
  const { id } = req.params;
  const {
    user_id,
    week_of_reporting,
    date_of_lecture,
    class_id,
    topic_taught,
    learning_outcome,
    lecturer_recommendations,
    number_of_students_present,
    total_number_of_students_registered,
  } = req.body;

  if (isNaN(id) || isNaN(user_id)) {
    return res.status(400).json({ error: "Invalid ID(s)" });
  }

  const checkQuery =
    "SELECT created_at FROM lecturer_reports WHERE report_id = ? AND user_id = ?";
  pool.query(checkQuery, [id, user_id], (err, results) => {
    if (err) {
      console.error("❌ DB error during ownership check:", err);
      return res.status(500).json({ error: "Update failed" });
    }

    if (results.length === 0) {
      return res.status(403).json({ error: "You do not own this report or it does not exist." });
    }

    const createdAt = new Date(results[0].created_at).getTime();
    const now = Date.now();
    const fiveMinutesMs = 5 * 60 * 1000;

    if (now - createdAt > fiveMinutesMs) {
      return res.status(403).json({ error: "Cannot edit report after 5 minutes." });
    }

    const updateQuery = `
      UPDATE lecturer_reports 
      SET 
        week_of_reporting = ?, 
        date_of_lecture = ?, 
        class_id = ?, 
        topic_taught = ?, 
        learning_outcome = ?, 
        lecturer_recommendations = ?, 
        number_of_students_present = ?, 
        total_number_of_students_registered = ?
      WHERE report_id = ? AND user_id = ?
    `;

    pool.query(
      updateQuery,
      [
        week_of_reporting,
        date_of_lecture,
        class_id,
        topic_taught,
        learning_outcome,
        lecturer_recommendations,
        number_of_students_present,
        total_number_of_students_registered,
        id,
        user_id,
      ],
      (err, result) => {
        if (err) {
          console.error("❌ Error updating report:", err);
          return res.status(500).json({ error: "Failed to update report" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Report not found" });
        }

        res.json({ message: "✅ Report updated successfully" });
      }
    );
  });
};

// 🗑️ Delete report — verify ownership + 5-minute rule
exports.deleteReport = (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;

  if (isNaN(id) || isNaN(user_id)) {
    return res.status(400).json({ error: "Invalid ID(s)" });
  }

  const checkQuery =
    "SELECT created_at FROM lecturer_reports WHERE report_id = ? AND user_id = ?";
  pool.query(checkQuery, [id, user_id], (err, results) => {
    if (err) {
      console.error("❌ DB error during ownership check:", err);
      return res.status(500).json({ error: "Delete failed" });
    }

    if (results.length === 0) {
      return res.status(403).json({ error: "You do not own this report or it does not exist." });
    }

    const createdAt = new Date(results[0].created_at).getTime();
    const now = Date.now();
    const fiveMinutesMs = 5 * 60 * 1000;

    if (now - createdAt > fiveMinutesMs) {
      return res.status(403).json({ error: "Cannot delete report after 5 minutes." });
    }

    const deleteQuery =
      "DELETE FROM lecturer_reports WHERE report_id = ? AND user_id = ?";
    pool.query(deleteQuery, [id, user_id], (err, result) => {
      if (err) {
        console.error("❌ Error deleting report:", err);
        return res.status(500).json({ error: "Failed to delete report" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Report not found" });
      }

      res.json({ message: "✅ Report deleted successfully" });
    });
  });
};
