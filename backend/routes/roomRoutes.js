const express = require("express");
const router = express.Router();
const {
  getAllRooms,
  createRoom,
  getRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

router.route("/").get(getAllRooms).post(createRoom);
router.route("/:id").get(getRoom).put(updateRoom).delete(deleteRoom);

module.exports = router;
