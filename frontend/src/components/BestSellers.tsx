"use client";

import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

const products = [
  {
    brand: "AYRAH",
    title: "Signature Satin Hijab",
    subtitle: "- Platinum Haze -",
    price: 899,
    originalPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba886fe?auto=format&fit=crop&w=1000&q=80",
  },
  {
    brand: "LUMÉ",
    title: "Essence Cotton Hijab",
    subtitle: "- Rose Clay -",
    price: 675,
    originalPrice: 899,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    brand: "VELURÉ",
    title: "Premium Silk Hijab",
    subtitle: "- Midnight Black -",
    price: 1299,
    originalPrice: 1699,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80",
  },
];

const BestSellers = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-16 relative">
      {/* Heading & Show All */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-playfair text-xl font-bold text-dark-gray">
          BEST SELLERS
        </h2>
        <button className="hidden md:flex items-center gap-2 border border-dark-gray px-4 py-1.5 rounded hover:bg-dark-gray hover:text-white transition">
          <span className="text-sm font-reem-kufi font-bold tracking-wide">
            SHOW ALL
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Left Arrow */}
      <button
        onClick={scrollLeft}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 
             w-6 h-14 bg-brown-dark rounded-sm shadow-category items-center 
             justify-center hover:bg-opacity-80 transition"
      >
        <ChevronLeft className="w-4 h-6 text-mint-light" strokeWidth={1.75} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={scrollRight}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 
             w-6 h-14 bg-brown-dark rounded-sm shadow-category items-center 
             justify-center hover:bg-opacity-80 transition"
      >
        <ChevronRight className="w-4 h-6 text-mint-light" strokeWidth={1.75} />
      </button>

      {/* Scrollable Product Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
      >
        {products.map((product, index) => (
          <div key={index} className="flex-shrink-0">
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestSellers;
