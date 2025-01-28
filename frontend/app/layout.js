import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Naziv Hotela",
  description: "Hotel rezervacija",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="">
        {/* Navbar */}
        <Navbar />

        {/* Sadržaj stranice */}
        <main className="">
          {" "}
          {/* mt-16 prilagođava marginu prema visini navbar-a */}
          {children}
        </main>
      </body>
    </html>
  );
}
