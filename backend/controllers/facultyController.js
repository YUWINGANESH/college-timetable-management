const Faculty = require("../models/Faculty");

// Get all faculty members
exports.getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ createdAt: -1 });
    res.status(200).json(faculty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new faculty member
exports.createFaculty = async (req, res) => {
  const faculty = new Faculty(req.body);
  try {
    const newFaculty = await faculty.save();
    res.status(201).json(newFaculty);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get faculty member by ID
exports.getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (faculty) {
      res.status(200).json(faculty);
    } else {
      res.status(404).json({ message: "Faculty member not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update faculty member
exports.updateFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (faculty) {
      Object.assign(faculty, req.body);
      const updatedFaculty = await faculty.save();
      res.status(200).json(updatedFaculty);
    } else {
      res.status(404).json({ message: "Faculty member not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete faculty member
exports.deleteFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (faculty) {
      await faculty.deleteOne();
      res.status(200).json({ message: "Faculty member deleted successfully" });
    } else {
      res.status(404).json({ message: "Faculty member not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
