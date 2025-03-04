const express = require("express");
const router = express.Router();
const { generateTimetable } = require("../controllers/timetableController");

// Route to generate timetable
router.get("/generate", generateTimetable);

module.exports = router;
