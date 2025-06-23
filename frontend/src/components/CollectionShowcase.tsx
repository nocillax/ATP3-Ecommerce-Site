import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import BrandCard from "./BrandCard";

const collections = [
  {
    name: "VELURÉ",
    subtitle: "CHIFFON SILK SERIES",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    slug: "velure",
  },
  {
    name: "AYRAH",
    subtitle: "SATIN HIJAB SERIES",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba886fe?auto=format&fit=crop&w=800&q=80",
    slug: "ayrah",
  },
  {
    name: "LUMÉ",
    subtitle: "COTTON HIJAB SERIES",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    slug: "lume",
  },
];

const ShopByCollection = () => {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-16 relative">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-playfair text-xl font-bold text-dark-gray">
          OUR COLLECTION
        </h2>
        <a
          href="/brands"
          className="hidden md:flex items-center gap-2 border border-dark-gray px-4 py-1.5 rounded hover:bg-dark-gray hover:text-white transition text-sm font-reem-kufi font-bold"
        >
          SHOW ALL
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((brand) => (
            <BrandCard key={brand.slug} {...brand} />
          ))}
        </div>

        {/* Navigation Arrows (optional / static) */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full flex justify-between px-0 pointer-events-none">
          <button className="w-6 h-14 bg-brown-dark rounded-sm shadow-md flex items-center justify-center text-white hover:opacity-90 transition pointer-events-auto">
            <ChevronLeft
              className="w-4 h-6 text-mint-light"
              strokeWidth={1.5}
            />
          </button>
          <button className="w-6 h-14 bg-brown-dark rounded-sm shadow-md flex items-center justify-center text-white hover:opacity-90 transition pointer-events-auto">
            <ChevronRight
              className="w-4 h-6 text-mint-light"
              strokeWidth={1.5}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopByCollection;
