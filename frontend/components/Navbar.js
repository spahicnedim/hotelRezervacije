"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { usePathname, useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  return (
    <nav
      className={`fixed w-full top-0 left-0 z-50 transition-colors duration-300 ${scrolled ? "bg-white shadow-md" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="text-xl text-primaryText font-bold">
          <Link href="/">LuxuryHotel</Link>
        </div>

        {/* Dinamički linkovi */}
        <div className="space-x-4">
          {!user && (
            <>
              {/* Ako user = null => prikaži Login / Register */}
              <Link
                href="/login"
                className={`${
                  scrolled ? "text-gray-800" : "text-primaryText"
                } font-semibold hover:opacity-80`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={`${
                  scrolled ? "text-gray-800" : "text-primaryText"
                } font-semibold hover:opacity-80`}
              >
                Register
              </Link>
            </>
          )}

          {user && user.role === "STAFF" && (
            <>
              {/* Ako je user STAFF => Admin link ili nesto */}
              <Link
                href="/admin-dashboard"
                className={`${
                  scrolled ? "text-gray-800" : "text-primaryText"
                } font-semibold hover:opacity-80`}
              >
                Admin Dashboard
              </Link>
              <Link
                href="/rooms"
                className={`${
                  scrolled ? "text-gray-800" : "text-primaryText"
                } font-semibold hover:opacity-80`}
              >
                Rooms
              </Link>
              <button
                onClick={handleLogout}
                className={`${
                  scrolled ? "text-gray-800" : "text-primaryText"
                } font-semibold hover:opacity-80`}
              >
                Logout
              </button>
            </>
          )}

          {user && user.role === "GUEST" && (
            <>
              {/* Ako je user GUEST => Rooms, MyProfile ... */}
              <Link
                href="/rooms"
                className={`${
                  scrolled ? "text-gray-800" : "text-primaryText"
                } font-semibold hover:opacity-80`}
              >
                Rooms
              </Link>
              <Link
                href="/profile"
                className={`${
                  scrolled ? "text-gray-800" : "text-primaryText"
                } font-semibold hover:opacity-80`}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className={`${
                  scrolled ? "text-gray-800" : "text-primaryText"
                } font-semibold hover:opacity-80`}
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
