// backend/controllers/authController.js
const db = require("../db"); // ✅ Adjusted path for your setup

// 🟢 Register a new student
exports.register = (req, res) => {
  const { fullNames, user_email, user_password, user_role, faculty_id } = req.body;

  if (!fullNames || !user_email || !user_password || !faculty_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if email already exists
  const checkEmailQuery = "SELECT * FROM users WHERE user_email = ?";
  db.query(checkEmailQuery, [user_email], (err, existingUsers) => {
    if (err) {
      console.error("Error checking existing user:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Insert new student
    const insertQuery = `
      INSERT INTO users (full_names, user_email, user_password, user_role, faculty_id)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(
      insertQuery,
      [fullNames, user_email, user_password, user_role || "student", faculty_id],
      (err, result) => {
        if (err) {
          console.error("Error registering user:", err);
          return res.status(500).json({ message: "Database error" });
        }

        res.status(201).json({
          message: "Registration successful",
          user_email,
          user_role,
        });
      }
    );
  });
};

// 🔐 Login
exports.login = (req, res) => {
  const { email, password } = req.body;

  // Validate
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const query = `
    SELECT user_id, full_names, user_email, user_password, user_role, faculty_id
    FROM users
    WHERE user_email = ? AND user_password = ?
  `;

  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const [firstName, ...rest] = user.full_names.split(" ");
    const lastName = rest.join(" ") || "";

    res.json({
      id: user.user_id,
      firstName,
      lastName,
      email: user.user_email,
      role: user.user_role,
      faculty_id: user.faculty_id,
    });
  });
};
