const express = require("express");
const router = express.Router();
const {
  getAllFaculty,
  createFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");

// Get all faculty members
router.get("/", getAllFaculty);

// Create new faculty member
router.post("/", createFaculty);

// Get faculty member by ID
router.get("/:id", getFacultyById);

// Update faculty member
router.put("/:id", updateFaculty);

// Delete faculty member
router.delete("/:id", deleteFaculty);

module.exports = router;
