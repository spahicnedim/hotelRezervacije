import { useEffect, useState } from "react";

const ImageManagerModal = ({ roomId, onClose }) => {
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
        <button onClick={onClose} className="text-gray-500 hover:text-black">
          X
        </button>
        <h2 className="text-2xl font-bold mb-4">
          Manage Images (Room ID: {roomId})
        </h2>

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
};

export default ImageManagerModal;
