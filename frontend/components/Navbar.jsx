"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Prilagodi prag po potrebi
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Dodaj scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Čišćenje event listenera prilikom unmount-a
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      console.log(decoded);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isHomePage = pathname === "/";

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-colors duration-300 ${
        isHomePage && !scrolled ? "bg-transparent" : "bg-white shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div
          className={`text-xl font-bold ${
            isHomePage && !scrolled ? "text-primaryText" : "text-gray-800"
          }`}
        >
          <Link href="/">LuxuryHotel</Link>
        </div>

        {/* Dinamički linkovi */}
        <div className="space-x-4 flex items-center">
          {!user && (
            <>
              {/* Ako user = null => prikaži Login / Register */}
              <Link
                href="/login"
                className={`font-semibold hover:opacity-80 ${
                  isHomePage && !scrolled ? "text-primaryText" : "text-gray-800"
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`font-semibold hover:opacity-80 ${
                  isHomePage && !scrolled ? "text-primaryText" : "text-gray-800"
                }`}
              >
                Register
              </Link>
            </>
          )}

          {user && user.role === "STAFF" && (
            <>
              {/* Ako je user STAFF => Admin Dashboard, Rooms, Logout */}
              <Link
                href="/admin-dashboard"
                className={`font-semibold hover:opacity-80 ${
                  isHomePage && !scrolled ? "text-primaryText" : "text-gray-800"
                }`}
              >
                Admin Dashboard
              </Link>
              <Link
                href="/rooms"
                className={`font-semibold hover:opacity-80 ${
                  isHomePage && !scrolled ? "text-primaryText" : "text-gray-800"
                }`}
              >
                Rooms
              </Link>
              <button
                onClick={handleLogout}
                className={`font-semibold hover:opacity-80 ${
                  isHomePage && !scrolled ? "text-primaryText" : "text-gray-800"
                }`}
              >
                Logout
              </button>
            </>
          )}

          {user && user.role === "GUEST" && (
            <>
              {/* Ako je user GUEST => Rooms, Profile, Logout */}
              <Link
                href="/rooms"
                className={`font-semibold hover:opacity-80 ${
                  isHomePage && !scrolled ? "text-primaryText" : "text-gray-800"
                }`}
              >
                Rooms
              </Link>
              <Link
                href="/profile"
                className={`font-semibold hover:opacity-80 ${
                  isHomePage && !scrolled ? "text-primaryText" : "text-gray-800"
                }`}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className={`font-semibold hover:opacity-80 ${
                  isHomePage && !scrolled ? "text-primaryText" : "text-gray-800"
                }`}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
