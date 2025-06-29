"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import BrandModal from "@/components/admin/BrandModal";
import { Pencil, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Brand, BrandForm } from "@/types";
import axios from "axios";
import NotchedSelect from "@/components/ui/NotchedSelect";
import NotchedInput from "@/components/ui/NotchedInput";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Brand | null>(null);
  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchBrands = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/brands");
        setBrands(response.data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const openCreate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEdit = (brand: Brand) => {
    setEditData(brand);
    setIsModalOpen(true);
  };

  const handleDelete = async (brandId: number) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) return;
    try {
      await api.delete(`/brands/${brandId}`);
      setBrands((prev) => prev.filter((b) => b.id !== brandId));
    } catch (error) {
      console.error("Failed to delete brand:", error);
      alert("Error deleting brand.");
    }
  };

  const handleSubmit = async (data: any) => {
    // data is the state from your BrandModal
    const formData = new FormData();

    // Append text fields
    formData.append("name", data.name);
    formData.append("subtitle", data.subtitle);
    formData.append("description", data.description);

    // ✅ THE FIX: Only append imageUrl if it's not an empty string
    if (data.imageUrl) {
      formData.append("imageUrl", data.imageUrl);
    }
    if (data.newImage) {
      formData.append("newImage", data.newImage);
    }

    if (editData) {
      // Edit Mode
      try {
        const response = await api.patch(`/brands/${editData.id}`, formData);
        setBrands((prev) =>
          prev.map((b) => (b.id === editData.id ? response.data : b))
        );
      } catch (error) {
        console.error("Failed to update brand:", error);
        alert("Error updating brand.");
      }
    } else {
      // Create Mode
      try {
        const response = await api.post("/brands", formData);
        setBrands((prev) => [...prev, response.data]);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          alert(`Error: ${error.response.data.message}`);
        } else {
          alert("An unknown error occurred.");
        }
      }
    }
  };

  let filtered = brands.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase());
    b.name.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  // ✅ ADD THIS ENTIRE SORTING BLOCK
  let sortedBrands = [...filtered];
  sortedBrands.sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case "name":
        result = a.name.localeCompare(b.name);
        break;

      default:
        result = 0;
    }
    return result;
  });

  if (sortDirection === "desc") {
    sortedBrands.reverse();
  }

  // Ensure you use 'sortedBrands' for pagination
  // 4. Pagination
  const totalPages = Math.ceil(sortedBrands.length / perPage);
  const paginated = sortedBrands.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-playfair font-bold text-dark-gray">
          Brands
        </h1>
        <button
          onClick={openCreate}
          className="btn-dark px-4 py-2 rounded text-sm"
        >
          + Add Brand
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <NotchedInput
          label="Search"
          type="text"
          placeholder="Search brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[200px]"
        />
        {/* ✅ ADD THESE TWO DROPDOWNS */}
        {/* <NotchedSelect
          label="Sort By"
          className="w-[130px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={[{ value: "name", label: "Name" }]}
        /> */}
        <NotchedSelect
          label="Order"
          className="w-[130px]"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
          options={[
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
          ]}
        />
      </div>
      <div className="overflow-x-auto rounded border border-light-green">
        <table className="min-w-full text-sm text-left font-montserrat text-dark-gray">
          <thead className="bg-light-green text-xs font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Logo</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : (
              paginated.map((brand) => (
                <tr key={brand.id} className="border-t border-light-green">
                  <td className="px-4 py-3">
                    <img
                      src={brand.imageUrl || "/placeholder.png"}
                      alt={brand.name}
                      className="h-10 w-16 object-contain"
                    />
                  </td>
                  <td className="px-4 py-3">{brand.name}</td>
                  <td className="px-4 py-3">{brand.slug}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button
                      onClick={() => openEdit(brand)}
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-center gap-2">
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

      <BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editData ?? undefined}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}
