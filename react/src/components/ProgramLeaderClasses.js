// src/components/ProgramLeaderClasses.jsx
import React, { useState, useEffect } from "react";
import "../style/ProgramLeaderClasses.css"; // ✅ Correct import

function ProgramLeaderClasses({ programLeaderId }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newClass, setNewClass] = useState({
    course_id: "",
    lecturer_id: "",
    class_name: "",
    venue: "",
    class_time: "",
  });

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/classes");
        if (!response.ok) throw new Error("Failed to load classes");
        const data = await response.json();
        setClasses(data);
      } catch (err) {
        console.error("Error fetching classes:", err);
        setError("❌ Failed to load classes.");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingClass) {
      setEditingClass((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewClass((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClass.course_id || !newClass.lecturer_id || !newClass.class_name || !newClass.venue || !newClass.class_time) {
      alert("⚠️ Please fill all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:5000/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: newClass.course_id,
          lecturer_id: parseInt(newClass.lecturer_id, 10),
          class_name: newClass.class_name.trim(),
          venue: newClass.venue.trim(),
          class_time: newClass.class_time.trim(),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Submission failed");
      }

      const result = await response.json();
      setClasses([
        ...classes,
        {
          class_id: result.classId,
          ...newClass,
          lecturer_id: parseInt(newClass.lecturer_id, 10),
        },
      ]);

      setNewClass({
        course_id: "",
        lecturer_id: "",
        class_name: "",
        venue: "",
        class_time: "",
      });
      setShowAddForm(false);
      alert("✅ Class added successfully!");
    } catch (err) {
      console.error("Add class error:", err);
      alert(`❌ ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (cls) => {
    setEditingClass({ ...cls });
  };

  const handleSaveEdit = async () => {
    if (!editingClass) return;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/classes/${editingClass.class_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            course_id: editingClass.course_id,
            lecturer_id: parseInt(editingClass.lecturer_id, 10),
            class_name: editingClass.class_name.trim(),
            venue: editingClass.venue.trim(),
            class_time: editingClass.class_time.trim(),
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Update failed");
      }

      setClasses((prev) =>
        prev.map((c) =>
          c.class_id === editingClass.class_id ? editingClass : c
        )
      );
      setEditingClass(null);
      alert("✅ Class updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert(`❌ ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/classes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Delete failed");
      }

      setClasses((prev) => prev.filter((c) => c.class_id !== id));
      alert("🗑️ Class deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert(`❌ ${err.message}`);
    }
  };

  const handleCancelEdit = () => setEditingClass(null);

  if (loading) {
    return (
      <div className="dashboard-card">
        <h2 className="report-title">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
          Classes Overview
        </h2>
        <p>Loading classes...</p>
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
          Classes Overview
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
        Classes Overview
      </h2>

      {/* Add Class Button */}
      {!showAddForm && !editingClass && (
        <button
          className="add-class-btn"
          onClick={() => setShowAddForm(true)}
        >
          ➕ Add New Class
        </button>
      )}

      {/* Add Class Form */}
      {showAddForm && (
        <div className="form-card">
          <h3>Add New Class</h3>
          <form onSubmit={handleAddClass}>
            <div className="form-grid">
              <input
                type="text"
                name="course_id"
                placeholder="Course ID (e.g., CS401)"
                value={newClass.course_id}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="lecturer_id"
                placeholder="Lecturer ID (e.g., 7)"
                value={newClass.lecturer_id}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="class_name"
                placeholder="Class Name"
                value={newClass.class_name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="venue"
                placeholder="Venue (e.g., Room 301)"
                value={newClass.venue}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="class_time"
                placeholder="Class Time (e.g., Mon & Wed, 10:00-12:00)"
                value={newClass.class_time}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Class"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => {
                  setShowAddForm(false);
                  setNewClass({
                    course_id: "",
                    lecturer_id: "",
                    class_name: "",
                    venue: "",
                    class_time: "",
                  });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Class Form */}
      {editingClass && (
        <div className="form-card">
          <h3>Edit Class</h3>
          <div className="form-grid">
            <input
              type="text"
              name="course_id"
              value={editingClass.course_id}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="lecturer_id"
              value={editingClass.lecturer_id}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="class_name"
              value={editingClass.class_name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="venue"
              value={editingClass.venue}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="class_time"
              value={editingClass.class_time}
              onChange={handleInputChange}
              required
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

      {/* Classes Table */}
      <h3>All Classes</h3>
      {classes.length === 0 ? (
        <p className="no-classes">No classes found.</p>
      ) : (
        <div className="table-container">
          <table className="classes-table">
            <thead>
              <tr>
                <th>Class ID</th>
                <th>Course ID</th>
                <th>Class Name</th>
                <th>Lecturer ID</th>
                <th>Venue</th>
                <th>Class Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.class_id}>
                  <td>{cls.class_id}</td>
                  <td>{cls.course_id}</td>
                  <td>{cls.class_name}</td>
                  <td>{cls.lecturer_id}</td>
                  <td>{cls.venue}</td>
                  <td>{cls.class_time}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditClick(cls)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteClass(cls.class_id)}
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

export default ProgramLeaderClasses;