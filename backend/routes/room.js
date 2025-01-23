const express = require("express");
const router = express.Router();
const {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/roomController");

const { verifyToken, requireStaff } = require("../middleware/authMiddleware");

router.get("/", getAllRooms);

router.get("/:id", getRoomById);

router.post("/", verifyToken, requireStaff, createRoom);

router.put("/:id", verifyToken, requireStaff, updateRoom);

router.delete("/:id", verifyToken, requireStaff, deleteRoom);

module.exports = router;
