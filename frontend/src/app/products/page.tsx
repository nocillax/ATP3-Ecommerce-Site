// // FILE: src/app/products/page.tsx
// "use client";

// import ProductCard from "@/components/ProductCard";
// import { useState, useEffect } from "react";
// import api from "@/lib/api";
// import { Product, Category } from "@/types";
// import { useSearchParams, useRouter, usePathname } from "next/navigation";

// export default function ProductsPage() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   // Hooks to manage and read the URL
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   // Initialize state from URL search params for bookmarking/sharing
//   const [selectedCategory, setSelectedCategory] = useState(
//     searchParams.get("category") || "All"
//   );
//   const [searchTerm, setSearchTerm] = useState(
//     searchParams.get("search") || ""
//   );
//   const [sort, setSort] = useState(
//     searchParams.get("sort") || "createdAt-desc"
//   );
//   const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
//   const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
//   const [currentPage, setCurrentPage] = useState(
//     Number(searchParams.get("page")) || 1
//   );

//   const productsPerPage = 18;

//   // This single useEffect now handles all data fetching and re-fetching when a filter changes.
//   useEffect(() => {
//     // Construct a new URL search parameter string based on the current state of all filters
//     const params = new URLSearchParams();
//     params.set("page", String(currentPage));
//     params.set("limit", String(productsPerPage));
//     if (searchTerm) params.set("search", searchTerm);
//     if (selectedCategory !== "All") params.set("category", selectedCategory);
//     if (minPrice) params.set("minPrice", minPrice);
//     if (maxPrice) params.set("maxPrice", maxPrice);
//     if (sort) {
//       const [sortBy, order] = sort.split("-");
//       params.set("sort", sortBy);
//       params.set("order", order.toUpperCase());
//     }

//     // Gently update the browser's URL without a full page reload
//     router.replace(`${pathname}?${params.toString()}`, { scroll: false });

//     const fetchProducts = async () => {
//       setIsLoading(true);
//       try {
//         // The API call now sends all filters to the backend
//         const response = await api.get(`/products?${params.toString()}`);
//         setProducts(response.data.data);
//         setTotalPages(response.data.totalPages);
//       } catch (error) {
//         console.error("Failed to fetch products:", error);
//         setProducts([]); // Clear products on error
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [selectedCategory, searchTerm, minPrice, maxPrice, sort, currentPage]); // Dependency array re-runs this effect on any filter change

//   // This useEffect only runs once to fetch the category buttons
//   useEffect(() => {
//     api
//       .get("/categories", { params: { isFeatured: true } })
//       .then((res) => setCategories(res.data));
//   }, []);

//   const categoryOptions = [{ name: "All", slug: "All" }, ...categories];

//   return (
//     <section className="max-w-7xl mx-auto px-4 py-10">
//       <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-6">
//         All Products
//       </h2>

//       {/* Filter controls - Your exact JSX is preserved */}
//       <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//         <input
//           type="text"
//           placeholder="Search product or brand..."
//           value={searchTerm}
//           onChange={(e) => {
//             setSearchTerm(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="md:col-span-2 w-full px-5 py-2 border border-dark-gray rounded-full bg-mint-light focus:outline-none"
//         />
//         <select
//           value={sort}
//           onChange={(e) => {
//             setSort(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="px-3 py-1 border border-dark-gray text-dark-gray rounded-sm bg-mint-light focus:outline-none"
//         >
//           <option value="createdAt-desc">Newest</option>
//           <option value="price-asc">Price: Low to High</option>
//           <option value="price-desc">Price: High to Low</option>
//           <option value="rating-desc">Rating: High to Low</option>
//           <option value="name-asc">Name: A-Z</option>
//           <option value="name-desc">Name: Z-A</option>
//         </select>
//       </div>

//       <div className="mb-6 flex gap-3 flex-wrap">
//         {categoryOptions.map((cat) => (
//           <button
//             key={cat.slug}
//             onClick={() => {
//               setSelectedCategory(cat.name);
//               setCurrentPage(1);
//             }}
//             className={`px-4 py-1.5 rounded-full border text-sm font-bold transition ${
//               selectedCategory === cat.name
//                 ? "bg-dark-gray text-mint-light"
//                 : "border-dark-gray text-dark-gray"
//             }`}
//           >
//             {cat.name}
//           </button>
//         ))}
//       </div>

//       {/* Product Grid - Your exact JSX is preserved */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-8 min-h-[500px]">
//         {isLoading ? (
//           <p>Loading products...</p>
//         ) : (
//           products.map((product) => (
//             <ProductCard
//               key={product.id}
//               id={product.id}
//               name={product.name}
//               brand={product.brand.name}
//               price={product.price}
//               imageUrls={product.imageUrls}
//               isOnSale={product.isOnSale}
//               discountPercent={product.discountPercent}
//               rating={product.rating}
//               reviewCount={product.reviewCount}
//             />
//           ))
//         )}
//       </div>

//       {/* Pagination - Your exact JSX is preserved */}
//       <div className="mt-10 flex justify-center gap-2">
//         {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
//           <button
//             key={pageNum}
//             onClick={() => setCurrentPage(pageNum)}
//             className={`px-3 py-1.5 rounded border text-sm font-bold ${
//               pageNum === currentPage
//                 ? "bg-dark-gray text-mint-light border-dark-gray"
//                 : "border-dark-gray text-dark-gray hover:bg-dark-gray hover:text-mint-light"
//             }`}
//           >
//             {pageNum}
//           </button>
//         ))}
//       </div>
//     </section>
//   );
// }

// FILE: src/app/products/page.tsx
"use client";

import ProductCard from "@/components/ProductCard";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Product, Category, Brand } from "@/types"; // Import Brand
import { useSearchParams } from "next/navigation";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]); // To get brand names for filtering
  const [isLoading, setIsLoading] = useState(true);

  // This hook reads the URL parameters ONCE on page load.
  const searchParams = useSearchParams();

  // State for all filters is initialized from the URL.
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "All"
  );
  const [selectedBrand, setSelectedBrand] = useState(
    searchParams.get("brand") || "All"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("createdAt-desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 18;

  // This useEffect fetches ALL data only ONCE.
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.all([
          api.get("/products", { params: { limit: 1000 } }),
          api.get("/categories", { params: { isFeatured: true } }),
          api.get("/brands"),
        ]);
        setProducts(productsRes.data.data);
        setCategories(categoriesRes.data);
        setBrands(brandsRes.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const categoryOptions = [{ name: "All", slug: "All" }, ...categories];

  // Your original client-side filtering logic, with brand filter added.
  let filteredProducts = products
    .filter(
      (p) =>
        selectedCategory === "All" ||
        p.categories.some((c) => c.slug === selectedCategory)
    )
    .filter((p) => selectedBrand === "All" || p.brand.slug === selectedBrand) // Filter by brand slug
    .filter((p) =>
      `${p.name} ${p.brand.name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter((p) => (minPrice ? p.price >= parseInt(minPrice) : true))
    .filter((p) => (maxPrice ? p.price <= parseInt(maxPrice) : true));

  // Your original sorting logic.
  const [sortBy, sortDirection] = sort.split("-");
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

  // Your original pagination logic.
  const start = (currentPage - 1) * productsPerPage;
  const paginated = filteredProducts.slice(start, start + productsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    // YOUR JSX IS 100% UNCHANGED
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-playfair font-bold text-dark-gray mb-6">
        All Products
      </h2>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <input
          type="text"
          placeholder="Search product or brand..."
          value={searchTerm}
          onChange={(e) => {
            setCurrentPage(1);
            setSearchTerm(e.target.value);
          }}
          className="md:col-span-2 w-full px-5 py-2 border border-dark-gray rounded-full bg-mint-light focus:outline-none"
        />
        <select
          value={sort}
          onChange={(e) => {
            setCurrentPage(1);
            setSort(e.target.value);
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
            key={cat.slug}
            onClick={() => {
              setCurrentPage(1);
              setSelectedCategory(cat.slug);
            }}
            className={`px-4 py-1.5 rounded-full border text-sm font-bold transition ${
              selectedCategory === cat.slug
                ? "bg-dark-gray text-mint-light"
                : "border-dark-gray text-dark-gray"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-8 min-h-[500px]">
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
