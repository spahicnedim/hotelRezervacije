const prisma = require("../models/prismaClient");

const getProfile = async (req, res) => {
  try {
    // req.user treba imati userId
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });
    if (!user) {
      return res.status(404).json({ error: "Korisnik ne postoji" });
    }

    // Možeš vratiti user bez passworda
    const { password, ...safeUserData } = user;
    return res.json({ user: safeUserData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getProfile };
