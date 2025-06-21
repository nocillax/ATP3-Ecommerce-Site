import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const ShopByCollection = () => {
  const collections = [
    {
      brand: "VELURÉ",
      subtitle: "CHIFFON SILK SERIES",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    },
    {
      brand: "AYRAH",
      subtitle: "SATIN HIJAB SERIES",
      image:
        "https://images.unsplash.com/photo-1594736797933-d0401ba886fe?auto=format&fit=crop&w=800&q=80",
    },
    {
      brand: "LUMÉ",
      subtitle: "COTTON HIJAB SERIES",
      image:
        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-16 relative">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-playfair text-xl font-bold text-dark-gray">
          OUR COLLECTION
        </h2>
        <button className="hidden md:flex items-center gap-2 border border-dark-gray px-4 py-1.5 rounded hover:bg-dark-gray hover:text-white transition">
          <span className="text-sm font-reem-kufi font-bold">SHOW ALL</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((item, index) => (
            <div
              key={index}
              className="bg-mint-light rounded-md border border-light-green shadow-soft overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-[300px] bg-gray-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.brand}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 text-center">
                <h3 className="font-reem-kufi text-2xl font-bold text-dark-gray mb-1">
                  {item.brand}
                </h3>
                <h4 className="font-quicksand text-base font-semibold text-dark-gray mb-4">
                  {item.subtitle}
                </h4>
                <button className="border border-dark-gray text-dark-gray px-4 py-2 rounded hover:bg-dark-gray hover:text-white transition text-sm font-reem-kufi font-bold">
                  SEE ALL
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (no logic yet) */}
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
