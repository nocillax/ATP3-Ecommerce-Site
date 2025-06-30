"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import CategoryModal from "@/components/admin/CategoryModal";
import { Pencil, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api"; // Import your axios instance
import NotchedSelect from "@/components/ui/NotchedSelect";
import { Category, CategoryForm } from "@/types"; // Adjust the import path as needed
import NotchedInput from "@/components/ui/NotchedInput";
import axios from "axios";

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");

export default function AdminCategoriesPage() {
  // 2. State for loading and fetched data
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<Category | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sortBy, setSortBy] = useState("name"); // Default sort by name
  const [sortDirection, setSortDirection] = useState("asc"); // Default to A-Z
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const openCreate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditData(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;
    try {
      await api.delete(`/categories/${categoryId}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Error deleting category.");
    }
  };

  const handleSubmit = async (data: CategoryForm) => {
    if (editData) {
      // --- EDIT MODE ---
      try {
        const response = await api.patch(`/categories/${editData.id}`, data);
        const updatedCategory = response.data;

        setCategories((prev) =>
          prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c))
        );
      } catch (error) {
        console.error("Failed to update category:", error);
        alert("Error: Could not update the category.");
      }
    } else {
      // --- CREATE MODE ---
      try {
        const response = await api.post("/categories", data);
        const newCategory = response.data;

        setCategories((prev) => [...prev, newCategory]);
      } catch (error) {
        console.error("Failed to create category:", error);
        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data.message;
          const errorMessage = Array.isArray(message)
            ? message.join(", ")
            : message;
          alert(`Error: ${errorMessage}`);
        } else {
          alert("An unknown error occurred.");
        }
      }
    }
  };

  let filtered = categories.filter((cat) => {
    const matchSearch = cat.name.toLowerCase().includes(search.toLowerCase());
    // ✅ Add matching for the new status filter
    const matchStatus =
      status === "All" || cat.isFeatured === (status === "Featured");
    return matchSearch && matchStatus;
  });

  let sortedCategories = [...filtered];
  sortedCategories.sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case "name":
        result = a.name.localeCompare(b.name);
        break;
      case "createdAt":
        result =
          new Date(a.createdAt ?? 0).getTime() -
          new Date(b.createdAt ?? 0).getTime();
        break;
      default:
        result = 0;
    }
    return result;
  });

  if (sortDirection === "desc") {
    sortedCategories.reverse();
  }

  const totalPages = Math.ceil(sortedCategories.length / perPage);
  const paginated = sortedCategories.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-playfair font-bold text-dark-gray">
          Categories
        </h1>
        <button
          onClick={openCreate}
          className="btn-dark px-4 py-2 rounded text-sm"
        >
          + Add Category
        </button>
      </div>

      {/* Filter Controls */}
      <div className="mb-4 flex flex-wrap gap-3 text-sm items-center">
        <NotchedInput
          label="Search"
          type="text"
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[200px]"
        />
        {/* Status Filter */}
        <NotchedSelect
          label="Status"
          className="w-[140px]"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "All", label: "All" },
            { value: "Featured", label: "Featured" },
            { value: "Not Featured", label: "Not Featured" },
          ]}
        />
        {/* New Sort Controls */}
        <NotchedSelect
          label="Sort By"
          className="w-[130px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={[
            { value: "name", label: "Name" },
            { value: "createdAt", label: "Date" },
          ]}
        />
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          {/* 4. Updated table body to handle loading and empty states */}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : paginated.length > 0 ? (
              paginated.map((cat) => (
                <tr key={cat.id} className="border-t border-light-green">
                  <td className="px-4 py-3">{cat.name}</td>
                  <td className="px-4 py-3">{cat.slug}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center p-4">
                  No categories found.
                </td>
              </tr>
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

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editData ?? undefined}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}
