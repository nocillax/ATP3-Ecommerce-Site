"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import api from "@/lib/api";
import { Product, Category, Brand } from "@/types"; // Import Brand type

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]); // ✅ State for brands
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "All",
    brand: searchParams.get("brand") || "All", // ✅ Add brand to filters
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "createdAt-desc",
    page: Number(searchParams.get("page")) || 1,
  });

  // Fetch initial data for filters
  useEffect(() => {
    // Fetch both categories and brands for the filter buttons
    const fetchFilterData = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          api.get("/categories", { params: { isFeatured: true } }),
          api.get("/brands"),
        ]);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
      } catch (error) {
        console.error("Failed to fetch filter data", error);
      }
    };
    fetchFilterData();
  }, []);

  // Main useEffect to fetch products when any filter changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set("page", String(filters.page));
      params.set("limit", "18");
      if (filters.search) params.set("search", filters.search);
      if (filters.category !== "All") params.set("category", filters.category);
      if (filters.brand !== "All") params.set("brand", filters.brand); // ✅ Add brand to API call
      if (filters.sort) {
        const [sort, order] = filters.sort.split("-");
        params.set("sort", sort);
        params.set("order", order.toUpperCase());
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });

      try {
        const response = await api.get(`/products?${params.toString()}`);
        setProducts(response.data.data);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [filters, pathname, router]);

  const handleFilterChange = (
    filterName: keyof typeof filters,
    value: string | number
  ) => {
    setFilters((prev) => ({ ...prev, [filterName]: value, page: 1 }));
  };

  const categoryOptions = [{ id: 0, slug: "All", name: "All" }, ...categories];
  const brandOptions = [{ id: 0, slug: "All", name: "All" }, ...brands];

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-6">
        All Products
      </h2>

      {/* Search and Sort controls */}

      {/* Category Filter */}
      <div className="mb-2">
        <span className="text-sm font-bold mr-4">Categories:</span>
        <div className="inline-flex gap-3 flex-wrap">
          {categoryOptions.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleFilterChange("category", cat.slug)} /*...*/
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ✅ NEW: Brand Filter */}
      <div className="mb-6">
        <span className="text-sm font-bold mr-4">Brands:</span>
        <div className="inline-flex gap-3 flex-wrap">
          {brandOptions.map((brand) => (
            <button
              key={brand.id}
              onClick={() => handleFilterChange("brand", brand.slug)}
              className={`px-4 py-1.5 rounded-full border text-sm font-bold transition ${
                filters.brand === brand.slug
                  ? "bg-dark-gray text-mint-light"
                  : "border-dark-gray text-dark-gray"
              }`}
            >
              {brand.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-8 min-h-[400px]">
        {isLoading ? (
          <p>Loading...</p>
        ) : products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              brand={product.brand.name}
            />
          ))
        ) : (
          <p className="col-span-full">
            No products found for the selected filters.
          </p>
        )}
      </div>

      {/* Pagination */}
    </section>
  );
}
