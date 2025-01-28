// routes/reservation.js
const express = require("express");
const router = express.Router();
const {
  createReservation,
  getReservation,
  getReservayionById,
  updateReservation,
  deleteReservation,
  getReservationsByRoom,
} = require("../controllers/reservationController");

// middleware
const { verifyToken } = require("../middleware/authMiddleware");

// Svi endpointi za rezervacije zahtijevaju prijavljenog korisnika (verifyToken)

// POST /reservation
router.post("/", verifyToken, createReservation);

// GET /reservation
router.get("/", verifyToken, getReservation);

// GET /reservation/:id
router.get("/:id", verifyToken, getReservayionById);

// PUT /reservation/:id
router.put("/:id", verifyToken, updateReservation);

// DELETE /reservation/:id
router.delete("/:id", verifyToken, deleteReservation);

router.get("/room/:roomId", verifyToken, getReservationsByRoom);

module.exports = router;
