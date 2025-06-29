// FILE: src/app/products/page.tsx
"use client";

import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Product, Category } from "@/types"; // Assuming you have these in types/index.ts

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for all filters and sorting
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 18; // Increased for better layout

  // Fetch initial data for products and featured categories
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get("/products", { params: { limit: 1000 } }), // Get all products
          api.get("/categories", { params: { isFeatured: true } }), // Get only featured categories
        ]);
        setProducts(productsRes.data.data);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const categoryOptions = ["All", ...categories.map((c) => c.name)];

  // Client-side filtering and sorting logic
  let filteredProducts = products
    .filter(
      (p) =>
        selectedCategory === "All" ||
        p.categories.some((c) => c.name === selectedCategory)
    )
    .filter((p) =>
      `${p.name} ${p.brand.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((p) => (minPrice ? p.price >= parseInt(minPrice) : true))
    .filter((p) => (maxPrice ? p.price <= parseInt(maxPrice) : true));

  // Sorting logic
  filteredProducts.sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case "name":
        result = a.name.localeCompare(b.name);
        break;
      case "price":
        result = a.price - b.price;
        break;
      case "rating":
        result = (b.rating ?? 0) - (a.rating ?? 0);
        break;
      case "createdAt":
        result =
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
    }
    return sortDirection === "asc" ? result : -result;
  });

  // 📄 Pagination
  const start = (currentPage - 1) * productsPerPage;
  const paginated = filteredProducts.slice(start, start + productsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-6">
        All Products
      </h2>

      {/* Filter controls */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <input
          type="text"
          placeholder="Search product or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:col-span-2 w-full px-5 py-2 border border-dark-gray rounded-full bg-mint-light focus:outline-none"
        />
        <select
          value={sortBy + "-" + sortDirection}
          onChange={(e) => {
            const [sort, direction] = e.target.value.split("-");
            setSortBy(sort);
            setSortDirection(direction);
          }}
          className="px-3 py-1 border border-dark-gray text-dark-gray rounded-sm bg-mint-light focus:outline-none"
        >
          <option value="createdAt-desc">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="name-asc">Name: A-Z</option>
          <option value="name-desc">Name: Z-A</option>
        </select>
      </div>

      <div className="mb-6 flex gap-3 flex-wrap">
        {categoryOptions.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full border text-sm font-bold transition ${
              selectedCategory === cat
                ? "bg-dark-gray text-mint-light"
                : "border-dark-gray text-dark-gray"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-8">
        {isLoading ? (
          <p>Loading products...</p>
        ) : (
          paginated.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand.name}
              price={product.price}
              imageUrls={product.imageUrls}
              isOnSale={product.isOnSale}
              discountPercent={product.discountPercent}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
          ))
        )}
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
