const express = require("express");
const router = express.Router();
const {
  getAllTimeSlots,
  createTimeSlot,
  getTimeSlot,
  updateTimeSlot,
  deleteTimeSlot,
} = require("../controllers/timeSlotController");

router.route("/").get(getAllTimeSlots).post(createTimeSlot);
router
  .route("/:id")
  .get(getTimeSlot)
  .put(updateTimeSlot)
  .delete(deleteTimeSlot);

module.exports = router;
