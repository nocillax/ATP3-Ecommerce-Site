// FILE: src/components/FeaturedProducts.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import api from "@/lib/api";
import { Product } from "@/types";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        //  The main change is the API call inside useEffect
        const response = await api.get("/products", {
          params: {
            isFeatured: true, // Fetch products where isFeatured is true
            limit: 10, // Limit to 10 products
          },
        });
        // The paginated endpoint nests the array in the 'data' property
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const offset = direction === "left" ? -320 : 320;
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  if (products.length === 0) {
    return null; // Don't render the section if there are no featured products
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-10 mt-8">
      {/*  The heading is updated */}
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-6 text-center">
        Featured Products
      </h2>

      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray/20 hover:bg-dark-gray/10 rounded-full p-2 transition "
        >
          <ChevronLeft className="text-dark-gray" />
        </button>

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
