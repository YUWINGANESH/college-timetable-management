import React, { useState, useEffect } from "react";
import { FaUserTie, FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Faculty.css"; // Adjust the path to the CSS file

const Faculty = () => {
  const [facultyData, setFacultyData] = useState([]);
  const [newFaculty, setNewFaculty] = useState({
    name: "",
    employeeId: "",
    department: "",
    designation: "",
  });
  const [editingFaculty, setEditingFaculty] = useState(null);

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

  // Fetch faculty data when component mounts
  useEffect(() => {
    fetchFacultyData();
  }, []);

  // Fetch all faculty members
  const fetchFacultyData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/faculty");
      if (!response.ok) {
        throw new Error("Failed to fetch faculty data");
      }
      const data = await response.json();
      setFacultyData(data);
    } catch (error) {
      console.error("Error fetching faculty data:", error);
      alert("Failed to load faculty data");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingFaculty) {
      setEditingFaculty({ ...editingFaculty, [name]: value });
    } else {
      setNewFaculty({ ...newFaculty, [name]: value });
    }
  };

  const handleAddFaculty = async () => {
    if (
      newFaculty.name &&
      newFaculty.employeeId &&
      newFaculty.department &&
      newFaculty.designation
    ) {
      try {
        const response = await fetch("http://localhost:5000/api/faculty", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newFaculty),
        });

        if (!response.ok) {
          throw new Error("Failed to add faculty member");
        }

        // Refresh faculty data
        fetchFacultyData();

        // Clear form
        setNewFaculty({
          name: "",
          employeeId: "",
          department: "",
          designation: "",
        });

        alert("Faculty member added successfully!");
      } catch (error) {
        console.error("Error adding faculty:", error);
        alert("Failed to add faculty member");
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleEdit = (faculty) => {
    setEditingFaculty(faculty);
    setNewFaculty(faculty);
  };

  const handleUpdate = async () => {
    if (
      editingFaculty.name &&
      editingFaculty.employeeId &&
      editingFaculty.department &&
      editingFaculty.designation
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/faculty/${editingFaculty._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editingFaculty),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update faculty member");
        }

        fetchFacultyData();
        setEditingFaculty(null);
        setNewFaculty({
          name: "",
          employeeId: "",
          department: "",
          designation: "",
        });
        alert("Faculty member updated successfully!");
      } catch (error) {
        console.error("Error updating faculty:", error);
        alert("Failed to update faculty member");
      }
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this faculty member?")
    ) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/faculty/${id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete faculty member");
        }

        fetchFacultyData();
        alert("Faculty member deleted successfully!");
      } catch (error) {
        console.error("Error deleting faculty:", error);
        alert("Failed to delete faculty member");
      }
    }
  };

  return (
    <div className="faculty-container">
      <h2>
        <FaUserTie /> {editingFaculty ? "Edit Faculty" : "Add Faculty"}
      </h2>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={editingFaculty ? editingFaculty.name : newFaculty.name}
          onChange={handleInputChange}
          placeholder="Enter faculty name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="employeeId">Employee ID:</label>
        <input
          type="text"
          id="employeeId"
          name="employeeId"
          value={
            editingFaculty ? editingFaculty.employeeId : newFaculty.employeeId
          }
          onChange={handleInputChange}
          placeholder="Enter employee ID"
        />
      </div>
      <div className="form-group">
        <label htmlFor="designation">Designation:</label>
        <select
          id="designation"
          name="designation"
          value={
            editingFaculty ? editingFaculty.designation : newFaculty.designation
          }
          onChange={handleInputChange}
          className="designation-select"
        >
          <option value="">Select Designation</option>
          <option value="Professor">Professor</option>
          <option value="Associate Professor">Associate Professor</option>
          <option value="Assistant Professor">Assistant Professor</option>
          <option value="Lecturer">Lecturer</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="department">Department:</label>
        <select
          id="department"
          name="department"
          value={
            editingFaculty ? editingFaculty.department : newFaculty.department
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
        onClick={editingFaculty ? handleUpdate : handleAddFaculty}
      >
        {editingFaculty ? "Update Faculty" : "Add Faculty"}
      </button>
      {editingFaculty && (
        <button
          className="btn btn-secondary"
          onClick={() => {
            setEditingFaculty(null);
            setNewFaculty({
              name: "",
              employeeId: "",
              department: "",
              designation: "",
            });
          }}
        >
          Cancel Edit
        </button>
      )}

      <h2>Faculty List</h2>
      {facultyData.length > 0 ? (
        <ul className="faculty-list">
          {facultyData.map((faculty) => (
            <li key={faculty._id} className="faculty-item">
              <div className="faculty-info">
                <strong>Name:</strong> {faculty.name} <br />
                <strong>Employee ID:</strong> {faculty.employeeId} <br />
                <strong>Designation:</strong> {faculty.designation} <br />
                <strong>Department:</strong> {faculty.department}
              </div>
              <div className="faculty-actions">
                <button
                  className="btn-icon edit"
                  onClick={() => handleEdit(faculty)}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleDelete(faculty._id)}
                >
                  <FaTrash />
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-faculty">No faculty members added yet.</p>
      )}
    </div>
  );
};

export default Faculty;
