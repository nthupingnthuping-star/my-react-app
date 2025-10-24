// controllers/complaintController.js
const db = require('../db');

//File a new complaint
exports.fileComplaint = (req, res) => {
  const { student_id, lecturer_id, complaint_text } = req.body;

  if (!student_id || !lecturer_id || !complaint_text?.trim()) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  //Validate lecturer exists and is a lecturer
  const roleCheck = 'SELECT user_role FROM users WHERE user_id = ?';
  db.query(roleCheck, [lecturer_id], (err, user) => {
    if (err || !user.length || user[0].user_role !== 'lecturer') {
      return res.status(400).json({ error: 'Invalid lecturer ID or not a lecturer.' });
    }

    const query = 'INSERT INTO complaints (student_id, lecturer_id, complaint_text) VALUES (?, ?, ?)';
    db.query(query, [student_id, lecturer_id, complaint_text], (err, result) => {
      if (err) {
        console.error('DB Error:', err);
        return res.status(500).json({ error: 'Failed to file complaint.' });
      }
      res.status(201).json({ message: 'Complaint filed successfully!', complaint_id: result.insertId });
    });
  });
};

// Get student's own complaints
exports.getStudentComplaints = (req, res) => {
  const { student_id } = req.params;

  const query = `
    SELECT c.id, c.complaint_text, c.status, c.created_at, c.updated_at,
           u.full_names AS lecturer_name
    FROM complaints c
    JOIN users u ON c.lecturer_id = u.user_id
    WHERE c.student_id = ?
    ORDER BY c.created_at DESC
  `;

  db.query(query, [student_id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch complaints.' });
    }
    res.json(results);
  });
};

// Update complaint (only if <5 min old)
exports.updateComplaint = (req, res) => {
  const { id } = req.params;
  const { student_id, complaint_text } = req.body;

  if (!complaint_text?.trim()) {
    return res.status(400).json({ error: 'Complaint text is required.' });
  }

  const query = 'SELECT created_at FROM complaints WHERE id = ? AND student_id = ?';
  db.query(query, [id, student_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error.' });
    if (!result.length) return res.status(404).json({ error: 'Complaint not found or unauthorized.' });

    const createdAt = new Date(result[0].created_at);
    const now = new Date();
    const diffMin = (now - createdAt) / (1000 * 60);

    if (diffMin > 5) {
      return res.status(403).json({ error: 'You can only edit a complaint within 5 minutes of filing.' });
    }

    const updateQuery = 'UPDATE complaints SET complaint_text = ?, updated_at = NOW() WHERE id = ?';
    db.query(updateQuery, [complaint_text, id], (err) => {
      if (err) return res.status(500).json({ error: 'Update failed.' });
      res.json({ message: 'Complaint updated successfully.' });
    });
  });
};

// Delete complaint (only if <5 min old)
exports.deleteComplaint = (req, res) => {
  const { id } = req.params;
  const { student_id } = req.query;

  const query = 'SELECT created_at FROM complaints WHERE id = ? AND student_id = ?';
  db.query(query, [id, student_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error.' });
    if (!result.length) return res.status(404).json({ error: 'Complaint not found or unauthorized.' });

    const createdAt = new Date(result[0].created_at);
    const now = new Date();
    const diffMin = (now - createdAt) / (1000 * 60);

    if (diffMin > 5) {
      return res.status(403).json({ error: 'You can only delete a complaint within 5 minutes of filing.' });
    }

    const deleteQuery = 'DELETE FROM complaints WHERE id = ?';
    db.query(deleteQuery, [id], (err) => {
      if (err) return res.status(500).json({ error: 'Deletion failed.' });
      res.json({ message: 'Complaint deleted.' });
    });
  });
};
