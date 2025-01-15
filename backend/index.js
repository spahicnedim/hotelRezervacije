// index.js
const express = require("express");
const authRoutes = require("./routes/auth");
require("dotenv").config(); // ako koristiš .env za JWT_SECRET itd.

const app = express();

// Za parsiranje JSON tijela:
app.use(express.json());

// Rute
app.use("/auth", authRoutes);

// Pokretanje servera
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server sluša na portu ${PORT}`);
});
