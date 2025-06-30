// IN: your product list page file (e.g., src/app/admin/products/page.tsx)
// ACTION: Replace the entire file with this.

"use client";

import { useState, useEffect, useMemo } from "react";
import { Pencil, Trash, Eye } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductModal from "@/components/admin/ProductModal";
import api from "@/lib/api";
import { Product, ProductForm } from "@/types"; // <-- Import ProductForm as well
import axios from "axios";
import NotchedInput from "@/components/ui/NotchedInput";
import NotchedSelect from "@/components/ui/NotchedSelect";

/* Helper functions updated for new data types */
const firstUrl = (urls: string[]) => urls?.[0] ?? "/placeholder.png";

const totalStockOf = (p: Product) =>
  p.variants.reduce((sum, v) => sum + (v.stock ?? 0), 0);

/* ───────────────────────────────────── */
export default function AdminProductList() {
  /* core state ------------------------------------------------------- */
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /* modal state ------------------------------------------------------ */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  /* filter + paging state ------------------------------------------- */
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  // const [sort, setSort] = useState("Name A-Z");
  const [sortBy, setSortBy] = useState("createdAt"); // 'createdAt' is the field name
  const [sortDirection, setSortDirection] = useState("desc"); // 'asc' or 'desc'
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [status, setStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;
  const [search, setSearch] = useState("");

  /* Data fetching with useEffect and Axios -------------------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/products", {
          params: {
            limit: 10000,
          },
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ---------- modal open helpers ---------- */
  const openCreate = () => {
    setSelectedProduct(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setSelectedProduct(p);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const openView = (p: Product) => {
    setSelectedProduct(p);
    setModalMode("view");
    setIsModalOpen(true);
  };

  /* ---------- Dynamically create filter options from fetched data ---------- */
  const brandList = useMemo(() => {
    const allBrands = products.map((p) => p.brand);
    const uniqueBrands = Array.from(
      new Map(allBrands.map((b) => [b.id, b])).values()
    );
    return uniqueBrands;
  }, [products]);

  const categoryList = useMemo(() => {
    const allCategories = products.flatMap((p) => p.categories);
    const uniqueCategories = Array.from(
      new Map(allCategories.map((c) => [c.id, c])).values()
    );
    return uniqueCategories;
  }, [products]);

  const brandOptions = ["All", ...brandList.map((b) => b.name)];
  const categoryOptions = ["All", ...categoryList.map((c) => c.name)];

  const handleDelete = async (productId: number) => {
    // Always confirm a destructive action with the user!
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this product?"
      )
    ) {
      return;
    }

    try {
      // Call the DELETE endpoint on your backend
      await api.delete(`/products/${productId}`);

      // On success, remove the product from the local state for an instant UI update
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      alert("Product deleted successfully.");
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Error: Could not delete the product.");
    }
  };

  const handleSave = async (formData: ProductForm) => {
    if (modalMode === "create") {
      // =================================================================
      //  LOGIC FOR CREATE - Restored to the version that worked
      // =================================================================
      try {
        const dataToUpload = new FormData();

        // 1. Separate files from the rest of the data.
        const { newImages, imageUrls, ...restOfData } = formData;

        // 2. Create a clean payload that matches the CreateProductDto
        const payload = {
          ...restOfData,
          // Strip out fields the backend doesn't expect for new variants
          variants: formData.variants.map(
            ({ id, imageUrls, newImages, ...restOfVariant }) => restOfVariant
          ),
        };
        dataToUpload.append("data", JSON.stringify(payload));

        // 3. Append new files for the main product and variants
        if (newImages) {
          newImages.forEach((file) => dataToUpload.append("newImages", file));
        }
        formData.variants.forEach((variant) => {
          if (variant.newImages && variant.newImages.length > 0) {
            dataToUpload.append("variantImages", variant.newImages[0]);
          }
        });

        // 4. Make the API call
        const response = await api.post("/products", dataToUpload);
        const newProductFromServer = response.data;

        setProducts((prev) => [...prev, newProductFromServer]);
        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to create product:", error);
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.message;
          const errorMessage = Array.isArray(message)
            ? message.join(", ")
            : message;
          alert(`Error: ${errorMessage}`);
        } else {
          alert("An unknown error occurred while creating the product.");
        }
      }
    } else if (modalMode === "edit" && selectedProduct) {
      // =================================================================
      //  LOGIC FOR EDIT - Self-contained and correct
      // =================================================================
      try {
        const dataToUpload = new FormData();

        // 1. Separate files from the rest of the data.
        const { newImages, ...restOfData } = formData;

        // 2. Create the data payload, which for an edit, needs to include existing variant IDs and imageUrls to keep.
        const payload = {
          ...restOfData,
          variants: formData.variants.map(
            ({ newImages, ...restOfVariant }) => ({
              ...restOfVariant,
              // Ensure ID is only included if it's a real, existing variant
              id:
                restOfVariant.id && restOfVariant.id > 0
                  ? restOfVariant.id
                  : undefined,
              newImageWasUploaded: !!(newImages && newImages.length > 0),
            })
          ),
        };
        dataToUpload.append("data", JSON.stringify(payload));

        // 3. Append any NEWLY added images for the main product and variants
        if (newImages) {
          newImages.forEach((file) => dataToUpload.append("newImages", file));
        }
        formData.variants.forEach((variant) => {
          if (variant.newImages && variant.newImages.length > 0) {
            dataToUpload.append("variantImages", variant.newImages[0]);
          }
        });

        // 4. Make the API call
        const response = await api.patch(
          `/products/${selectedProduct.id}`,
          dataToUpload
        );

        const updatedProductFromServer = response.data;
        setProducts((prev) =>
          prev.map((p) =>
            p.id === updatedProductFromServer.id ? updatedProductFromServer : p
          )
        );

        setIsModalOpen(false);
      } catch (error) {
        console.error("Failed to update product:", error);
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.message;
          const errorMessage = Array.isArray(message)
            ? message.join(", ")
            : message;
          alert(`Error: ${errorMessage}`);
        } else {
          alert("An unknown error occurred while updating the product.");
        }
      }
    }
  };

  /* ---------- filtering ---------- */
  let filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "All" || p.categories.some((c) => c.name === category);
    const matchBrand = brand === "All" || p.brand.name === brand;
    const matchStatus =
      status === "All" || p.isActive === (status === "Active");
    const matchMin = minPrice === "" || p.price >= Number(minPrice);
    const matchMax = maxPrice === "" || p.price <= Number(maxPrice);
    return (
      matchSearch &&
      matchCategory &&
      matchBrand &&
      matchStatus &&
      matchMin &&
      matchMax
    );
  });

  // Create a mutable copy to sort
  let sortedProducts = [...filtered];

  // The main sorting logic
  sortedProducts.sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case "name":
        result = a.name.localeCompare(b.name);
        break;
      case "price":
        result = a.price - b.price;
        break;
      case "rating":
        result = (a.rating ?? 0) - (b.rating ?? 0);
        break;
      case "reviewCount":
        result = (a.reviewCount ?? 0) - (b.reviewCount ?? 0);
        break;
      case "createdAt":
        result =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      default:
        result = 0;
    }
    return result;
  });

  // Handle the direction after the initial sort
  if (sortDirection === "desc") {
    sortedProducts.reverse();
  }

  // Finally, use this new sorted array for pagination
  const paginated = sortedProducts.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  /* ---------- pagination ---------- */
  /*   const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  ); */
  const totalPages = Math.ceil(filtered.length / perPage);

  /* ───────────────────────────────────── JSX ───────────────────────────────────── */
  return (
    <AdminLayout>
      {/* Header and Filters are unchanged... */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-playfair text-2xl font-bold text-dark-gray">
          Products
        </h1>
        <button
          onClick={openCreate}
          className="btn-dark rounded px-4 py-2 text-sm"
        >
          + Add Product
        </button>
      </div>

      <div className="mb-4 flex flex-wrap justify-start items-center gap-3 text-sm">
        <NotchedInput
          label="Search"
          type="text"
          placeholder="Search brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[300px]"
        />

        <NotchedSelect
          id="category-filter"
          label="Category"
          className="w-[140px]" // Pass the width here
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions.map((c) => ({ value: c, label: c }))}
        />

        <NotchedSelect
          id="brand-filter"
          label="Brand"
          className="w-[140px]"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          options={brandOptions.map((b) => ({ value: b, label: b }))}
        />

        <NotchedSelect
          id="status-filter"
          label="Status"
          className="w-[130px]"
          options={["All", "Active", "Inactive"].map((s) => ({
            value: s,
            label: s,
          }))}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />

        {/*  NEW "SORT BY" DROPDOWN */}
        <NotchedSelect
          label="Sort By"
          className="w-[150px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={[
            { value: "createdAt", label: "Date" },
            { value: "name", label: "Name" },
            { value: "price", label: "Price" },
            { value: "rating", label: "Rating" },
            { value: "reviewCount", label: "Reviews" },
          ]}
        />

        {/*  NEW "DIRECTION" DROPDOWN */}
        <NotchedSelect
          label="Order"
          className="w-[150px]"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
          options={[
            { value: "desc", label: "Z-A" },
            { value: "asc", label: "A-Z" },
          ]}
        />

        <NotchedInput
          type="number"
          label="Min Price"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-[110px]"
        />

        <NotchedInput
          type="number"
          label="Max Price"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-[110px]"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-light-green">
        <table className="min-w-full text-left font-montserrat text-sm text-dark-gray">
          <thead className="bg-light-green text-xs font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Reviews</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center p-4">
                  Loading Products...
                </td>
              </tr>
            ) : paginated.length > 0 ? (
              paginated.map((p) => (
                <tr key={p.id} className="border-t border-light-green">
                  <td className="px-4 py-3">
                    <img
                      src={firstUrl(p.imageUrls)}
                      alt={p.name}
                      className="h-14 w-14 rounded object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3">$ {p.price}</td>
                  <td className="px-4 py-3">{Number(p.rating).toFixed(1)}</td>
                  <td className="px-4 py-3">
                    {p.reviewCount ? p.reviewCount : "0"}
                  </td>
                  <td className="px-4 py-3">{p.brand.name}</td>
                  <td className="px-4 py-3">
                    {p.categories.map((c) => c.name).join(", ")}
                  </td>
                  <td className="px-4 py-3">{totalStockOf(p)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded px-2 py-1 text-xs font-bold ${
                        p.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="flex items-center gap-2 px-4 py-3">
                    <button
                      onClick={() => openView(p)}
                      className="rounded p-1 transition hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4 text-blue-500" />
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded p-1 transition hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="rounded p-1 transition hover:bg-gray-100"
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center p-4">
                  No products match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setCurrentPage(n)}
            className={`rounded border px-3 py-1.5 text-sm font-bold ${
              n === currentPage
                ? "border-dark-gray bg-dark-gray text-mint-light"
                : "border-dark-gray text-dark-gray hover:bg-dark-gray hover:text-mint-light"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Product Modal */}
      <ProductModal
        mode={modalMode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedProduct}
        onSubmit={modalMode === "view" ? undefined : handleSave}
        brands={brandList}
        categories={categoryList}
      />
    </AdminLayout>
  );
}
