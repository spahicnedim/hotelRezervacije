import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Naziv Hotela",
  description: "Hotel rezervacija",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
