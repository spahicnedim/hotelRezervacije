// app/admin-dashboard/reservations/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import EditReservationModal from "@/components/EditReservationModal";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [chartData, setChartData] = useState({
    labels: ["PENDING", "CONFIRMED", "CANCELLED"],
    datasets: [
      {
        label: "Broj rezervacija",
        data: [0, 0, 0],
        backgroundColor: ["#facc15", "#4ade80", "#f87171"],
      },
    ],
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [reservationToEdit, setReservationToEdit] = useState(null);

  // Dohvati Rezervacije
  useEffect(() => {
    const fetchReservations = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8000/reservation", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setReservations(data);

        // Provjeri je li data niz
        if (Array.isArray(data)) {
          setReservations(data);
          updateChartData(data);
        } else if (data.reservations && Array.isArray(data.reservations)) {
          setReservations(data.reservations);
          updateChartData(data.reservations);
        } else {
          console.error("Ne očekivani format podataka:", data);
        }
      } catch (err) {
        console.error("Greška pri dohvaćanju rezervacija:", err);
      }
    };

    fetchReservations();
  }, []);

  // Ažuriraj Chart Podatke
  const updateChartData = (allRes) => {
    const pendingCount = allRes?.filter((r) => r?.status === "PENDING")?.length;
    const confirmedCount = allRes?.filter(
      (r) => r?.status === "CONFIRMED",
    )?.length;
    const cancelledCount = allRes?.filter(
      (r) => r?.status === "CANCELLED",
    )?.length;

    setChartData({
      labels: ["PENDING", "CONFIRMED", "CANCELLED"],
      datasets: [
        {
          label: "Broj rezervacija",
          data: [pendingCount, confirmedCount, cancelledCount],
          backgroundColor: ["#facc15", "#4ade80", "#f87171"],
        },
      ],
    });
  };

  // Ažuriraj Status Rezervacije
  const handleReservationStatus = async (resId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const resAPI = await fetch(`http://localhost:8000/reservation/${resId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!resAPI.ok) throw new Error("Neuspješno ažuriranje rezervacije.");

      const updatedRes = await fetch("http://localhost:8000/reservation", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((r) => r.json());
      setReservations(updatedRes);
      updateChartData(updatedRes);
    } catch (err) {
      console.error(err);
    }
  };

  // Otvori Edit Modal
  const openEditModal = (reservation) => {
    setReservationToEdit(reservation);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setReservationToEdit(null);
  };
  const handleUpdateReservation = (updatedReservation) => {
    // Nakon ažuriranja, refresh rezervacije
    handleReservationStatus(updatedReservation.id, updatedReservation.status);
    closeEditModal();
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Pregled Rezervacija
      </h2>

      {/* Statistika Rezervacija */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Statistika Rezervacija
        </h3>
        <div className="w-full sm:w-1/2 md:w-1/3 mx-auto">
          <Pie data={chartData} />
        </div>
      </section>

      {/* Pregled Rezervacija */}
      <section>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  ID
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Room ID
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  User ID
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Check-In
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Check-Out
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">{r.id}</td>
                  <td className="py-4 px-6">{r.roomId}</td>
                  <td className="py-4 px-6">{r.userId}</td>
                  <td className="py-4 px-6">
                    {new Date(r.checkInDate).toLocaleDateString("hr-HR")}
                  </td>
                  <td className="py-4 px-6">
                    {new Date(r.checkOutDate).toLocaleDateString("hr-HR")}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        r.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : r.status === "CONFIRMED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 space-x-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                      onClick={() => handleReservationStatus(r.id, "CONFIRMED")}
                    >
                      Odobri
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                      onClick={() => handleReservationStatus(r.id, "CANCELLED")}
                    >
                      Odbij
                    </button>
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                      onClick={() => openEditModal(r)}
                    >
                      Uredi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Rezervacija Modal */}
      {editModalOpen && reservationToEdit && (
        <EditReservationModal
          reservation={reservationToEdit}
          onClose={closeEditModal}
          onUpdate={handleUpdateReservation}
        />
      )}
    </div>
  );
}
