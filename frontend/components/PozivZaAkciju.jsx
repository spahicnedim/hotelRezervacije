import Link from "next/link";

const PozivZaAkciju = () => {
  return (
    <section className="bg-gray-100 py-8 text-center">
      <h2 className="text-3xl font-bold mb-2">
        Rezervirajte Vaš boravak danas!
      </h2>
      <p className="mb-4">Uživajte u luksuzu i usluzi kakvu zaslužujete.</p>
      <Link
        href="/rooms"
        className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/80 transition"
      >
        Pogledaj sve sobe
      </Link>
    </section>
  );
};

export default PozivZaAkciju;
