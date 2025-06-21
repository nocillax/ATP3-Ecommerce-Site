"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const products = [
  {
    brand: "VELURÉ",
    title: "Chiffon Silk Hijab",
    subtitle: "ECLIPSE BLACK",
    description:
      "Light as air and rich in elegance, this deep black chiffon silk hijab offers an ethereal drape with a whisper of luxury in every fold.",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
  },
  {
    brand: "VELURÉ",
    title: "Chiffon Silk Hijab",
    subtitle: "MOCHA DUSK",
    description:
      "A soft, creamy blend of warmth and elegance, this mocha-toned chiffon silk hijab flows with effortless grace; perfect for understated sophistication.",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba886fe?auto=format&fit=crop&w=800&q=80",
  },
  {
    brand: "VELURÉ",
    title: "Chiffon Silk Hijab",
    subtitle: "SAGE BLOOM",
    description:
      "Infused with earthy charm and modern elegance, this muted green chiffon silk hijab brings a fresh, serene energy to every look.",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  },
];

const NewArrivals = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const offset = direction === "left" ? -320 : 320;
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-16 relative">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-playfair text-xl font-bold text-dark-gray">
          NEW ARRIVALS
        </h2>
        <button className="hidden md:flex items-center gap-2 border border-dark-gray px-4 py-1.5 rounded hover:bg-dark-gray hover:text-white transition">
          <span className="text-sm font-reem-kufi font-bold tracking-wide">
            SHOW ALL
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide"
        >
          {products.map((product, index) => (
            <div
              key={index}
              className="min-w-[300px] bg-mint-light rounded-lg border border-light-green shadow-soft overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-[400px] bg-gray-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4">
                {/* Product Info */}
                <div className="mb-4">
                  <h3 className="font-reem-kufi text-[20px] font-extrabold text-ncx-text mb-2">
                    {product.brand}
                  </h3>
                  <h4 className="font-reem-kufi text-[20px] font-bold text-ncx-text mb-1">
                    {product.title}
                  </h4>
                  <h5 className="font-crimson text-[14px] font-bold text-ncx-text mb-3">
                    {product.subtitle}
                  </h5>
                  <p className="font-montserrat text-[12px] font-semibold text-ncx-text leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price Section */}
                <div className="flex items-baseline gap-2">
                  <div className="flex items-baseline gap-1">
                    <sup className="text-xs font-crimson text-dark-gray relative -top-1">
                      BDT
                    </sup>
                    <span className="text-xl font-semibold font-crimson text-dark-gray">
                      {product.price}
                    </span>
                  </div>
                  <button className="w-8 h-8 border border-dark-gray rounded-full flex items-center justify-center hover:bg-dark-gray hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-6 h-14 bg-brown-dark rounded-sm shadow-category items-center justify-center hover:bg-opacity-80 transition"
        >
          <ChevronLeft className="w-4 h-6 text-mint-light" strokeWidth={1.75} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-6 h-14 bg-brown-dark rounded-sm shadow-category items-center justify-center hover:bg-opacity-80 transition"
        >
          <ChevronRight
            className="w-4 h-6 text-mint-light"
            strokeWidth={1.75}
          />
        </button>
      </div>
    </section>
  );
};

export default NewArrivals;
