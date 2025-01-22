import Link from "next/link";

const HomeStranica = () => {
  return (
    <section className="relative w-full h-screen bg-[url('/cover.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Dobrodosli u Hotel
        </h1>
        <p className="text-xl md:text-2xl mb-6">
          Rezervirajte luksuzan smjestaj i uzivajte u vrhunskom iskustvu
        </p>

        <div className="flex items-center justify-center">
          <Link
            href="/rooms"
            className="bg-primary hover:bg-primary/80 px-6 py-3 rounded-md font-semibold"
          >
            Rezervisi svoju sobu
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeStranica;
