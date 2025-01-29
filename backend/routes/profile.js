const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/profileController");

// middleware
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, getProfile);

module.exports = router;
