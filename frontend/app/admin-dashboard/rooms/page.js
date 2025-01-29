// app/admin-dashboard/rooms/page.jsx
"use client";

import { useEffect, useState } from "react";

function ImageManagerModal({ roomId, onClose }) {
  const [roomImages, setRoomImages] = useState([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Dohvati slike za sobu:
    const fetchImages = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:8000/rooms/${roomId}/images`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        setRoomImages(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [roomId]);

  const handleAddImage = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/rooms/${roomId}/images`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url: newImageUrl }), // samo url za sad
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Greška pri dodavanju slike.");
      }
      const created = await res.json();
      setRoomImages((prev) => [...prev, created]);
      setNewImageUrl("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:8000/rooms/${roomId}/images/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Greška pri brisanju slike.");
      }
      setRoomImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-white">
        Učitavanje...
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">
          Manage Images (Room ID: {roomId})
        </h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          X
        </button>

        {/* Forma za dodavanje nove slike */}
        <form
          onSubmit={handleAddImage}
          className="flex items-center gap-2 mb-4"
        >
          <input
            type="text"
            placeholder="URL slike"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="border flex-1 px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Dodaj
          </button>
        </form>

        {/* Popis slika */}
        {roomImages.length === 0 ? (
          <p>Nema slika za ovu sobu.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {roomImages.map((img) => (
              <div key={img.id} className="border p-2 relative">
                <img
                  src={img.url}
                  alt={`RoomImage #${img.id}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  className="bg-red-500 text-white text-sm px-2 py-1 rounded absolute top-2 right-2"
                  onClick={() => handleDeleteImage(img.id)}
                >
                  Obriši
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** KREIRANJE SOBE */
function CreateRoomForm({ onCreateRoom }) {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateRoom({ roomNumber, roomType, description, imageUrl });
    setRoomNumber("");
    setRoomType("");
    setDescription("");
    setImageUrl("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-200 rounded-lg p-6 shadow-md flex flex-col md:flex-row items-start md:items-end gap-4"
    >
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Room Number</label>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          required
          placeholder="101"
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Room Type</label>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          required
          placeholder="Single, Double..."
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Description</label>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Kratki opis sobe"
        />
      </div>
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Image URL</label>
        <input
          type="text"
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="http://..."
        />
      </div>
      <button
        type="submit"
        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200"
      >
        Kreiraj sobu
      </button>
    </form>
  );
}

function EditRoomModal({ room, onClose, onUpdate }) {
  const [editData, setEditData] = useState({
    id: room.id,
    roomNumber: room.roomNumber,
    roomType: room.roomType,
    description: room.description || "",
    imageUrl: room.imageUrl || "",
  });

  const handleChange = (e) => {
    setEditData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          Uredi sobu (ID: {room.id})
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-semibold mb-1">Room Number</label>
            <input
              type="text"
              name="roomNumber"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={editData.roomNumber}
              onChange={handleChange}
              required
              placeholder="101"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Room Type</label>
            <input
              type="text"
              name="roomType"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={editData.roomType}
              onChange={handleChange}
              required
              placeholder="Single, Double..."
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <input
              type="text"
              name="description"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={editData.description}
              onChange={handleChange}
              placeholder="Kratki opis sobe"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={editData.imageUrl}
              onChange={handleChange}
              placeholder="http://..."
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              onClick={onClose}
            >
              Zatvori
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
            >
              Ažuriraj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const [editRoomModalOpen, setEditRoomModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState(null);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedRoomIdForImages, setSelectedRoomIdForImages] = useState(null);

  // Dohvati Sobe
  useEffect(() => {
    const fetchRooms = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:8000/rooms", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setRooms(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRooms();
  }, []);

  // Kreiranje Sobe
  const handleCreateRoom = async (roomData) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8000/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomData),
      });
      if (!res.ok) throw new Error("Greška pri kreiranju sobe.");

      // Osvježi Sobe
      const updatedRooms = await fetch("http://localhost:8000/rooms", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((r) => r.json());
      setRooms(updatedRooms);
    } catch (err) {
      console.error(err);
    }
  };

  // Brisanje Sobe
  const handleDeleteRoom = async (roomId) => {
    const token = localStorage.getItem("token");
    try {
      const delRes = await fetch(`http://localhost:8000/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!delRes.ok) throw new Error("Greška pri brisanju sobe.");

      // Osvježi Sobe
      const updatedRooms = await fetch("http://localhost:8000/rooms", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((r) => r.json());
      setRooms(updatedRooms);
    } catch (err) {
      console.error(err);
    }
  };

  // Otvaranje i Zatvaranje Edit Modala
  const openEditModal = (room) => {
    setRoomToEdit(room);
    setEditRoomModalOpen(true);
  };
  const closeEditModal = () => {
    setEditRoomModalOpen(false);
    setRoomToEdit(null);
  };
  const handleUpdateRoom = async (updatedRoom) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8000/rooms/${updatedRoom.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomNumber: updatedRoom.roomNumber,
          roomType: updatedRoom.roomType,
          description: updatedRoom.description,
          imageUrl: updatedRoom.imageUrl,
        }),
      });
      if (!res.ok) throw new Error("Greška pri ažuriranju sobe.");

      // Osvježi Sobe
      const updatedRooms = await fetch("http://localhost:8000/rooms", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }).then((r) => r.json());
      setRooms(updatedRooms);
      closeEditModal();
    } catch (err) {
      console.error(err);
    }
  };

  const openImageModal = (roomId) => {
    setSelectedRoomIdForImages(roomId);
    setImageModalOpen(true);
  };
  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedRoomIdForImages(null);
  };

  // Sortiranje i Paginacija
  const sortedRooms = [...rooms].sort((a, b) => {
    if (sortField === "id") {
      return sortDir === "asc" ? a.id - b.id : b.id - a.id;
    } else if (sortField === "roomNumber") {
      const numA = parseInt(a.roomNumber, 10);
      const numB = parseInt(b.roomNumber, 10);
      if (isNaN(numA) || isNaN(numB)) {
        return sortDir === "asc"
          ? a.roomNumber.localeCompare(b.roomNumber)
          : b.roomNumber.localeCompare(a.roomNumber);
      } else {
        return sortDir === "asc" ? numA - numB : numB - numA;
      }
    } else {
      // sort by roomType
      return sortDir === "asc"
        ? a.roomType.localeCompare(b.roomType)
        : b.roomType.localeCompare(a.roomType);
    }
  });

  const totalPages = Math.ceil(sortedRooms.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRooms = sortedRooms.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Upravljanje Sobama
      </h2>

      {/* Forma za Kreiranje Sobe */}
      <CreateRoomForm onCreateRoom={handleCreateRoom} />

      {/* Sortiranje */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mt-6 mb-4">
        <div className="flex items-center space-x-2">
          <label className="font-semibold">Sortiraj po:</label>
          <select
            className="border border-gray-300 rounded px-3 py-1"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="id">ID</option>
            <option value="roomNumber">Room Number</option>
            <option value="roomType">Room Type</option>
          </select>
          <select
            className="border border-gray-300 rounded px-3 py-1"
            value={sortDir}
            onChange={(e) => setSortDir(e.target.value)}
          >
            <option value="asc">Uzlazno</option>
            <option value="desc">Silazno</option>
          </select>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="text-sm text-gray-600">
            Stranica {currentPage} od {totalPages}
          </span>
        </div>
      </div>

      {/* Tablica soba sa Paginacijom i Edit */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                ID
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Room Number
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Room Type
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Opis
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Image
              </th>
              <th className="py-3 px-6 bg-gray-200 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Akcije
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRooms.map((room) => (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">{room.id}</td>
                <td className="py-4 px-6">{room.roomNumber}</td>
                <td className="py-4 px-6">{room.roomType}</td>
                <td className="py-4 px-6">{room.description}</td>
                <td className="py-4 px-6">
                  {room.imageUrl ? (
                    <img
                      src={room.imageUrl}
                      alt={`Soba ${room.roomNumber}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span>Nema slike</span>
                  )}
                </td>
                <td className="py-4 px-6 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                    onClick={() => openEditModal(room)}
                  >
                    Uredi
                  </button>
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                    onClick={() => openImageModal(room.id)}
                  >
                    Manage Images
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    Obriši
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginacija */}
        <div className="flex justify-center items-center mt-4 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`px-4 py-2 rounded border ${
                p === currentPage
                  ? "bg-primary text-white"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => setCurrentPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Edit Soba Modal */}
      {editRoomModalOpen && roomToEdit && (
        <EditRoomModal
          room={roomToEdit}
          onClose={closeEditModal}
          onUpdate={handleUpdateRoom}
        />
      )}

      {imageModalOpen && selectedRoomIdForImages && (
        <ImageManagerModal
          roomId={selectedRoomIdForImages}
          onClose={closeImageModal}
        />
      )}
    </div>
  );
}
