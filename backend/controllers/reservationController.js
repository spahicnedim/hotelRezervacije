const prisma = require("../models/prismaClient");

const createReservation = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    const userId = req.user.userId;

    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return res.status(404).json({ error: "Soba ne postoji" });
    }

    const overlapping = await prisma.reservation.findFirst({
      where: {
        roomId: roomId,
        AND: [
          {
            checkInDate: {
              lt: new Date(checkOutDate),
            },
          },
          {
            checkOutDate: {
              gt: new Date(checkInDate),
            },
          },
        ],
      },
    });
    if (overlapping) {
      return res
        .status(400)
        .json({ error: "Soba je vec rezervisana u trazenom periodu" });
    }

    const newReservation = await prisma.reservation.create({
      data: {
        roomId: roomId,
        userId: userId,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        status: "PENDING",
      },
    });

    return res.status(200).json(newReservation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getReservation = async (req, res) => {
  try {
    if (req.user.role === "STAFF") {
      const allReservations = await prisma.reservation.findMany({
        include: {
          user: true,
          room: true,
        },
      });
      return res.json(allReservations);
    } else {
      const userId = req.user.userId;
      const userReservations = await prisma.reservation.findMany({
        where: { userId },
        include: {
          user: true,
          room: true,
        },
      });
      return res.json(userReservations);
    }
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};

const getReservayionById = async (req, res) => {
  try {
    const reservationId = parseInt(req.params.id, 10);

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        user: true,
        room: true,
      },
    });

    if (!reservation) {
      return res.status(404).json({ error: "Rezervacija ne ostoji" });
    }

    if (req.user.role !== "STAFF" && reservation.userId !== req.user.userId) {
      return res.status(403).json({ error: "Nedovoljno privilegija" });
    }

    return res.json(reservation);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const updateReservation = async (req, res) => {
  try {
    const reservationid = parseInt(req.params.id, 10);
    const { status } = req.body;

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationid },
    });

    if (!reservation) {
      return res.status(404).json({ error: "Rezervacija ne postoji" });
    }

    if (req.user.role === "STAFF") {
      const updated = await prisma.reservation.update({
        where: { id: reservationid },
        data: {
          status: status,
        },
      });

      return res.json(update);
    } else {
      if (reservation.userId !== req.user.userId) {
        return res.status(403).json({ error: "Nedovoljno privilegija" });
      }

      if (status !== "CANCELLED") {
        return res
          .status(403)
          .json({ error: "GUEST smije otkazati svoju rezervaciju" });
      }

      const updated = await prisma.reservation.update({
        where: { id: reservationid },
        data: {
          status: "CANCELLED",
        },
      });

      return res.json(updated);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const deleteReservation = async (req, res) => {
  try {
    const reservationId = parseInt(req.params.id, 10);

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation) {
      return res.status(404).json({ error: "Rezervacija ne postoji" });
    }

    if (req.user.role === "STAFF") {
      await prisma.reservation.delete({ where: { id: reservationId } });
      return res.json({ message: "Rezervacija uspjesno obrisana" });
    } else {
      if (reservation.UserId !== req.user.userId) {
        return res.status(403).json({ error: "Nedovoljno privilegija" });
      }
      await prisma.reservation.delete({ where: { id: reservationId } });
      return res.json({ message: "Rezervacija uspjedno obrisana" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createReservation,
  getReservation,
  getReservayionById,
  updateReservation,
  deleteReservation,
};
