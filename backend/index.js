// index.js
const express = require("express");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");
const reservationRoutes = require("./routes/reservation");
const reviewRoutes = require("./routes/review");
const profile = require("./routes/profile");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
// Za parsiranje JSON tijela:
app.use(express.json());

// Rute
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);
app.use("/reservation", reservationRoutes);
app.use("/reviews", reviewRoutes);
app.use("/profile", profile);

// Pokretanje servera
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server sluša na portu ${PORT}`);
});
