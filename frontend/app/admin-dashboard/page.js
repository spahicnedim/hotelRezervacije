// app/admin-dashboard/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboardHome() {
  const router = useRouter();

  useEffect(() => {
    // Preusmjeri na Pregled Rezervacija
    router.push("/admin-dashboard/reservations");
  }, [router]);

  return <></>;
}
