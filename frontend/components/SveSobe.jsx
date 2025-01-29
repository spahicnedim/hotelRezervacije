"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SveSobe = () => {
  const [sobe, setSobe] = useState([]);

  useEffect(() => {
    // 2. Napravi fetch sa Authorization headerom
    fetch("http://localhost:8000/rooms", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch rooms");
        }
        return res.json();
      })
      .then((data) => {
        setSobe(data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-12 px-4 pt-5">
      <h2 className="text-3xl font-bold text-center mb-10">Sve sobe</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {sobe.map((soba) => (
          <div
            key={soba.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            {/* Slika sobe */}
            <div className="relative h-48 w-full">
              {soba.imageUrl ? (
                <Image
                  src={soba.imageUrl}
                  alt={soba.roomType || "Room Image"}
                  layout="fill"
                  objectFit="cover"
                  className="object-cover"
                  priority={false} // Postavi na true ako želiš prioritizirati učitavanje slika
                />
              ) : (
                <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                  Nema slike
                </div>
              )}
            </div>

            {/* Detalji sobe */}
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-semibold mb-2">
                Soba {soba.roomNumber} - {soba.roomType}
              </h3>
              {/* Ako ima description, prikaži ga */}
              {soba.description && (
                <p className="text-gray-600 flex-grow">
                  {soba.description.substring(0, 100)}...
                </p>
              )}
              <div className="mt-4">
                <Link
                  href={`/rooms/${soba.id}`}
                  className="block bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors text-center"
                >
                  Detalji
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SveSobe;
