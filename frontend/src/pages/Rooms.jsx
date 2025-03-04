import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import "../styles/Rooms.css";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    capacity: "",
    type: "Lecture Hall",
    building: "",
    facilities: "",
    isAvailable: true,
  });
  const [editingRoom, setEditingRoom] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/rooms");
      setRooms(response.data);
    } catch (error) {
      setError("Error fetching rooms");
      console.error("Error fetching rooms:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    if (editingRoom) {
      setEditingRoom({
        ...editingRoom,
        [name]: inputValue,
      });
    } else {
      setNewRoom({
        ...newRoom,
        [name]: inputValue,
      });
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      const roomData = {
        ...newRoom,
        facilities: newRoom.facilities.split(",").map((f) => f.trim()),
      };
      await axios.post("http://localhost:5000/api/rooms", roomData);
      setNewRoom({
        roomNumber: "",
        capacity: "",
        type: "Lecture Hall",
        building: "",
        facilities: "",
        isAvailable: true,
      });
      fetchRooms();
      alert("Room added successfully!");
    } catch (error) {
      setError("Error adding room");
      console.error("Error adding room:", error);
    }
  };

  const handleEdit = (room) => {
    setEditingRoom({
      ...room,
      facilities: room.facilities.join(", "),
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const roomData = {
        ...editingRoom,
        facilities: editingRoom.facilities.split(",").map((f) => f.trim()),
      };
      await axios.put(
        `http://localhost:5000/api/rooms/${editingRoom._id}`,
        roomData
      );
      setEditingRoom(null);
      fetchRooms();
      alert("Room updated successfully!");
    } catch (error) {
      setError("Error updating room");
      console.error("Error updating room:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axios.delete(`http://localhost:5000/api/rooms/${id}`);
        fetchRooms();
        alert("Room deleted successfully!");
      } catch (error) {
        setError("Error deleting room");
        console.error("Error deleting room:", error);
      }
    }
  };

  return (
    <div className="rooms-container">
      <h2>Manage Rooms</h2>
      {error && <div className="error-message">{error}</div>}

      <form
        onSubmit={editingRoom ? handleUpdate : handleAddRoom}
        className="room-form"
      >
        <div className="form-group">
          <input
            type="text"
            name="roomNumber"
            placeholder="Room Number"
            value={editingRoom ? editingRoom.roomNumber : newRoom.roomNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={editingRoom ? editingRoom.capacity : newRoom.capacity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <select
            name="type"
            value={editingRoom ? editingRoom.type : newRoom.type}
            onChange={handleInputChange}
            required
          >
            <option value="Lecture Hall">Lecture Hall</option>
            <option value="Lab">Lab</option>
            <option value="Smart Room">Smart Room</option>
          </select>
        </div>
        <div className="form-group">
          <input
            type="text"
            name="building"
            placeholder="Building"
            value={editingRoom ? editingRoom.building : newRoom.building}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="facilities"
            placeholder="Facilities (comma-separated)"
            value={editingRoom ? editingRoom.facilities : newRoom.facilities}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group checkbox">
          <label>
            <input
              type="checkbox"
              name="isAvailable"
              checked={
                editingRoom ? editingRoom.isAvailable : newRoom.isAvailable
              }
              onChange={handleInputChange}
            />
            Available
          </label>
        </div>
        <button type="submit" className="btn">
          {editingRoom ? "Update Room" : "Add Room"}
        </button>
        {editingRoom && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setEditingRoom(null)}
          >
            Cancel Edit
          </button>
        )}
      </form>

      <div className="rooms-list">
        {rooms.map((room) => (
          <div key={room._id} className="room-item">
            <div className="room-info">
              <h3>{room.roomNumber}</h3>
              <p>Building: {room.building}</p>
              <p>Type: {room.type}</p>
              <p>Capacity: {room.capacity}</p>
              <p>Facilities: {room.facilities.join(", ")}</p>
              <p>Status: {room.isAvailable ? "Available" : "Not Available"}</p>
            </div>
            <div className="room-actions">
              <button
                className="btn-icon edit"
                onClick={() => handleEdit(room)}
              >
                <FaEdit />
              </button>
              <button
                className="btn-icon delete"
                onClick={() => handleDelete(room._id)}
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

export default Rooms;
