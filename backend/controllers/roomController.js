const prisma = require("../models/prismaClient");

// GET: sve sobe
const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    return res.json(rooms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// GET: jedna soba po ID
const getRoomById = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id, 10);

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({ error: "Soba nije pronađena" });
    }
    return res.json(room);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// POST: kreiranje nove sobe
const createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType, description, price, imageUrl } = req.body;

    // Provjera postoji li vec soba s tim brojem
    const existingRoom = await prisma.room.findUnique({
      where: { roomNumber },
    });
    if (existingRoom) {
      return res.status(400).json({ error: "Soba s tim brojem već postoji." });
    }

    // Kreiramo novu sobu
    const newRoom = await prisma.room.create({
      data: {
        roomNumber,
        roomType,
        description,
        price, // moze biti decimal ili null
        imageUrl, // moze biti null ako nije poslano
      },
    });

    return res.status(201).json(newRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// PUT: ažuriranje sobe
const updateRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id, 10);
    const { roomNumber, roomType, description, price, imageUrl } = req.body;

    // Provjeri postoji li soba
    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!existingRoom) {
      return res.status(404).json({ error: "Soba nije pronađena" });
    }

    // Ažuriraj
    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        roomNumber,
        roomType,
        description,
        price,
        imageUrl,
      },
    });

    return res.json(updatedRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

// DELETE: brisanje sobe
const deleteRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id, 10);

    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!existingRoom) {
      return res.status(404).json({ error: "Soba nije pronađena" });
    }

    await prisma.room.delete({
      where: { id: roomId },
    });

    return res.json({ message: "Soba uspješno obrisana" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};
