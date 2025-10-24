// backend/controllers/facultiesController.js
const pool = require("../db");

// Get all faculties
exports.getAllFaculties = (req, res) => {
  const query = "SELECT * FROM faculties";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching faculties:", err);
      return res.status(500).json({ error: "Failed to fetch faculties" });
    }
    res.json(results);
  });
};

// Get faculty by ID
exports.getFacultyById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM faculties WHERE faculty_id = ?";
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching faculty:", err);
      return res.status(500).json({ error: "Failed to fetch faculty" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Faculty not found" });
    }
    res.json(results[0]);
  });
};

// Create new faculty
exports.createFaculty = (req, res) => {
  const {
    faculty_name,
  } = req.body;

  // Validate required field
  if (!faculty_name) {
    return res.status(400).json({
      error: "faculty_name is required"
    });
  }

  const query =
    "INSERT INTO faculties (faculty_name) VALUES (?)";

  pool.query(
    query,
    [faculty_name],
    (err, result) => {
      if (err) {
        console.error("❌ Error creating faculty:", err);
        return res.status(500).json({ error: "Failed to create faculty" });
      }
      res.status(201).json({
        message: "Faculty created successfully",
        facultyId: result.insertId,
      });
    }
  );
};

// Update faculty by ID
exports.updateFaculty = (req, res) => {
  const { id } = req.params;
  const {
    faculty_name,
  } = req.body;

  // Validate at least one field is provided
  if (!faculty_name) {
    return res.status(400).json({
      error: "faculty_name is required"
    });
  }

  const query =
    "UPDATE faculties SET faculty_name = ? WHERE faculty_id = ?";

  pool.query(
    query,
    [faculty_name, id],
    (err, result) => {
      if (err) {
        console.error("❌ Error updating faculty:", err);
        return res.status(500).json({ error: "Failed to update faculty" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Faculty not found" });
      }
      res.json({ message: "Faculty updated successfully" });
    }
  );
};

// Delete faculty by ID
exports.deleteFaculty = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM faculties WHERE faculty_id = ?";
  pool.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting faculty:", err);
      return res.status(500).json({ error: "Failed to delete faculty" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Faculty not found" });
    }
    res.json({ message: "Faculty deleted successfully" });
  });
};