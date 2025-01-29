// app/profile/page.js (Next.js 13) ili pages/profile.js (Next.js 12)

"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [userData, setUserData] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Niste prijavljeni!");
        return;
      }

      try {
        // 1. Dohvati osnovne podatke korisnika
        // Pretpostavimo da imaš endpoint /profile
        const res = await fetch("http://localhost:8000/profile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Greška pri dohvaćanju profila");
        }
        const data = await res.json();
        setUserData(data.user); // npr. { email, username, ... } ako tako vraćaš

        // 2. Dohvati rezervacije korisnika
        // Možeš koristiti GET /reservation (koji vraća samo userove rezevacije ako je role=GUEST)
        const resReservations = await fetch(
          "http://localhost:8000/reservation",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!resReservations.ok) {
          const errData = await resReservations.json();
          throw new Error(errData.error || "Greška pri dohvaćanju rezervacija");
        }
        const reservationsData = await resReservations.json();
        // Pretpostavimo da je to niz s poljima checkInDate, checkOutDate, status, roomId, ...
        setReservations(reservationsData);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleCancelReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem("token");
      // Otkazivanje -> update statusa na CANCELLED
      const res = await fetch(
        `http://localhost:8000/reservation/${reservationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "CANCELLED" }),
        },
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Greška pri otkazivanju rezervacije");
      }
      // Ažuriraj lokalno
      const updated = await res.json();
      setReservations((prev) =>
        prev.map((r) => (r.id === reservationId ? updated : r)),
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto mt-20 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="max-w-7xl mx-auto mt-20 text-center">
        <p>Učitavanje profila...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-20 p-4">
      <h1 className="text-3xl font-bold mb-6">Moj Profil</h1>

      {/* Osnovni Podaci */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Osnovne Informacije</h2>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
        {/* Dodaj druge informacije po potrebi */}
      </div>

      {/* Rezervacije */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Moje Rezervacije</h2>
        {reservations.length === 0 ? (
          <p>Nema rezervacija.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Soba</th>
                  <th className="px-4 py-2 text-left">Check-In</th>
                  <th className="px-4 py-2 text-left">Check-Out</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res) => (
                  <tr key={res.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{res.id}</td>
                    <td className="px-4 py-2">
                      {/* Ako imaš info o sobi, npr. res.room.roomNumber */}
                      {res.room ? `Soba ${res.room.roomNumber}` : res.roomId}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(res.checkInDate).toLocaleDateString("hr-HR")}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(res.checkOutDate).toLocaleDateString("hr-HR")}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          res.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : res.status === "CONFIRMED"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      {res.status !== "CANCELLED" && (
                        <button
                          onClick={() => handleCancelReservation(res.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                        >
                          Otkazivanje
                        </button>
                      )}
                      {/* Ako želiš i brisanje, možeš dodati i za staff. */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
