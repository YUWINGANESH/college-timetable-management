import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBook,
  FaDoorOpen,
  FaClock,
  FaGraduationCap,
  FaTable,
} from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>TimeTable</h2>
      </div>
      <nav className="nav-menu">
        <Link to="/" className={`nav-link ${isActive("/")}`}>
          <FaHome className="nav-icon" />
          <span>Dashboard</span>
        </Link>
        <Link to="/faculty" className={`nav-link ${isActive("/faculty")}`}>
          <FaUsers className="nav-icon" />
          <span>Faculty</span>
        </Link>
        <Link to="/subjects" className={`nav-link ${isActive("/subjects")}`}>
          <FaBook className="nav-icon" />
          <span>Subjects</span>
        </Link>
        <Link to="/rooms" className={`nav-link ${isActive("/rooms")}`}>
          <FaDoorOpen className="nav-icon" />
          <span>Rooms</span>
        </Link>
        <Link to="/timeslots" className={`nav-link ${isActive("/timeslots")}`}>
          <FaClock className="nav-icon" />
          <span>Time Slots</span>
        </Link>
        <Link to="/courses" className={`nav-link ${isActive("/courses")}`}>
          <FaGraduationCap className="nav-icon" />
          <span>Courses</span>
        </Link>
        <Link to="/timetable" className={`nav-link ${isActive("/timetable")}`}>
          <FaTable className="nav-icon" />
          <span>Generate Timetable</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
