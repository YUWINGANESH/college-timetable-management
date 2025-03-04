const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

router.route("/").get(getAllCourses).post(createCourse);
router.route("/:id").get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
