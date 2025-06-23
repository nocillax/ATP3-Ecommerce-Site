"use client";

import BrandCard from "@/components/BrandCard";

const brands = [
  {
    name: "VELURÉ",
    subtitle: "Chiffon Elegance",
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    slug: "velure",
  },
  {
    name: "AYRAH",
    subtitle: "Satin Bold Series",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba886fe?auto=format&fit=crop&w=800&q=80",
    slug: "ayrah",
  },
  {
    name: "LUMÉ",
    subtitle: "Cotton Comfort",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    slug: "lume",
  },
];

export default function AllBrandsPage() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-8">
        All Brands
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => (
          <BrandCard key={brand.slug} {...brand} />
        ))}
      </div>
    </section>
  );
}
