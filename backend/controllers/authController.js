const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prismaClient");

// JWT iz .env fajla
const JWT_SECRET = process.env.JWT_SECRET;

//Register controller
exports.register = async (req, res) => {
  try {
    const { email, username, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Korisnik sa tim emailom vec ostoji." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: role || "GUEST",
      },
    });

    const token = jwt.sign(
      { userId: newUser.id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "1h" },
    );

    return res.status(201).json({
      message: "Usjesna registracija.",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Greska u serveru" });
  }
};

//Login controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: "Neispravan email i password." });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Neispravan email ili password" });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Usjesna prijava",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Greska u serveru" });
  }
};
