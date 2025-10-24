// src/components/ProgramLeaderCourses.jsx
import React, { useState, useEffect } from "react";
import "../style/ProgramLeaderCourses.css"; // ✅ Correct import

function ProgramLeaderCourses({ programLeaderId }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const defaultFacultyId = 1;

  const [newCourse, setNewCourse] = useState({
    faculty_id: defaultFacultyId,
    lecturer_id: programLeaderId, // 👈 Default to Program Leader's ID
    course_name: "",
    course_code: "",
    credits: 3,
    semester: "Fall 2025",
  });

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        if (!response.ok) throw new Error("Failed to load courses");
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("❌ Failed to load courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingCourse) {
      setEditingCourse((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewCourse((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          faculty_id: parseInt(newCourse.faculty_id, 10),
          lecturer_id: parseInt(newCourse.lecturer_id, 10), // ✅ Now included
          course_name: newCourse.course_name.trim(),
          course_code: newCourse.course_code.trim(),
          credits: parseInt(newCourse.credits, 10),
          semester: newCourse.semester,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Submission failed");
      }

      const result = await response.json();
      setCourses([
        ...courses,
        {
          course_id: result.courseId,
          ...newCourse,
          faculty_id: parseInt(newCourse.faculty_id, 10),
          lecturer_id: parseInt(newCourse.lecturer_id, 10),
          credits: parseInt(newCourse.credits, 10),
        },
      ]);

      setNewCourse({
        faculty_id: defaultFacultyId,
        lecturer_id: programLeaderId,
        course_name: "",
        course_code: "",
        credits: 3,
        semester: "Fall 2025",
      });
      setShowAddForm(false);
      alert("✅ Course added successfully!");
    } catch (err) {
      console.error("Add course error:", err);
      alert(`❌ ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (course) => {
    setEditingCourse({ ...course });
  };

  const handleSaveEdit = async () => {
    if (!editingCourse) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${editingCourse.course_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            faculty_id: parseInt(editingCourse.faculty_id, 10),
            lecturer_id: parseInt(editingCourse.lecturer_id, 10), // ✅ Now included
            course_name: editingCourse.course_name.trim(),
            course_code: editingCourse.course_code.trim(),
            credits: parseInt(editingCourse.credits, 10),
            semester: editingCourse.semester,
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Update failed");
      }

      setCourses((prev) =>
        prev.map((c) =>
          c.course_id === editingCourse.course_id ? editingCourse : c
        )
      );
      setEditingCourse(null);
      alert("✅ Course updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert(`❌ ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Delete failed");
      }

      setCourses((prev) => prev.filter((c) => c.course_id !== id));
      alert("🗑️ Course deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert(`❌ ${err.message}`);
    }
  };

  const handleCancelEdit = () => setEditingCourse(null);

  if (loading) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Course Management
        </h2>
        <p>Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Course Management
        </h2>
        <div className="status-message error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <h2 className="report-title">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
        Course Management
      </h2>
      <p className="subtitle">Manage all courses in the system</p>

      {/* Add Course Button */}
      {!showAddForm && !editingCourse && (
        <button
          className="add-course-btn"
          onClick={() => setShowAddForm(true)}
        >
          ➕ Add New Course
        </button>
      )}

      {/* Add Course Form */}
      {showAddForm && (
        <div className="form-card">
          <h3>Add New Course</h3>
          <form onSubmit={handleAddCourse}>
            <div className="form-grid">
              <input
                type="text"
                name="course_name"
                placeholder="Course Name"
                value={newCourse.course_name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="course_code"
                placeholder="Course Code"
                value={newCourse.course_code}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="credits"
                placeholder="Credits"
                value={newCourse.credits}
                onChange={handleInputChange}
                min="1"
                max="10"
                required
              />
              <select
                name="semester"
                value={newCourse.semester}
                onChange={handleInputChange}
                required
              >
                <option value="Fall 2025">Fall 2025</option>
                <option value="Spring 2026">Spring 2026</option>
                <option value="Summer 2026">Summer 2026</option>
              </select>
              {/* 👇 NEW: Lecturer ID Input */}
              <input
                type="number"
                name="lecturer_id"
                placeholder="Lecturer ID (e.g., 7)"
                value={newCourse.lecturer_id}
                onChange={handleInputChange}
                required
                min="0"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Course"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCourse({
                    faculty_id: defaultFacultyId,
                    lecturer_id: programLeaderId,
                    course_name: "",
                    course_code: "",
                    credits: 3,
                    semester: "Fall 2025",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Course Form */}
      {editingCourse && (
        <div className="form-card">
          <h3>Edit Course</h3>
          <div className="form-grid">
            <input
              type="text"
              name="course_name"
              value={editingCourse.course_name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="course_code"
              value={editingCourse.course_code}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="credits"
              value={editingCourse.credits}
              onChange={handleInputChange}
              min="1"
              max="10"
            />
            <select
              name="semester"
              value={editingCourse.semester}
              onChange={handleInputChange}
            >
              <option value="Fall 2025">Fall 2025</option>
              <option value="Spring 2026">Spring 2026</option>
              <option value="Summer 2026">Summer 2026</option>
            </select>
            {/* 👇 NEW: Lecturer ID Input */}
            <input
              type="number"
              name="lecturer_id"
              placeholder="Lecturer ID"
              value={editingCourse.lecturer_id}
              onChange={handleInputChange}
              required
              min="0"
            />
          </div>
          <div className="form-actions">
            <button
              className="save-btn"
              onClick={handleSaveEdit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
            <button className="cancel-btn" onClick={handleCancelEdit}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <h3>All Courses</h3>
      {courses.length === 0 ? (
        <p className="no-classes">No courses found.</p>
      ) : (
        <div className="table-container">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Lecturer ID</th>
                <th>Credits</th>
                <th>Semester</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.course_id}>
                  <td><strong>{course.course_code}</strong></td>
                  <td>{course.course_name}</td>
                  <td>{course.lecturer_id}</td>
                  <td>{course.credits}</td>
                  <td>{course.semester}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClick(course)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteCourse(course.course_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProgramLeaderCourses;