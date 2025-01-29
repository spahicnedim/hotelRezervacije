// app/admin-dashboard/stats/page.jsx
"use client";

import { useEffect, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
);

export default function StatsPage() {
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

  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: "Rezervacije po mjesecima",
        data: [],
        backgroundColor: "#4ade80",
      },
    ],
  });

  // Dohvati Rezervacije i Ažuriraj Grafove
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
        updatePieChart(data);
        updateBarChart(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReservations();
  }, []);

  // Ažuriraj Pie Chart
  const updatePieChart = (allRes) => {
    const pendingCount = allRes.filter((r) => r.status === "PENDING").length;
    const confirmedCount = allRes.filter(
      (r) => r.status === "CONFIRMED",
    ).length;
    const cancelledCount = allRes.filter(
      (r) => r.status === "CANCELLED",
    ).length;

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

  // Ažuriraj Bar Chart (Rezervacije po mjesecima)
  const updateBarChart = (allRes) => {
    const months = [
      "Januar",
      "Februar",
      "Mart",
      "April",
      "Maj",
      "Juni",
      "Juli",
      "August",
      "Septembar",
      "Oktobar",
      "Novembar",
      "Decembar",
    ];

    const reservationsPerMonth = Array(12).fill(0);

    allRes.forEach((res) => {
      const month = new Date(res.checkInDate).getMonth();
      reservationsPerMonth[month] += 1;
    });

    setBarData({
      labels: months,
      datasets: [
        {
          label: "Rezervacije po mjesecima",
          data: reservationsPerMonth,
          backgroundColor: "#4ade80",
        },
      ],
    });
  };

  return (
    <div className="pt-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Statistika</h2>

      {/* Pie Chart */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Rezervacije po Statusu
        </h3>
        <div className="w-full sm:w-1/2 md:w-1/3 mx-auto">
          <Pie data={chartData} />
        </div>
      </section>

      {/* Bar Chart */}
      <section className="mb-12 bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Rezervacije po Mjesecima
        </h3>
        <div className="w-full sm:w-3/4 md:w-2/3 mx-auto">
          <Bar data={barData} />
        </div>
      </section>
    </div>
  );
}
