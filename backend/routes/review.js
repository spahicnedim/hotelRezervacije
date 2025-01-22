// routes/review.js
const express = require("express");
const router = express.Router();
const {
  createReview,
  getAllReviewsForRoom,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// Middleware za autentikaciju (svi korisnici trebaju token)
const { verifyToken } = require("../middleware/authMiddleware");

// 1. Kreiranje recenzije (POST /reviews)
router.post("/", verifyToken, createReview);

// 2. Dohvat recenzija za određenu sobu (GET /reviews/room/:roomId)
router.get("/room/:roomId", getAllReviewsForRoom);

// 3. Dohvat pojedinačne recenzije (GET /reviews/:id)
router.get("/:id", getReviewById);

// 4. Ažuriranje recenzije (PUT /reviews/:id)
router.put("/:id", verifyToken, updateReview);

// 5. Brisanje recenzije (DELETE /reviews/:id)
router.delete("/:id", verifyToken, deleteReview);

module.exports = router;
