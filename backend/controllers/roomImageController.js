const prisma = require("../models/prismaClient");

// GET sve slike za sobu
const getImagesForRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId, 10);

    // Provjeri sobu
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      return res.status(404).json({ error: "Soba ne postoji" });
    }

    // Dohvati sve slike
    const images = await prisma.roomImage.findMany({
      where: { roomId },
      orderBy: { id: "asc" }, // ili neko drugo polje
    });

    return res.json(images);
  } catch (error) {
    console.error("Error in getImagesForRoom:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// POST dodaj novu sliku za sobu
const addImageToRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId, 10);
    const { url } = req.body; // ili { url, caption }

    // Provjeri sobu
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      return res.status(404).json({ error: "Soba ne postoji" });
    }

    // Kreiraj sliku
    const newImage = await prisma.roomImage.create({
      data: {
        url,
        roomId,
      },
    });

    return res.status(201).json(newImage);
  } catch (error) {
    console.error("Error in addImageToRoom:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// DELETE brisanje slike
const deleteImage = async (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId, 10);
    const imageId = parseInt(req.params.imageId, 10);

    const image = await prisma.roomImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.roomId !== roomId) {
      return res.status(404).json({ error: "Slika nije pronađena za tu sobu" });
    }

    await prisma.roomImage.delete({
      where: { id: imageId },
    });

    return res.json({ message: "Slika obrisana" });
  } catch (error) {
    console.error("Error in deleteImage:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getImagesForRoom,
  addImageToRoom,
  deleteImage,
};
