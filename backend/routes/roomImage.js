const express = require("express");
const router = express.Router();
const {
  getImagesForRoom,
  addImageToRoom,
  deleteImage,
} = require("../controllers/roomImageController");
const { verifyToken } = require("../middleware/authMiddleware");

// pretpostavimo da staff moze dodavati, a gosti samo gledati, prilagodi sto zelis

// Dohvat svih slika za sobu
router.get("/rooms/:roomId/images", getImagesForRoom);

// Dodaj sliku sobi
router.post("/rooms/:roomId/images", verifyToken, addImageToRoom);

// Obriši sliku
router.delete("/rooms/:roomId/images/:imageId", verifyToken, deleteImage);

module.exports = router;
