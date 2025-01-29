import { useState } from "react";

const CreateRoomForm = ({ onCreateRoom }) => {
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
};

export default CreateRoomForm;
