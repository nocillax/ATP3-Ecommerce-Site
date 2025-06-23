"use client";

import ProductCard from "@/components/ProductCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const dummyProducts = [
  {
    id: 1,
    brand: "AYRAH",
    title: "Signature Satin Hijab",
    subtitle: "- Platinum Haze -",
    price: 899,
    originalPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba886fe?auto=format&fit=crop&w=800&q=80",
    category: "Hijab",
  },
  {
    id: 2,
    brand: "VELURÉ",
    title: "Premium Silk Hijab",
    subtitle: "- Mocha Dusk -",
    price: 1299,
    originalPrice: 1699,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    category: "Hijab",
  },
  {
    id: 3,
    brand: "LUMÉ",
    title: "Cotton Essentials",
    subtitle: "- Ivory Cream -",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    category: "Basicwear",
  },
  {
    id: 4,
    brand: "AYRAH",
    title: "Signature Satin Hijab",
    subtitle: "- Platinum Haze -",
    price: 899,
    originalPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba886fe?auto=format&fit=crop&w=800&q=80",
    category: "Hijab",
  },
  {
    id: 5,
    brand: "VELURÉ",
    title: "Premium Silk Hijab",
    subtitle: "- Mocha Dusk -",
    price: 1299,
    originalPrice: 1699,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    category: "Hijab",
  },
  {
    id: 6,
    brand: "LUMÉ",
    title: "Cotton Essentials",
    subtitle: "- Ivory Cream -",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    category: "Basicwear",
  },
  {
    id: 7,
    brand: "AYRAH",
    title: "Signature Satin Hijab",
    subtitle: "- Platinum Haze -",
    price: 899,
    originalPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba886fe?auto=format&fit=crop&w=800&q=80",
    category: "Hijab",
  },
  {
    id: 8,
    brand: "VELURÉ",
    title: "Premium Silk Hijab",
    subtitle: "- Mocha Dusk -",
    price: 1299,
    originalPrice: 1699,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    category: "Hijab",
  },
  {
    id: 9,
    brand: "LUMÉ",
    title: "Cotton Essentials",
    subtitle: "- Ivory Cream -",
    price: 599,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    category: "Basicwear",
  },
];

export default function BrandPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const categories = ["All", "Hijab", "Basicwear"];
  const sortOptions = [
    { label: "A–Z", value: "az" },
    { label: "Z–A", value: "za" },
    { label: "Price: Low to High", value: "low-high" },
    { label: "Price: High to Low", value: "high-low" },
  ];
  const { brand } = useParams(); // "velure"

  /* useEffect(() => {
    fetch(`/products?brand=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products); // array of product objects
        setBrandInfo(data.brand); // { name: "VELURÉ", slug: "velure" }
      });
  }, [slug]); */

  // 🔍 Filter + sort logic
  let filtered = dummyProducts
    .filter((p) =>
      selectedCategory === "All" ? true : p.category === selectedCategory
    )
    .filter((p) =>
      `${p.title} ${p.brand}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((p) => (minPrice ? p.price >= parseInt(minPrice) : true))
    .filter((p) => (maxPrice ? p.price <= parseInt(maxPrice) : true));

  if (sort === "az") filtered.sort((a, b) => a.title.localeCompare(b.title));
  if (sort === "za") filtered.sort((a, b) => b.title.localeCompare(a.title));
  if (sort === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high-low") filtered.sort((a, b) => b.price - a.price);

  // 📄 Pagination
  const start = (currentPage - 1) * productsPerPage;
  const paginated = filtered.slice(start, start + productsPerPage);
  const totalPages = Math.ceil(filtered.length / productsPerPage);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-6">
        All Products - {brand}
        {/* {brandInfo?.name} */}
      </h2>

      {/* Top Filter Controls */}
      <div className="mb-6 flex flex-wrap justify-between gap-4 text-sm">
        {/* Search */}
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-96 px-5 py-2 border border-dark-gray text-dark-gray rounded-full placeholder:text-dark-gray/50 bg-mint-light focus:outline-none"
        />

        <div className="flex gap-3">
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-3 py-1 border border-dark-gray text-dark-gray rounded-sm bg-mint-light focus:outline-none"
          >
            <option value="">Sort</option>
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-16 px-2 py-2 border border-dark-gray text-dark-gray rounded-sm text-sm bg-mint-light focus:outline-none"
            />
            <span className="text-dark-gray">–</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-16 px-2 py-2 border border-dark-gray text-dark-gray rounded-sm text-sm bg-mint-light focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex gap-3 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full border text-sm font-reem-kufi font-bold transition ${
              selectedCategory === cat
                ? "bg-dark-gray text-mint-light border-dark-gray"
                : "border-dark-gray text-dark-gray hover:bg-dark-gray hover:text-mint-light"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-8">
        {paginated.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`px-3 py-1.5 rounded border text-sm font-bold ${
              pageNum === currentPage
                ? "bg-dark-gray text-mint-light border-dark-gray"
                : "border-dark-gray text-dark-gray hover:bg-dark-gray hover:text-mint-light"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </section>
  );
}
