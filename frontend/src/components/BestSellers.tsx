"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import api from "@/lib/api";
import { Product } from "@/types";

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  //  Add a ref to access the scrollable container
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await api.get("/products/bestsellers");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch best sellers:", error);
      }
    };
    fetchBestSellers();
  }, []);

  //  Add handlers to scroll the container
  const scroll = (direction: "left" | "right") => {
    const offset = direction === "left" ? -320 : 320; // Adjust scroll distance if needed
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-6 text-center">
        Our Best Sellers
      </h2>

      {/*  The container for the carousel and arrows */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray/20 hover:bg-dark-gray/10 rounded-full p-2 transition "
        >
          <ChevronLeft className="text-dark-gray" />
        </button>

        {/* The scrollable container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-4 overflow-x-auto scroll-smooth no-scrollbar scrollbar-hide px-4"
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0">
              <ProductCard
                id={product.id}
                brand={product.brand.name}
                name={product.name}
                price={product.price}
                imageUrls={product.imageUrls}
                isOnSale={product.isOnSale}
                discountPercent={product.discountPercent}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray/20 hover:bg-dark-gray/10 rounded-full p-2 transition "
        >
          <ChevronRight className="text-dark-gray/50" />
        </button>
      </div>
    </section>
  );
}
