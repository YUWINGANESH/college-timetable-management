const Course = require("../models/Course");
const Subject = require("../models/Subject");
const Faculty = require("../models/Faculty");

// Get all courses with populated faculty and subject
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("faculty", "name employeeId")
      .populate("subject", "name subjectId");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    // Verify faculty and subject exist
    const faculty = await Faculty.findById(req.body.faculty);
    const subject = await Subject.findById(req.body.subject);

    if (!faculty || !subject) {
      return res.status(400).json({ message: "Invalid faculty or subject ID" });
    }

    const course = new Course({
      semester: req.body.semester,
      credits: req.body.credits,
      faculty: req.body.faculty,
      subject: req.body.subject,
      lecturesPerWeek: req.body.lecturesPerWeek,
    });

    const savedCourse = await course.save();
    const populatedCourse = await Course.findById(savedCourse._id)
      .populate("faculty", "name employeeId")
      .populate("subject", "name subjectId");

    res.status(201).json(populatedCourse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a single course
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("faculty", "name employeeId")
      .populate("subject", "name subjectId");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  try {
    if (req.body.faculty) {
      const faculty = await Faculty.findById(req.body.faculty);
      if (!faculty) {
        return res.status(400).json({ message: "Invalid faculty ID" });
      }
    }

    if (req.body.subject) {
      const subject = await Subject.findById(req.body.subject);
      if (!subject) {
        return res.status(400).json({ message: "Invalid subject ID" });
      }
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      {
        semester: req.body.semester,
        credits: req.body.credits,
        faculty: req.body.faculty,
        subject: req.body.subject,
        lecturesPerWeek: req.body.lecturesPerWeek,
      },
      { new: true, runValidators: true }
    )
      .populate("faculty", "name employeeId")
      .populate("subject", "name subjectId");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
