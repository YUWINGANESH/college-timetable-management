const mongoose = require("mongoose");
const Faculty = require("../models/Faculty");
const Subject = require("../models/Subject");
const Room = require("../models/Room");
const TimeSlot = require("../models/TimeSlot");
const Course = require("../models/Course");

const clearCollections = async () => {
  await Faculty.deleteMany({});
  await Subject.deleteMany({});
  await Room.deleteMany({});
  await TimeSlot.deleteMany({});
  await Course.deleteMany({});
};

const seedData = async () => {
  try {
    await clearCollections();
    console.log("Collections cleared");

    // Add Faculty Data
    const facultyData = [
      {
        name: "Dr. Robert Anderson",
        employeeId: "MCT001",
        department: "MECHATRONIC ENGINEERING",
        designation: "Professor",
      },
      {
        name: "Dr. Sarah Mitchell",
        employeeId: "MCT002",
        department: "MECHATRONIC ENGINEERING",
        designation: "Associate Professor",
      },
      {
        name: "Prof. Michael Chen",
        employeeId: "MCT003",
        department: "MECHATRONIC ENGINEERING",
        designation: "Assistant Professor",
      },
      {
        name: "Dr. Emily Turner",
        employeeId: "MCT004",
        department: "MECHATRONIC ENGINEERING",
        designation: "Associate Professor",
      },
      {
        name: "Prof. David Kumar",
        employeeId: "MCT005",
        department: "MECHATRONIC ENGINEERING",
        designation: "Professor",
      },
    ];

    const faculty = await Faculty.insertMany(facultyData);
    console.log("Faculty data seeded successfully");

    // Add Subject Data
    const subjectData = [
      {
        name: "Robotics and Automation",
        subjectId: "MCT701",
        type: "Regular",
        department: "MECHATRONIC ENGINEERING",
      },
      {
        name: "Industrial IoT",
        subjectId: "MCT702",
        type: "Regular",
        department: "MECHATRONIC ENGINEERING",
      },
      {
        name: "Advanced Control Systems",
        subjectId: "MCT703",
        type: "Regular",
        department: "MECHATRONIC ENGINEERING",
      },
      {
        name: "Mechatronic System Design",
        subjectId: "MCT704",
        type: "Regular",
        department: "MECHATRONIC ENGINEERING",
      },
      {
        name: "Smart Manufacturing",
        subjectId: "MCT705",
        type: "Regular",
        department: "MECHATRONIC ENGINEERING",
      },
    ];

    const subjects = await Subject.insertMany(subjectData);
    console.log("Subject data seeded successfully");

    // Add Room Data
    const roomData = [
      {
        roomNumber: "MCT-701",
        capacity: 60,
        type: "Smart Room",
        building: "Mechatronic Block",
        facilities: ["Projector", "Smart Board", "AC"],
        isAvailable: true,
      },
      {
        roomNumber: "MCT-702",
        capacity: 60,
        type: "Smart Room",
        building: "Mechatronic Block",
        facilities: ["Projector", "Smart Board", "AC"],
        isAvailable: true,
      },
    ];

    const rooms = await Room.insertMany(roomData);
    console.log("Room data seeded successfully");

    // Add Time Slot Data
    const timeSlotData = [
      // Monday
      { day: "Monday", startTime: "08:45", endTime: "10:05" },
      { day: "Monday", startTime: "10:25", endTime: "11:45" },
      { day: "Monday", startTime: "12:45", endTime: "14:05" },
      { day: "Monday", startTime: "14:25", endTime: "15:45" },

      // Tuesday
      { day: "Tuesday", startTime: "08:45", endTime: "10:05" },
      { day: "Tuesday", startTime: "10:25", endTime: "11:45" },
      { day: "Tuesday", startTime: "12:45", endTime: "14:05" },
      { day: "Tuesday", startTime: "14:25", endTime: "15:45" },

      // Wednesday
      { day: "Wednesday", startTime: "08:45", endTime: "10:05" },
      { day: "Wednesday", startTime: "10:25", endTime: "11:45" },
      { day: "Wednesday", startTime: "12:45", endTime: "14:05" },
      { day: "Wednesday", startTime: "14:25", endTime: "15:45" },

      // Thursday
      { day: "Thursday", startTime: "08:45", endTime: "10:05" },
      { day: "Thursday", startTime: "10:25", endTime: "11:45" },
      { day: "Thursday", startTime: "12:45", endTime: "14:05" },
      { day: "Thursday", startTime: "14:25", endTime: "15:45" },

      // Friday
      { day: "Friday", startTime: "08:45", endTime: "10:05" },
      { day: "Friday", startTime: "10:25", endTime: "11:45" },
      { day: "Friday", startTime: "12:45", endTime: "14:05" },
      { day: "Friday", startTime: "14:25", endTime: "15:45" },
    ];

    const timeSlots = await TimeSlot.insertMany(timeSlotData);
    console.log("Time Slot data seeded successfully");

    // Add Course Data
    const courseData = [
      {
        semester: 7,
        credits: 4,
        faculty: faculty[0]._id,
        subject: subjects[0]._id,
        lecturesPerWeek: 4,
      },
      {
        semester: 7,
        credits: 4,
        faculty: faculty[1]._id,
        subject: subjects[1]._id,
        lecturesPerWeek: 4,
      },
      {
        semester: 7,
        credits: 4,
        faculty: faculty[2]._id,
        subject: subjects[2]._id,
        lecturesPerWeek: 4,
      },
      {
        semester: 7,
        credits: 4,
        faculty: faculty[3]._id,
        subject: subjects[3]._id,
        lecturesPerWeek: 4,
      },
      {
        semester: 7,
        credits: 4,
        faculty: faculty[4]._id,
        subject: subjects[4]._id,
        lecturesPerWeek: 4,
      },
    ];

    // Process each course before insertion
    for (const course of courseData) {
      // Generate course code
      course.courseCode = await Course.generateCourseCode(
        course.faculty,
        course.subject,
        course.semester
      );

      // Get subject details
      const subjectDetails = await Course.getSubjectDetails(course.subject);
      course.courseName = subjectDetails.name;
      course.department = subjectDetails.department;
    }

    await Course.insertMany(courseData);
    console.log("Course data seeded successfully");

    console.log("All data seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

// Connect to MongoDB and seed data
mongoose
  .connect("mongodb://127.0.0.1:27017/timetable_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    seedData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
