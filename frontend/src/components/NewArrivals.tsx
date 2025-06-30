// FILE: src/components/NewArrivals.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/types";

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  //  useEffect to fetch the latest 10 products on mount
  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await api.get("/products", {
          params: {
            sort: "createdAt",
            order: "DESC",
            limit: 10,
          },
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      }
    };
    fetchNewArrivals();
  }, []);

  const scroll = (direction: "left" | "right") => {
    const offset = direction === "left" ? -320 : 320;
    scrollRef.current?.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 mt-8 relative">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-6 text-center">
        New Arrivals
      </h2>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2 no-scrollbar scrollbar-hide"
        >
          {products.map((product) => (
            //  Each card is now a link to the product's detail page
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="block flex-shrink-0"
            >
              <div className="w-[350px] min-h-[650px] flex flex-col bg-mint-light rounded-lg border border-light-green shadow-soft overflow-hidden group hover:shadow-md transition-shadow">
                {/*  Image stays fixed height */}
                <div className="h-[400px] bg-gray-100 overflow-hidden">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${product.imageUrls[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/*  Content grows/shrinks but within limits */}
                <div className="flex flex-col justify-between p-4 flex-grow">
                  <div className="mb-4">
                    <h3 className="font-reem-kufi text-[20px] font-extrabold text-dark-gray mb-4">
                      {product.brand.name}
                    </h3>
                    <h4 className="font-quicksand text-[20px] font-bold text-dark-gray mb-6">
                      {product.name}
                    </h4>
                    <h5 className="font-montserrat text-[14px] font-medium text-dark-gray mb-3">
                      {product.subtitle}
                    </h5>
                  </div>

                  {/*  Price section pinned to bottom */}
                  <div className="flex items-baseline justify-between mt-auto">
                    <div className="flex items-baseline gap-1">
                      <sup className="text-sm font-crimson text-dark-gray relative -top-1">
                        $
                      </sup>
                      <span className="text-xl font-semibold font-crimson text-dark-gray">
                        {product.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Arrows */}
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 ..."
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 ..."
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
