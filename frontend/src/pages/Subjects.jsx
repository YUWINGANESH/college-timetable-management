import React, { useState, useEffect } from "react";
import { LiaBookSolid } from "react-icons/lia";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Subjects.css";

const Subjects = () => {
  const [subjectData, setSubjectData] = useState([]);
  const [newSubject, setNewSubject] = useState({
    name: "",
    subjectId: "",
    type: "",
    department: "",
  });
  const [editingSubject, setEditingSubject] = useState(null);

  const departments = [
    "AERONAUTICAL ENGINEERING",
    "AGRICULTURAL ENGINEERING",
    "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE",
    "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING",
    "AUTOMOBILE ENGINEERING",
    "BIOMEDICAL ENGINEERING",
    "BIOTECHNOLOGY",
    "CHEMISTRY",
    "CIVIL ENGINEERING",
    "COMPUTER SCIENCE AND BUSINESS SYSTEMS",
    "COMPUTER SCIENCE AND DESIGN",
    "COMPUTER SCIENCE AND ENGINEERING",
    "COMPUTER TECHNOLOGY",
    "ELECTRICAL AND ELECTRONICS ENGINEERING",
    "ELECTRONICS AND COMMUNICATION ENGINEERING",
    "ELECTRONICS AND INSTRUMENTATION ENGINEERING",
    "FASHION TECHNOLOGY",
    "FOOD TECHNOLOGY",
    "HUMANITIES",
    "INFORMATION SCIENCE AND ENGINEERING",
    "INFORMATION TECHNOLOGY",
    "MATHEMATICS",
    "MECHANICAL ENGINEERING",
    "MECHATRONICS ENGINEERING",
    "PHYSICAL EDUCATION",
    "PHYSICS",
    "SCHOOL OF MANAGEMENT STUDIES",
    "TEXTILE TECHNOLOGY",
  ];

  const subjectTypes = ["Regular", "Elective", "Lab"];

  // Fetch subjects data when component mounts
  useEffect(() => {
    fetchSubjectsData();
  }, []);

  // Fetch all subjects
  const fetchSubjectsData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/subjects");
      if (!response.ok) {
        throw new Error("Failed to fetch subjects data");
      }
      const data = await response.json();
      setSubjectData(data);
    } catch (error) {
      console.error("Error fetching subjects data:", error);
      alert("Failed to load subjects data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingSubject) {
      setEditingSubject({ ...editingSubject, [name]: value });
    } else {
      setNewSubject({ ...newSubject, [name]: value });
    }
  };

  const handleAddSubject = async () => {
    if (
      newSubject.name &&
      newSubject.subjectId &&
      newSubject.type &&
      newSubject.department
    ) {
      try {
        const response = await fetch("http://localhost:5000/api/subjects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSubject),
        });

        if (!response.ok) {
          throw new Error("Failed to add subject");
        }

        // Refresh subjects data
        fetchSubjectsData();

        // Clear form
        setNewSubject({
          name: "",
          subjectId: "",
          type: "",
          department: "",
        });

        alert("Subject added successfully!");
      } catch (error) {
        console.error("Error adding subject:", error);
        alert("Failed to add subject");
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setNewSubject(subject);
  };

  const handleUpdate = async () => {
    if (
      editingSubject.name &&
      editingSubject.subjectId &&
      editingSubject.type &&
      editingSubject.department
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/subjects/${editingSubject._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editingSubject),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update subject");
        }

        fetchSubjectsData();
        setEditingSubject(null);
        setNewSubject({
          name: "",
          subjectId: "",
          type: "",
          department: "",
        });
        alert("Subject updated successfully!");
      } catch (error) {
        console.error("Error updating subject:", error);
        alert("Failed to update subject");
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/subjects/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete subject");
        }

        fetchSubjectsData();
        alert("Subject deleted successfully!");
      } catch (error) {
        console.error("Error deleting subject:", error);
        alert("Failed to delete subject");
      }
    }
  };

  return (
    <div className="subjects-container">
      <h2>
        <LiaBookSolid /> {editingSubject ? "Edit Subject" : "Add Subject"}
      </h2>
      <div className="form-group">
        <label htmlFor="name">Subject Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={editingSubject ? editingSubject.name : newSubject.name}
          onChange={handleInputChange}
          placeholder="Enter subject name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="subjectId">Subject ID:</label>
        <input
          type="text"
          id="subjectId"
          name="subjectId"
          value={
            editingSubject ? editingSubject.subjectId : newSubject.subjectId
          }
          onChange={handleInputChange}
          placeholder="Enter subject ID"
        />
      </div>
      <div className="form-group">
        <label htmlFor="type">Subject Type:</label>
        <select
          id="type"
          name="type"
          value={editingSubject ? editingSubject.type : newSubject.type}
          onChange={handleInputChange}
          className="subject-select"
        >
          <option value="">Select Type</option>
          {subjectTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="department">Department:</label>
        <select
          id="department"
          name="department"
          value={
            editingSubject ? editingSubject.department : newSubject.department
          }
          onChange={handleInputChange}
          className="department-select"
        >
          <option value="">Select Department</option>
          {departments.map((dept, index) => (
            <option key={index} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <button
        className="btn"
        onClick={editingSubject ? handleUpdate : handleAddSubject}
      >
        {editingSubject ? "Update Subject" : "Add Subject"}
      </button>
      {editingSubject && (
        <button
          className="btn btn-secondary"
          onClick={() => {
            setEditingSubject(null);
            setNewSubject({
              name: "",
              subjectId: "",
              type: "",
              department: "",
            });
          }}
        >
          Cancel Edit
        </button>
      )}

      <h2>Subject List</h2>
      {subjectData.length > 0 ? (
        <ul className="subject-list">
          {subjectData.map((subject) => (
            <li key={subject._id} className="subject-item">
              <div className="subject-info">
                <strong>Name:</strong> {subject.name} <br />
                <strong>ID:</strong> {subject.subjectId} <br />
                <strong>Type:</strong> {subject.type} <br />
                <strong>Department:</strong> {subject.department}
              </div>
              <div className="subject-actions">
                <button
                  className="btn-icon edit"
                  onClick={() => handleEdit(subject)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDelete(subject._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-subjects">No subjects added yet.</p>
      )}
    </div>
  );
};

export default Subjects;
