const prisma = require("../models/prismaClient");

// GET sve sobe
const getAllRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany();
    return res.json(rooms);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

//GET soba by Id
const getRoomById = async (req, res) => {
  try {
    const roomId = parseInt(re.params.id, 10);

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({ error: "Soba nije pronadjena" });
    }
    res.json(room);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

//POST za kreiranje soba
const createRoom = async (req, res) => {
  try {
    const { roomNumber, roomType } = req.body;

    const existingRoom = await prisma.room.findUnique({
      where: { roomNumber },
    });

    if (existingRoom) {
      return res.status(500).json({ error: "Soba s tim brojem vec postoji." });
    }

    const newRoom = await prisma.room.create({
      data: {
        roomNumber,
        roomType,
      },
    });

    return res.status(200).json(newRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

//PUT update sobe
const updateRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id, 10);
    const { roomNumber, roomType } = req.body;

    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!existingRoom) {
      return res.status(500).json({ error: "Soba nije pronadjena" });
    }

    const updateRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        roomNumber,
        roomType,
      },
    });

    return res.json(updateRoom);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

//DELETE brisanje soba
const deleteRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id, 10);

    const existingRoom = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!existingRoom) {
      return res.status(500).json({ error: "Soba nije pronadjena" });
    }

    await prisma.room.delete({
      where: { id: roomId },
    });

    return res.json({ message: "Soba uspjesno obrisana" });
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
