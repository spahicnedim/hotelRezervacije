"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Neuspjesna prijava");
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);

      await router.push("/");
    } catch (e) {
      console.error(e);
      setError(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-4 bg-white shadow-md rounded">
      <h1 className="text-2xl font-bold mb-4">Prijava</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            className="border w-full p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Password</label>
          <input
            type="password"
            className="border w-full p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80"
        >
          Prijavi se
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
