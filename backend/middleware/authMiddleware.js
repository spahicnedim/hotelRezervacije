const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(500).json({ error: "Nedostaje Authorization header" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: "Token nije pronadjen ili je neispravna forma" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: "Neispravan ili istekao token." });
  }
};

const requireStaff = (req, res, next) => {
  if (req.user.role !== "STAFF") {
    return res
      .status(403)
      .json({ error: "Nedovoljno privilegija. Potrebna je uloga STAFF" });
  }
  next();
};

module.exports = {
  verifyToken,
  requireStaff,
};
