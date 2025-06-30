// FILE: src/components/FeaturedCategories.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Category } from "@/types"; // Assuming Category type is in your types file

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchFeaturedCategories = async () => {
      try {
        // Fetch only the categories marked as "isFeatured"
        const response = await api.get("/categories", {
          params: { isFeatured: true },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch featured categories:", error);
      }
    };
    fetchFeaturedCategories();
  }, []);

  if (categories.length === 0) {
    // Don't render the section if there are no featured categories
    return null;
  }

  return (
    <section className="w-full px-4 md:px-6 mt-12 mb-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-6 text-center">
          Featured Categories
        </h2>

        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((category) => (
            <Link
              href={`/products?category=${category.slug}`}
              key={category.id}
              className="w-24 h-20 bg-brown-light border border-brown rounded-md shadow-category flex flex-col items-center justify-center px-4 hover:scale-105 transition-transform"
            >
              <p className="text-sm font-reem-kufi text-brown text-center font-bold">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
