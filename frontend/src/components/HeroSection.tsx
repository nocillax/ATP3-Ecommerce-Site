"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroImages = ["/images/hero/hero1.jpg", "/images/hero/hero2.jpg"];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4">
      <div
        className="relative h-[250px] md:h-[350px] rounded-md overflow-hidden shadow-soft bg-cover bg-center"
        style={{ backgroundImage: `url('${heroImages[current]}')` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Text block */}
        <div className="absolute inset-0 flex items-center px-6">
          <div className="bg-black/40 backdrop-blur-sm rounded-md p-4 max-w-md">
            <h1 className="font-reem-kufi text-2xl md:text-3xl text-beige mb-2 tracking-wide">
              UNVEIL - A - NEW - LOOK
            </h1>
            <h2 className="font-reem-kufi text-2xl md:text-3xl text-beige tracking-wide">
              EVERYDAY.
            </h2>
            <button className="btn-primary mt-6 px-6 py-3 rounded-md text-sm">
              SHOP NOW
            </button>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-16 bg-brown-dark rounded-sm shadow-category flex items-center justify-center hover:bg-brown/80 transition"
        >
          <ChevronLeft className="w-4 h-8 text-mint-light" strokeWidth={1.75} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-16 bg-brown-dark rounded-sm shadow-category flex items-center justify-center hover:bg-brown/80 transition"
        >
          <ChevronRight
            className="w-4 h-8 text-mint-light"
            strokeWidth={1.75}
          />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
