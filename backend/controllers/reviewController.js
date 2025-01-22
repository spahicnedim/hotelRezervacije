const prisma = require("../models/prismaClient");

const createReview = async (req, res) => {
  try {
    const userId = req.params.id;
    const { roomId, content, rating } = req.body;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({ error: "Soba ne ostoji" });
    }

    const newReview = await prisma.review.create({
      data: {
        userId,
        roomId,
        content,
        rating,
      },
    });

    return res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getAllReviewsForRoom = async (req, res) => {
  try {
    const roomId = parseInt(req.params.id, 10);

    const reviews = await prisma.review.findMany({
      where: { id: roomId },
      includes: {
        user: true,
      },
    });

    return res.json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getReviewById = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id, 10);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: true,
        room: true,
      },
    });

    if (!review) {
      return res.status(404).json({ error: "Recenzija nije pronađena." });
    }

    return res.json(review);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Greška pri dohvatu recenzije." });
  }
};

const updateReview = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id, 10);
    const { content, rating } = req.body;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ error: "Recenzija ne postoji." });
    }

    if (req.user.role !== "STAFF" && review.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Nemate pravo ažurirati ovu recenziju." });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        content,
        rating,
      },
    });

    return res.json(updatedReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Greška pri ažuriranju recenzije." });
  }
};

const deleteReview = async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id, 10);

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ error: "Recenzija ne postoji." });
    }

    // provjera vlasništva (osim ako želimo STAFF-u dozvoliti sve)
    if (req.user.role !== "STAFF" && review.userId !== req.user.userId) {
      return res
        .status(403)
        .json({ error: "Nemate pravo brisati ovu recenziju." });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return res.json({ message: "Recenzija obrisana." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Greška pri brisanju recenzije." });
  }
};

module.exports = {
  createReview,
  getAllReviewsForRoom,
  getReviewById,
  updateReview,
  deleteReview,
};
