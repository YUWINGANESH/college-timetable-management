const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Lecture Hall", "Lab", "Smart Room"],
    trim: true,
  },
  building: {
    type: String,
    required: true,
    trim: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  facilities: [
    {
      type: String,
      trim: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Room", roomSchema);
