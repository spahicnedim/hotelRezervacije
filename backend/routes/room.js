const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

const { verifyToken, requireStaff } = require("../middleware/authMiddleware");

router.get("/", roomController.getAllRooms);

router.get("/:id", roomController.getRoomById);

router.post("/", verifyToken, requireStaff, roomController.createRoom);

router.put("/:id", verifyToken, requireStaff, roomController.updateRoom);

router.delete("/:id", verifyToken, requireStaff, roomController.deleteRoom);

module.exports = router;
