// FILE: src/app/admin/hero-images/page.tsx
"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import HeroImageModal from "@/components/admin/HeroImageModal";
import api from "@/lib/api";
import { HeroImage } from "@/types";
import { Pencil, Trash } from "lucide-react";
import NotchedInput from "@/components/ui/NotchedInput";
import NotchedSelect from "@/components/ui/NotchedSelect";

export default function AdminHeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<HeroImage | null>(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("displayOrder");
  const [sortDirection, setSortDirection] = useState("asc");

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/hero-images/all"); // Get all images
      setImages(response.data);
    } catch (error) {
      console.error("Failed to fetch hero images", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    fetchImages();
  }, []);

  const openCreate = () => {
    setEditData(null);
    setIsModalOpen(true);
  };
  const openEdit = (image: HeroImage) => {
    setEditData(image);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editData) {
        await api.patch(`/hero-images/${editData.id}`, formData);
      } else {
        await api.post("/hero-images", formData);
      }
      fetchImages(); // Refresh the list
    } catch (error) {
      console.error("Failed to save hero image", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await api.delete(`/hero-images/${id}`);
      fetchImages(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete hero image", error);
    }
  };

  // Filtering and Sorting Logic
  let filtered = images.filter((img) =>
    img.title.toLowerCase().includes(search.toLowerCase())
  );

  let sorted = [...filtered].sort((a, b) => {
    let result = 0;
    switch (sortBy) {
      case "title":
        result = a.title.localeCompare(b.title);
        break;
      case "displayOrder":
        result = a.displayOrder - b.displayOrder;
        break;
    }
    return sortDirection === "asc" ? result : -result;
  });

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = sorted.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <AdminLayout>
      {/* ✅ Using the consistent page header style */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-playfair font-bold text-dark-gray">
          Manage Hero Banners
        </h1>
        <button
          onClick={openCreate}
          className="btn-dark px-4 py-2 rounded text-sm"
        >
          + Add New Banner
        </button>
      </div>

      {/* ✅ Added filter and sort controls */}
      <div className="mb-4 flex flex-wrap items-center gap-3 text-sm">
        <NotchedInput
          label="Search"
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[200px]"
        />
        <NotchedSelect
          label="Sort By"
          className="w-[150px]"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          options={[
            { value: "displayOrder", label: "Display Order" },
            { value: "title", label: "Title" },
          ]}
        />
        <NotchedSelect
          label="Order"
          className="w-[150px]"
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value)}
          options={[
            { value: "asc", label: "Ascending" },
            { value: "desc", label: "Descending" },
          ]}
        />
      </div>

      {/* ✅ Copied the main table styling */}
      <div className="overflow-x-auto rounded border border-light-green">
        <table className="min-w-full text-sm text-left font-montserrat text-dark-gray">
          <thead className="bg-light-green text-xs font-bold uppercase">
            <tr>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Link URL</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : paginated.length > 0 ? (
              paginated.map((image) => (
                <tr key={image.id} className="border-t border-light-green">
                  <td className="px-4 py-3">
                    {/* ✅ Restored your preferred image preview size */}
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${image.imageUrl}`}
                      alt={image.title}
                      className="h-10 w-20 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-3">{image.title}</td>
                  <td className="px-4 py-3">{image.linkUrl}</td>
                  <td className="px-4 py-3">{image.displayOrder}</td>
                  <td className="px-4 py-3">
                    {/* ✅ Added a styled badge for the 'Status' column */}
                    <span
                      className={`rounded px-2 py-1 text-xs font-bold ${
                        image.isActive
                          ? "bg-sky-100 text-sky-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {image.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <button
                      onClick={() => openEdit(image)}
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <Trash size={16} className="text-red-500" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-4 italic text-gray-500"
                >
                  No hero banners found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
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

      <HeroImageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        initialData={editData ?? undefined}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
}
