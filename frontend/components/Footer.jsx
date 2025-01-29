import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between">
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">
            <p>Adresa: Uica i broj, Grad</p>
            <p>Telefon: +123456789</p>
            <p>Email: info@hotel.com</p>
            <p>Radno vrijeme: Pon - Ned: 0-24h</p>
          </h3>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-bld mb-2">Brzi linkovi</h3>
          <ul>
            <li>
              <Link href="/" className="hover:underline">
                Pocetna
              </Link>
            </li>
            <li>
              <Link href="/rooms" className="hover:underline">
                Sobe
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>

        <div className="md-4">
          <h3 className="text-lg font-bold mb-2"> Pratite nas </h3>
          <ul className="flex space-x-4">
            <li>
              <a href="https://facebook.com" className="hover:underline">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://instagram.com" className="hover:underline">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://twitter.com" className="hover:underline">
                Twitter
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm mt-4 border-t border-gary-700 pt-2">
        &copy; {new Date().getFullYear()} Luxury Hotel. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
