"use client";

import { useEffect, useState } from "react";

const StranicaSoba = ({ roomId }) => {
  const [soba, setSoba] = useState([]);

  useEffect(() => {
    // 2. Napravi fetch sa Authorization headerom
    fetch(`http://localhost:8000/rooms/${roomId}`, {
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
        setSoba(data);
      })
      .catch((err) => console.error(err));
  }, []);
  return <div>Soba id: {roomId}</div>;
};

export default StranicaSoba;
