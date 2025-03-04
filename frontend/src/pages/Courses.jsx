import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Courses.css";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [newCourse, setNewCourse] = useState({
    semester: "",
    credits: "",
    faculty: "",
    subject: "",
    lecturesPerWeek: "",
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCourses();
    fetchFaculty();
    fetchSubjects();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
    } catch (error) {
      setError("Error fetching courses");
      console.error("Error fetching courses:", error);
    }
  };

  const fetchFaculty = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/faculty");
      setFaculty(response.data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/subjects");
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const generateCourseId = (facultyId, subjectId, semester) => {
    const selectedFaculty = faculty.find((f) => f._id === facultyId);
    const selectedSubject = subjects.find((s) => s._id === subjectId);

    if (selectedFaculty && selectedSubject && semester) {
      const facultyName = selectedFaculty.name.split(" ")[0].toUpperCase(); // Get first name
      const subjectId = selectedSubject.subjectId;
      return `${facultyName}-${subjectId}-${semester}`;
    }
    return "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingCourse) {
      setEditingCourse({
        ...editingCourse,
        [name]: value,
      });
    } else {
      setNewCourse({
        ...newCourse,
        [name]: value,
      });
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const selectedFaculty = faculty.find((f) => f._id === newCourse.faculty);
      const selectedSubject = subjects.find((s) => s._id === newCourse.subject);

      const courseData = {
        ...newCourse,
        courseCode: generateCourseId(
          newCourse.faculty,
          newCourse.subject,
          newCourse.semester
        ),
        courseName: selectedSubject.name,
        department: selectedSubject.department,
      };

      await axios.post("http://localhost:5000/api/courses", courseData);
      setNewCourse({
        semester: "",
        credits: "",
        faculty: "",
        subject: "",
        lecturesPerWeek: "",
      });
      fetchCourses();
      alert("Course added successfully!");
    } catch (error) {
      setError("Error adding course");
      console.error("Error adding course:", error);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse({
      ...course,
      faculty: course.faculty._id,
      subject: course.subject._id,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const courseData = {
        ...editingCourse,
        courseCode: generateCourseId(
          editingCourse.faculty,
          editingCourse.subject,
          editingCourse.semester
        ),
        courseName: subjects.find((s) => s._id === editingCourse.subject)?.name,
        department: subjects.find((s) => s._id === editingCourse.subject)
          ?.department,
      };

      await axios.put(
        `http://localhost:5000/api/courses/${editingCourse._id}`,
        courseData
      );
      setEditingCourse(null);
      fetchCourses();
      alert("Course updated successfully!");
    } catch (error) {
      setError("Error updating course");
      console.error("Error updating course:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:5000/api/courses/${id}`);
        fetchCourses();
        alert("Course deleted successfully!");
      } catch (error) {
        setError("Error deleting course");
        console.error("Error deleting course:", error);
      }
    }
  };

  return (
    <div className="courses-container">
      <h2>Manage Courses</h2>
      {error && <div className="error-message">{error}</div>}

      <form
        onSubmit={editingCourse ? handleUpdate : handleAddCourse}
        className="course-form"
      >
        <div className="form-group">
          <select
            name="subject"
            value={editingCourse ? editingCourse.subject : newCourse.subject}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.subjectId})
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <select
            name="faculty"
            value={editingCourse ? editingCourse.faculty : newCourse.faculty}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Faculty</option>
            {faculty.map((f) => (
              <option key={f._id} value={f._id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <input
            type="number"
            name="semester"
            placeholder="Semester"
            value={editingCourse ? editingCourse.semester : newCourse.semester}
            onChange={handleInputChange}
            required
            min="1"
            max="8"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="credits"
            placeholder="Credits"
            value={editingCourse ? editingCourse.credits : newCourse.credits}
            onChange={handleInputChange}
            required
            min="1"
            max="5"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="lecturesPerWeek"
            placeholder="Lectures Per Week"
            value={
              editingCourse
                ? editingCourse.lecturesPerWeek
                : newCourse.lecturesPerWeek
            }
            onChange={handleInputChange}
            required
            min="1"
          />
        </div>
        <button type="submit" className="btn">
          {editingCourse ? "Update Course" : "Add Course"}
        </button>
        {editingCourse && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setEditingCourse(null)}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="courses-list">
        {courses.map((course) => (
          <div key={course._id} className="course-item">
            <div className="course-info">
              <h3>{course.courseCode}</h3>
              <p>Subject: {course.subject.name}</p>
              <p>Faculty: {course.faculty.name}</p>
              <p>Semester: {course.semester}</p>
              <p>Credits: {course.credits}</p>
              <p>Lectures Per Week: {course.lecturesPerWeek}</p>
            </div>
            <div className="course-actions">
              <button
                className="btn-icon edit"
                onClick={() => handleEdit(course)}
              >
                <FaEdit />
              </button>
              <button
                className="btn-icon delete"
                onClick={() => handleDelete(course._id)}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
