const TimeSlot = require("../models/TimeSlot");

// Get all time slots
exports.getAllTimeSlots = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find();
    res.status(200).json(timeSlots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new time slot
exports.createTimeSlot = async (req, res) => {
  try {
    const timeSlot = new TimeSlot(req.body);
    const savedTimeSlot = await timeSlot.save();
    res.status(201).json(savedTimeSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single time slot
exports.getTimeSlot = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findById(req.params.id);
    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }
    res.status(200).json(timeSlot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a time slot
exports.updateTimeSlot = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }
    res.status(200).json(timeSlot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a time slot
exports.deleteTimeSlot = async (req, res) => {
  try {
    const timeSlot = await TimeSlot.findByIdAndDelete(req.params.id);
    if (!timeSlot) {
      return res.status(404).json({ message: "Time slot not found" });
    }
    res.status(200).json({ message: "Time slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
