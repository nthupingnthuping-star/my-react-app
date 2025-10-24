// backend/controllers/monitoringController.js
const pool = require("../db");

// Get monitoring dashboard for a specific lecturer (using user_id from reports)
exports.getMonitoringByLecturer = (req, res) => {
  const { lecturerId } = req.params;

  const query = `
    SELECT 
      lr.report_id,
      lr.week_of_reporting,
      lr.date_of_lecture,
      lr.class_id,
      lr.topic_taught,
      lr.learning_outcome,
      lr.lecturer_recommendations,
      lr.number_of_students_present,
      lr.total_number_of_students_registered,
      c.class_name,
      c.course_id,
      c.venue,
      c.class_time,
      pf.comments AS feedback
    FROM lecturer_reports lr
    LEFT JOIN classes c ON lr.class_id = c.class_id
    LEFT JOIN principal_feedback pf ON lr.report_id = pf.report_id
    WHERE lr.user_id = ?
    ORDER BY lr.date_of_lecture DESC
  `;

  pool.query(query, [lecturerId], (err, results) => {
    if (err) {
      console.error("❌ Error fetching lecturer monitoring data:", err);
      return res.status(500).json({ error: "Failed to load monitoring dashboard" });
    }

    const totalReports = results.length;
    const totalPresent = results.reduce((sum, r) => sum + (r.number_of_students_present || 0), 0);
    const totalRegistered = results.reduce((sum, r) => sum + (r.total_number_of_students_registered || 0), 0);
    const avgAttendanceRate = totalRegistered > 0 
      ? Math.round((totalPresent / totalRegistered) * 100) 
      : 0;

    const uniqueCourses = [...new Set(results.map(r => r.course_id))].length;

    res.json({
      stats: {
        lecturesDelivered: totalReports,
        avgAttendance: `${avgAttendanceRate}%`,
        courses: uniqueCourses,
      },
      reports: results.map(row => ({
        reportId: row.report_id,
        week: row.week_of_reporting,
        date: row.date_of_lecture,
        topic: row.topic_taught,
        outcome: row.learning_outcome,
        recommendations: row.lecturer_recommendations,
        attendance: {
          present: row.number_of_students_present,
          registered: row.total_number_of_students_registered,
          rate: row.total_number_of_students_registered > 0
            ? Math.round((row.number_of_students_present / row.total_number_of_students_registered) * 100)
            : 0
        },
        class: {
          name: row.class_name || "Unknown Class",
          courseId: row.course_id || row.class_id || "—",
          venue: row.venue || "—",
          schedule: row.class_time || "—"
        },
        feedback: row.feedback || "No feedback yet"
      }))
    });
  });
};

// ✅ Get all reports with principal feedback (for Principal Lecturer)
exports.getAllReportsWithMonitoring = (req, res) => {
  const query = `
    SELECT 
      lr.report_id,
      lr.week_of_reporting,
      lr.date_of_lecture,
      lr.topic_taught,
      lr.learning_outcome,
      lr.lecturer_recommendations,
      lr.number_of_students_present,
      lr.total_number_of_students_registered,
      lr.class_id,
      c.class_name,
      c.course_id,
      c.venue,
      c.class_time,
      lr.user_id AS lecturer_id,
      u.full_names AS lecturer_name,
      u.user_email AS lecturer_email,
      pf.comments AS feedback,
      pf.id AS feedback_id,
      pf.created_at AS feedback_created_at
    FROM lecturer_reports lr
    INNER JOIN users u ON lr.user_id = u.user_id
    LEFT JOIN classes c ON lr.class_id = c.class_id
    LEFT JOIN principal_feedback pf ON lr.report_id = pf.report_id
    ORDER BY lr.date_of_lecture DESC
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching reports with principal feedback:", err);
      return res.status(500).json({ error: "Failed to load reports" });
    }

    const reports = results.map(row => ({
      report_id: row.report_id,
      lecturer: row.lecturer_name || `Lecturer ID: ${row.lecturer_id}`,
      lecturerId: row.lecturer_id,
      lecturerEmail: row.lecturer_email,
      class_id: row.class_id,
      class_name: row.class_name || "Unknown Class",
      courseCode: row.course_id || row.class_id || "—",
      date_of_lecture: row.date_of_lecture,
      week_of_reporting: row.week_of_reporting,
      topic_taught: row.topic_taught,
      learning_outcome: row.learning_outcome,
      lecturer_recommendations: row.lecturer_recommendations,
      number_of_students_present: row.number_of_students_present,
      total_number_of_students_registered: row.total_number_of_students_registered,
      venue: row.venue || "—",
      class_time: row.class_time || "—",
      submittedAt: row.date_of_lecture,
      hasFeedback: !!row.feedback,
      feedback: row.feedback || "",
      feedbackId: row.feedback_id,
      feedbackCreatedAt: row.feedback_created_at
    }));

    res.json(reports);
  });
};

// ✅ NEW: Get lecturer performance based on ratings (for Program Leader)
exports.getLecturerPerformance = (req, res) => {
  const query = `
    SELECT 
      u.user_id AS lecturer_id,
      u.full_names AS lecturer_name,
      u.faculty_id,
      f.faculty_name,
      COUNT(r.rating_id) AS total_ratings,
      AVG(r.rating_value) AS avg_rating,
      GROUP_CONCAT(DISTINCT c.course_id) AS courses
    FROM users u
    LEFT JOIN ratings r ON u.user_id = r.lecturer_id
    LEFT JOIN classes c ON u.user_id = c.lecturer_id
    LEFT JOIN faculties f ON u.faculty_id = f.faculty_id
    WHERE u.user_role = 'lecturer'
    GROUP BY u.user_id, u.full_names, u.faculty_id, f.faculty_name
    ORDER BY avg_rating DESC
  `;

  pool.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching lecturer performance:", err);
      return res.status(500).json({ error: "Failed to load performance data" });
    }

    const totalLecturers = results.length;
    const totalCourses = results.reduce((sum, lec) => {
      return sum + (lec.courses ? lec.courses.split(',').length : 0);
    }, 0);
    
    const validRatings = results.filter(lec => lec.avg_rating != null);
    const avgTeachingRating = validRatings.length > 0
      ? parseFloat((validRatings.reduce((sum, lec) => sum + lec.avg_rating, 0) / validRatings.length).toFixed(1))
      : 0;

    res.json({
      stats: {
        totalLecturers,
        totalCourses,
        avgTeachingRating,
        coursesOnTrack: totalCourses
      },
      lecturers: results.map(lec => ({
        id: lec.lecturer_id,
        name: lec.lecturer_name,
        courses: lec.courses ? lec.courses.split(',') : [],
        teachingRating: lec.avg_rating ? parseFloat(lec.avg_rating.toFixed(1)) : 0,
        faculty: lec.faculty_name || "—",
        totalRatings: lec.total_ratings || 0
      }))
    });
  });
};
