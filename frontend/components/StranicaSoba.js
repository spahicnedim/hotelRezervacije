"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const StranicaSoba = ({ roomId }) => {
  const [room, setRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [reservationError, setReservationError] = useState("");
  const [reservationSuccess, setReservationSuccess] = useState("");

  // Recenzije
  const [reviews, setReviews] = useState([]);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");

  // Dohvati podatke o sobi
  useEffect(() => {
    fetch(`http://localhost:8000/rooms/${roomId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri dohvatu sobe");
        return res.json();
      })
      .then((data) => setRoom(data))
      .catch((err) => console.error(err));
  }, [roomId]);

  // Dohvati recenzije
  useEffect(() => {
    fetch(`http://localhost:8000/reviews/room/${roomId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Greška pri dohvatu recenzija");
        return res.json();
      })
      .then((data) => setReviews(data))
      .catch((err) => console.error(err));
  }, [roomId]);

  // Rezervacija
  const handleReservation = async (e) => {
    e.preventDefault();
    setReservationError("");
    setReservationSuccess("");

    try {
      const token = localStorage.getItem("token"); // ako je zaštićena ruta
      const res = await fetch("http://localhost:8000/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: Number(roomId),
          checkInDate,
          checkOutDate,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Neuspjela rezervacija");
      }

      setReservationSuccess("Rezervacija uspješna!");
      setCheckInDate("");
      setCheckOutDate("");
    } catch (err) {
      setReservationError(err.message);
    }
  };

  // Slanje recenzije
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: Number(roomId),
          content: reviewContent,
          rating: Number(reviewRating),
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Neuspjelo kreiranje recenzije.");
      }

      // Osvježi recenzije
      const updatedReviews = await fetch(
        `http://localhost:8000/reviews/room/${roomId}`,
      ).then((r) => r.json());
      setReviews(updatedReviews);

      setReviewMessage("Hvala na recenziji!");
      setReviewContent("");
      setReviewRating(5);
    } catch (err) {
      setReviewMessage(err.message);
    }
  };

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <p>Učitavam sobu...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* HERO SLIKA */}
      <div className="relative h-96 bg-gray-300 mt-16 justify-center items-center">
        {room.imageUrl && (
          <Image
            src={room.imageUrl}
            alt={room.roomType}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl text-white font-bold">
            Soba {room.roomNumber} - {room.roomType}
          </h1>
        </div>
      </div>

      {/* GLAVNI SADRŽAJ */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Informacije o sobi i formular za rezervaciju - 2 stupca */}
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Lijevi stupac: opis sobe */}
          <div className="w-full md:w-2/3">
            {/* OPIS SOBE */}
            {room.description && (
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {room.description}
              </p>
            )}
            {/* OVDJE možeš ubaciti još polja: npr. cijena, max osoba, itd. */}
          </div>

          {/* Desni stupac: rezervacija */}
          <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded shadow-md h-fit">
            <h2 className="text-xl font-semibold mb-4">Rezerviraj sobu</h2>
            {reservationError && (
              <p className="text-red-600 mb-2">{reservationError}</p>
            )}
            {reservationSuccess && (
              <p className="text-green-600 mb-2">{reservationSuccess}</p>
            )}
            <form onSubmit={handleReservation} className="space-y-4">
              <div>
                <label className="block font-semibold">Check-in</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Check-out</label>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 rounded hover:bg-primary/80"
              >
                Rezerviraj
              </button>
            </form>
          </div>
        </div>

        {/* RECENZIJE */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Recenzije</h2>

          {reviews.length === 0 && (
            <p className="text-gray-500">Još nema recenzija za ovu sobu.</p>
          )}

          <ul className="space-y-4">
            {reviews.map((rev) => (
              <li key={rev.id} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Ocjena: {rev.rating}/5</span>
                  <span className="text-sm text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString("hr-HR")}
                  </span>
                </div>
                <p className="mt-1 text-gray-700">{rev.content}</p>
              </li>
            ))}
          </ul>

          {/* Forma za dodavanje recenzije */}
          <div className="bg-gray-100 p-4 rounded shadow-md mt-8">
            <h3 className="text-lg font-semibold mb-2">Dodaj recenziju</h3>
            {reviewMessage && (
              <div className="mb-2 text-green-600">{reviewMessage}</div>
            )}
            <form onSubmit={handleReviewSubmit} className="space-y-2">
              <div>
                <label className="block font-semibold">Ocjena (1 - 5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={reviewRating}
                  onChange={(e) => setReviewRating(e.target.value)}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Recenzija</label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  className="border p-2 w-full"
                  rows={3}
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
              >
                Pošalji recenziju
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StranicaSoba;
