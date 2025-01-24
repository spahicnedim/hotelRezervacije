// app/admin-dashboard/layout.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Pregled Rezervacija", href: "/admin-dashboard/reservations" },
    { name: "Upravljanje Sobama", href: "/admin-dashboard/rooms" },
    { name: "Statistika", href: "/admin-dashboard/stats" },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md h-full sticky top-16">
        {" "}
        {/* top-16 je visina navbar-a */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">Admin Panel</h2>
          <nav>
            <ul>
              {navItems.map((item) => (
                <li key={item.href} className="mb-4">
                  <Link
                    href={item.href}
                    className={`block px-4 py-2 rounded hover:bg-primary hover:text-white ${
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Glavni Sadržaj */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
