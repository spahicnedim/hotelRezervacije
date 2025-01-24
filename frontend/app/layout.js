import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Naziv Hotela",
  description: "Hotel rezervacija",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Sadržaj stranice */}
        <main className="flex-1 mt-16">
          {" "}
          {/* mt-16 prilagođava marginu prema visini navbar-a */}
          {children}
        </main>
      </body>
    </html>
  );
}
