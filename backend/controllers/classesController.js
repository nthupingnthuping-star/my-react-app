// backend/controllers/classesController.js
const pool = require("../db");

// Get all classes
exports.getAllClasses = (req, res) => {
  const query = "SELECT * FROM classes";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching classes:", err);
      return res.status(500).json({ error: "Failed to fetch classes" });
    }
    res.json(results);
  });
};

// Get class by ID
exports.getClassById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM classes WHERE class_id = ?";
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching class:", err);
      return res.status(500).json({ error: "Failed to fetch class" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(results[0]);
  });
};

// Create new class
exports.createClass = (req, res) => {
  const {
    course_id,
    lecturer_id,
    class_name,
    venue,
    class_time,
  } = req.body;

  const query =
    "INSERT INTO classes (course_id, lecturer_id, class_name, venue, class_time) VALUES (?, ?, ?, ?, ?)";

  pool.query(
    query,
    [course_id, lecturer_id, class_name, venue, class_time],
    (err, result) => {
      if (err) {
        console.error("❌ Error creating class:", err);
        return res.status(500).json({ error: "Failed to create class" });
      }
      res.status(201).json({
        message: "Class created successfully",
        classId: result.insertId,
      });
    }
  );
};

// Update class by ID
exports.updateClass = (req, res) => {
  const { id } = req.params;
  const {
    course_id,
    lecturer_id,
    class_name,
    venue,
    class_time,
  } = req.body;

  const query =
    "UPDATE classes SET course_id = ?, lecturer_id = ?, class_name = ?, venue = ?, class_time = ? WHERE class_id = ?";

  pool.query(
    query,
    [course_id, lecturer_id, class_name, venue, class_time, id],
    (err, result) => {
      if (err) {
        console.error("❌ Error updating class:", err);
        return res.status(500).json({ error: "Failed to update class" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Class not found" });
      }
      res.json({ message: "Class updated successfully" });
    }
  );
};

// Delete class by ID
exports.deleteClass = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM classes WHERE class_id = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting class:", err);
      return res.status(500).json({ error: "Failed to delete class" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json({ message: "Class deleted successfully" });
  });
};