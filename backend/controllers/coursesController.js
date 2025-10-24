// backend/controllers/coursesController.js
const db = require('../db');

// GET all courses
const getAllCourses = (req, res) => {
  const query = 'SELECT * FROM courses ORDER BY course_id DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }
    res.json(results);
  });
};

// POST: Create new course
const createCourse = (req, res) => {
  const { faculty_id, lecturer_id, course_name, course_code, credits, semester } = req.body;

  // ✅ Validate ALL required fields (including lecturer_id)
  if (
    !faculty_id || 
    lecturer_id == null ||  // Allow 0 as valid, but not undefined/null
    !course_name || 
    !course_code || 
    credits == null || 
    !semester
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO courses (faculty_id, lecturer_id, course_name, course_code, credits, semester)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [faculty_id, lecturer_id, course_name, course_code, credits, semester],
    (err, result) => {
      if (err) {
        console.error('DB Insert Error:', err);
        return res.status(500).json({ error: 'Failed to create course' });
      }
      res.status(201).json({ courseId: result.insertId });
    }
  );
};

// PUT: Update course
const updateCourse = (req, res) => {
  const { id } = req.params;
  const { faculty_id, lecturer_id, course_name, course_code, credits, semester } = req.body;

  const query = `
    UPDATE courses
    SET 
      faculty_id = ?, 
      lecturer_id = ?, 
      course_name = ?, 
      course_code = ?, 
      credits = ?, 
      semester = ?
    WHERE course_id = ?
  `;

  db.query(
    query,
    [faculty_id, lecturer_id, course_name, course_code, credits, semester, id],
    (err, result) => {
      if (err) {
        console.error('DB Update Error:', err);
        return res.status(500).json({ error: 'Failed to update course' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }
      res.json({ message: 'Course updated successfully' });
    }
  );
};

// DELETE: Remove course
const deleteCourse = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM courses WHERE course_id = ?';

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('DB Delete Error:', err);
      return res.status(500).json({ error: 'Failed to delete course' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  });
};

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
};