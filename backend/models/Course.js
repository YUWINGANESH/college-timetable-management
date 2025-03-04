const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8,
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  faculty: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  lecturesPerWeek: {
    type: Number,
    required: true,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Static method to generate course code
courseSchema.statics.generateCourseCode = async function (
  facultyId,
  subjectId,
  semester
) {
  const faculty = await mongoose.model("Faculty").findById(facultyId);
  const subject = await mongoose.model("Subject").findById(subjectId);

  if (!faculty || !subject) {
    throw new Error("Faculty or Subject not found");
  }

  const facultyName = faculty.name.split(" ")[0].toUpperCase();
  return `${facultyName}-${subject.subjectId}-${semester}`;
};

// Static method to get subject details
courseSchema.statics.getSubjectDetails = async function (subjectId) {
  const subject = await mongoose.model("Subject").findById(subjectId);
  if (!subject) {
    throw new Error("Subject not found");
  }
  return {
    name: subject.name,
    department: subject.department,
  };
};

// Add a pre-save middleware to populate courseCode, courseName, and department
courseSchema.pre("save", async function (next) {
  try {
    const faculty = await mongoose.model("Faculty").findById(this.faculty);
    const subject = await mongoose.model("Subject").findById(this.subject);

    if (faculty && subject) {
      const facultyName = faculty.name.split(" ")[0].toUpperCase();
      this.courseCode = `${facultyName}-${subject.subjectId}-${this.semester}`;
      this.courseName = subject.name;
      this.department = subject.department;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Course", courseSchema);
