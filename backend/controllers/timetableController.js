const Course = require("../models/Course");
const TimeSlot = require("../models/TimeSlot");
const Room = require("../models/Room");

// Helper function to shuffle array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Helper function to check if a room is available
const isRoomAvailable = (room, timeSlot, existingAssignments) => {
  return !existingAssignments.some(
    (assignment) => assignment.room === room && assignment.timeSlot === timeSlot
  );
};

// Helper function to check if a faculty is available
const isFacultyAvailable = (faculty, timeSlot, existingAssignments) => {
  return !existingAssignments.some(
    (assignment) =>
      assignment.faculty === faculty && assignment.timeSlot === timeSlot
  );
};

// Helper function to check if a course is already scheduled for the day
const isCourseScheduledForDay = (course, day, assignments) => {
  return assignments.some(
    (a) => a.course === course._id.toString() && a.day === day
  );
};

// Helper function to get available time slots for a day
const getAvailableTimeSlotsForDay = (day, timeSlots, assignments, course) => {
  return timeSlots.filter(
    (slot) =>
      slot.day === day &&
      !assignments.some((a) => a.timeSlot === slot._id.toString()) &&
      !isCourseScheduledForDay(course, day, assignments)
  );
};

// Generate timetable for a specific semester and department
exports.generateTimetable = async (req, res) => {
  try {
    const { semester, department } = req.query;
    console.log("Generating timetable for:", { semester, department });

    if (!semester || !department) {
      return res.status(400).json({
        success: false,
        message: "Semester and department are required",
      });
    }

    // Fetch all required data
    const courses = await Course.find({ semester, department })
      .populate("faculty")
      .populate("subject");

    const timeSlots = await TimeSlot.find({}).sort({ day: 1, startTime: 1 });
    const rooms = await Room.find({});

    if (!courses.length) {
      return res.status(404).json({
        success: false,
        message: "No courses found for the specified semester and department",
      });
    }

    // Initialize timetable and assignments
    const timetable = {};
    timeSlots.forEach((slot) => {
      timetable[slot._id] = {
        timeSlot: slot,
        assignments: [],
      };
    });

    const assignments = [];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // Create a pool of all required lectures
    let lecturePool = [];
    courses.forEach((course) => {
      for (let i = 0; i < course.lecturesPerWeek; i++) {
        lecturePool.push(course);
      }
    });

    // Shuffle the lecture pool for random distribution
    lecturePool = shuffleArray(lecturePool);

    // Assign lectures from the pool
    for (const lecture of lecturePool) {
      let assigned = false;

      // Try each day randomly
      const shuffledDays = shuffleArray([...days]);

      for (const day of shuffledDays) {
        // Skip if course is already scheduled for this day
        if (isCourseScheduledForDay(lecture, day, assignments)) {
          continue;
        }

        const availableSlots = getAvailableTimeSlotsForDay(
          day,
          timeSlots,
          assignments,
          lecture
        );

        // Shuffle available slots for randomization
        const shuffledSlots = shuffleArray([...availableSlots]);

        for (const timeSlot of shuffledSlots) {
          // Shuffle rooms for randomization
          const shuffledRooms = shuffleArray([...rooms]);

          for (const room of shuffledRooms) {
            if (
              isRoomAvailable(
                room._id.toString(),
                timeSlot._id.toString(),
                assignments
              ) &&
              isFacultyAvailable(
                lecture.faculty._id.toString(),
                timeSlot._id.toString(),
                assignments
              )
            ) {
              // Add assignment to timetable
              timetable[timeSlot._id].assignments.push({
                course: lecture._id,
                courseName: lecture.courseName,
                faculty: lecture.faculty.name,
                room: room.roomNumber,
                subject: lecture.subject.name,
              });

              // Track assignment
              assignments.push({
                course: lecture._id.toString(),
                faculty: lecture.faculty._id.toString(),
                room: room._id.toString(),
                timeSlot: timeSlot._id.toString(),
                day: day,
                subject: lecture.subject._id.toString(),
              });

              assigned = true;
              break;
            }
          }
          if (assigned) break;
        }
        if (assigned) break;
      }

      if (!assigned) {
        return res.status(400).json({
          success: false,
          message: `Could not schedule all lectures for ${lecture.courseName}. Please check for scheduling conflicts.`,
        });
      }
    }

    // Format timetable for response
    const formattedTimetable = Object.values(timetable).map((slot) => ({
      timeSlot: {
        day: slot.timeSlot.day,
        startTime: slot.timeSlot.startTime,
        endTime: slot.timeSlot.endTime,
      },
      assignments: slot.assignments,
    }));

    return res.status(200).json({
      success: true,
      data: formattedTimetable,
    });
  } catch (error) {
    console.error("Error generating timetable:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating timetable",
      error: error.message,
    });
  }
};
