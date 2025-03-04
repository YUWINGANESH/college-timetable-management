import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/TimeTable.css";

const TimeTable = () => {
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(
    "MECHATRONIC ENGINEERING"
  );
  const [selectedSemester, setSelectedSemester] = useState("7");

  const timeSlots = [
    { time: "08:45", type: "class", endTime: "10:05" },
    { time: "10:05", type: "break", endTime: "10:25", label: "Morning Break" },
    { time: "10:25", type: "class", endTime: "11:45" },
    { time: "11:45", type: "break", endTime: "12:45", label: "Lunch Break" },
    { time: "12:45", type: "class", endTime: "14:05" },
    { time: "14:05", type: "break", endTime: "14:25", label: "Evening Break" },
    { time: "14:25", type: "class", endTime: "15:45" },
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    if (selectedDepartment && selectedSemester) {
      fetchTimetable();
    }
  }, [selectedDepartment, selectedSemester]);

  const fetchTimetable = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching timetable with params:", {
        selectedDepartment,
        selectedSemester,
      });

      const response = await axios.get(
        `http://localhost:5000/api/timetable/generate?department=${selectedDepartment}&semester=${selectedSemester}`
      );

      console.log("Timetable API response:", response.data);

      if (response.data.success && response.data.data) {
        console.log("Setting timetable data:", response.data.data);
        setTimetableData(response.data.data);
      } else {
        console.error("No data in response:", response.data);
        setError(response.data.message || "Failed to generate timetable");
      }
    } catch (error) {
      console.error(
        "Error fetching timetable:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || "Failed to fetch timetable");
    } finally {
      setLoading(false);
    }
  };

  const getClassForTimeSlot = (timeSlot, day) => {
    if (!timetableData || !Array.isArray(timetableData)) {
      console.log("No timetable data available");
      return null;
    }

    console.log("Looking for class:", {
      timeSlot,
      day,
      availableSlots: timetableData.map((slot) => ({
        day: slot.timeSlot.day,
        startTime: slot.timeSlot.startTime,
        endTime: slot.timeSlot.endTime,
        hasAssignments: slot.assignments?.length > 0,
      })),
    });

    const slot = timetableData.find(
      (slot) =>
        slot.timeSlot.startTime === timeSlot.time &&
        slot.timeSlot.day === day &&
        slot.assignments &&
        slot.assignments.length > 0
    );

    console.log("Found slot:", slot);
    return slot?.assignments[0];
  };

  return (
    <div className="timetable-container">
      <h2>Generate Timetable</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="controls">
        <div className="form-group">
          <label>Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            disabled={loading}
          >
            <option value="MECHATRONIC ENGINEERING">
              MECHATRONIC ENGINEERING
            </option>
          </select>
        </div>

        <div className="form-group">
          <label>Semester:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            disabled={loading}
          >
            <option value="7">Semester 7</option>
          </select>
        </div>

        <button
          className="generate-btn"
          onClick={fetchTimetable}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Timetable"}
        </button>
      </div>

      {loading ? (
        <div className="loading-message">Generating timetable...</div>
      ) : (
        <div className="timetable-wrapper">
          <table className="timetable">
            <thead>
              <tr>
                <th>Time</th>
                {days.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((timeSlot) => (
                <tr key={timeSlot.time} className={timeSlot.type}>
                  <td className="time-cell">
                    {`${timeSlot.time} - ${timeSlot.endTime}`}
                    {timeSlot.type === "break" && (
                      <div className="break-label">{timeSlot.label}</div>
                    )}
                  </td>
                  {timeSlot.type === "break" ? (
                    <td colSpan={5} className="break-cell">
                      {timeSlot.label}
                    </td>
                  ) : (
                    days.map((day) => {
                      const classInfo = getClassForTimeSlot(timeSlot, day);
                      return (
                        <td
                          key={`${timeSlot.time}-${day}`}
                          className="class-cell"
                        >
                          {classInfo && (
                            <>
                              <div className="subject">{classInfo.subject}</div>
                              <div className="faculty">{classInfo.faculty}</div>
                              <div className="room">{classInfo.room}</div>
                            </>
                          )}
                        </td>
                      );
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TimeTable;
