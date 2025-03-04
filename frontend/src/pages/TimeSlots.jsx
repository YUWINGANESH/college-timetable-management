import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/TimeSlots.css";

const TimeSlots = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [newTimeSlot, setNewTimeSlot] = useState({
    day: "Monday",
    startTime: "",
    endTime: "",
    isAvailable: true,
  });
  const [editingTimeSlot, setEditingTimeSlot] = useState(null);
  const [error, setError] = useState("");

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/timeslots");
      setTimeSlots(response.data);
    } catch (error) {
      setError("Error fetching time slots");
      console.error("Error fetching time slots:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (editingTimeSlot) {
      setEditingTimeSlot({
        ...editingTimeSlot,
        [name]: inputValue,
      });
    } else {
      setNewTimeSlot({
        ...newTimeSlot,
        [name]: inputValue,
      });
    }
  };

  const handleAddTimeSlot = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/timeslots", newTimeSlot);
      setNewTimeSlot({
        day: "Monday",
        startTime: "",
        endTime: "",
        isAvailable: true,
      });
      fetchTimeSlots();
      alert("Time slot added successfully!");
    } catch (error) {
      setError("Error adding time slot");
      console.error("Error adding time slot:", error);
    }
  };

  const handleEdit = (timeSlot) => {
    setEditingTimeSlot(timeSlot);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/timeslots/${editingTimeSlot._id}`,
        editingTimeSlot
      );
      setEditingTimeSlot(null);
      fetchTimeSlots();
      alert("Time slot updated successfully!");
    } catch (error) {
      setError("Error updating time slot");
      console.error("Error updating time slot:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this time slot?")) {
      try {
        await axios.delete(`http://localhost:5000/api/timeslots/${id}`);
        fetchTimeSlots();
        alert("Time slot deleted successfully!");
      } catch (error) {
        setError("Error deleting time slot");
        console.error("Error deleting time slot:", error);
      }
    }
  };

  return (
    <div className="timeslots-container">
      <h2>Manage Time Slots</h2>
      {error && <div className="error-message">{error}</div>}

      <form
        onSubmit={editingTimeSlot ? handleUpdate : handleAddTimeSlot}
        className="timeslot-form"
      >
        <div className="form-group">
          <select
            name="day"
            value={editingTimeSlot ? editingTimeSlot.day : newTimeSlot.day}
            onChange={handleInputChange}
            required
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <input
            type="time"
            name="startTime"
            value={
              editingTimeSlot
                ? editingTimeSlot.startTime
                : newTimeSlot.startTime
            }
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="time"
            name="endTime"
            value={
              editingTimeSlot ? editingTimeSlot.endTime : newTimeSlot.endTime
            }
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isAvailable"
              checked={
                editingTimeSlot
                  ? editingTimeSlot.isAvailable
                  : newTimeSlot.isAvailable
              }
              onChange={handleInputChange}
            />
            Available
          </label>
        </div>
        <button type="submit" className="btn">
          {editingTimeSlot ? "Update Time Slot" : "Add Time Slot"}
        </button>
        {editingTimeSlot && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setEditingTimeSlot(null)}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="timeslots-list">
        {timeSlots.map((timeSlot) => (
          <div key={timeSlot._id} className="timeslot-item">
            <div className="timeslot-info">
              <h3>{timeSlot.day}</h3>
              <p>Start Time: {timeSlot.startTime}</p>
              <p>End Time: {timeSlot.endTime}</p>
              <p>
                Status: {timeSlot.isAvailable ? "Available" : "Not Available"}
              </p>
            </div>
            <div className="timeslot-actions">
              <button
                className="btn-icon edit"
                onClick={() => handleEdit(timeSlot)}
              >
                <FaEdit />
              </button>
              <button
                className="btn-icon delete"
                onClick={() => handleDelete(timeSlot._id)}
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

export default TimeSlots;
