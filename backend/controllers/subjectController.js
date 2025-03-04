const Subject = require("../models/Subject");

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new subject
exports.createSubject = async (req, res) => {
  const subject = new Subject(req.body);
  try {
    const newSubject = await subject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
      res.status(200).json(subject);
    } else {
      res.status(404).json({ message: "Subject not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
      Object.assign(subject, req.body);
      const updatedSubject = await subject.save();
      res.status(200).json(updatedSubject);
    } else {
      res.status(404).json({ message: "Subject not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (subject) {
      await subject.deleteOne();
      res.status(200).json({ message: "Subject deleted successfully" });
    } else {
      res.status(404).json({ message: "Subject not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
