import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Faculty from "./pages/Faculty";
import Subjects from "./pages/Subjects";
import Rooms from "./pages/Rooms";
import TimeSlots from "./pages/TimeSlots";
import Courses from "./pages/Courses";
import TimeTable from "./pages/TimeTable";
import "./styles/Layout.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/subjects" element={<Subjects />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/timeslots" element={<TimeSlots />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/timetable" element={<TimeTable />} />
          </Routes>
          <footer className="footer">
            <p>
              &copy; 2024 College Timetable Management System. All rights
              reserved.
            </p>
          </footer>
        </main>
      </div>
    </Router>
  );
}

export default App;
