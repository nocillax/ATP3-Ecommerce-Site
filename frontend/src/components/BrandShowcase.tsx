// FILE: src/components/ShopByBrands.tsx (or wherever your section component lives)
"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import BrandCard from "./BrandCard";
import api from "@/lib/api";
import { Brand } from "@/types";

export default function ShopByBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  // ✅ Create a ref to access the scrollable container
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // Fetch brands from your API, limited to a few for the homepage
        const response = await api.get("/brands", { params: { limit: 3 } });
        setBrands(response.data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
    };
    fetchBrands();
  }, []);

  // ✅ Handler to scroll the container
  const handleScroll = (scrollOffset: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-8 relative">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-6 text-center">
        Shop By Brand
      </h2>

      <div className="relative">
        {/* ✅ Wrapper that overlays arrows inside the scroll area perfectly */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex justify-between items-center px-4 z-10">
          <button
            onClick={() => handleScroll(-300)}
            className="p-1 rounded-full bg-transparent text-brown-dark hover:bg-brown-light/20 transition pointer-events-auto"
          >
            <ChevronLeft size={28} strokeWidth={2} />
          </button>

          <button
            onClick={() => handleScroll(300)}
            className="p-1 rounded-full bg-transparent text-brown-dark hover:bg-brown-light/20 transition pointer-events-auto"
          >
            <ChevronRight size={28} strokeWidth={2} />
          </button>
        </div>

        {/* ✅ Scrollable Brand Cards */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scroll-smooth scroll-snap-x mandatory no-scrollbar px-4"
        >
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="scroll-snap-start flex-shrink-0 w-[280px]"
            >
              <BrandCard
                name={brand.name}
                subtitle={brand.description ?? ""}
                image={`${process.env.NEXT_PUBLIC_API_BASE_URL}${brand.imageUrl}`}
                slug={brand.slug}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
