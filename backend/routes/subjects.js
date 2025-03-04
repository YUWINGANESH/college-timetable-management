const express = require("express");
const router = express.Router();
const {
  getAllSubjects,
  createSubject,
  getSubjectById,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");

// Get all subjects
router.get("/", getAllSubjects);

// Create new subject
router.post("/", createSubject);

// Get subject by ID
router.get("/:id", getSubjectById);

// Update subject
router.put("/:id", updateSubject);

// Delete subject
router.delete("/:id", deleteSubject);

module.exports = router;
