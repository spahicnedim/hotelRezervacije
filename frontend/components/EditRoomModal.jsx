import { useState } from "react";

const EditRoomModal = ({ room, onClose, onUpdate }) => {
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
};

export default EditRoomModal;
