// index.js
const express = require("express");
const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/room");
require("dotenv").config(); // ako koristiš .env za JWT_SECRET itd.

const app = express();

// Za parsiranje JSON tijela:
app.use(express.json());

// Rute
app.use("/auth", authRoutes);
app.use("/rooms", roomRoutes);

// Pokretanje servera
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server sluša na portu ${PORT}`);
});
