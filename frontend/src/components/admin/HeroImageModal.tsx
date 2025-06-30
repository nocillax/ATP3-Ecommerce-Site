// FILE: src/components/admin/HeroImageModal.tsx
"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import NotchedInput from "../ui/NotchedInput";
import { HeroImage } from "@/types";

interface HeroImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  initialData?: HeroImage;
}

export default function HeroImageModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: HeroImageModalProps) {
  const [form, setForm] = useState({
    title: "",
    linkUrl: "",
    isActive: true,
    displayOrder: 0,
  });
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title,
        linkUrl: initialData.linkUrl,
        isActive: initialData.isActive,
        displayOrder: initialData.displayOrder,
      });
      setNewImage(null); // Reset file input on open
    } else {
      setForm({
        title: "",
        linkUrl: "/products",
        isActive: true,
        displayOrder: 0,
      });
      setNewImage(null); // Reset file input on open
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    const dataPayload: any = { ...form };
    if (initialData && !newImage) {
      dataPayload.imageUrl = initialData.imageUrl;
    }

    formData.append("data", JSON.stringify(dataPayload));

    if (newImage) {
      formData.append("image", newImage);
    }

    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    //  Changed to CSS Grid for consistent centering and scrolling
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/40 p-4">
      {/*  Matched styling, but kept a smaller max-width for this simpler form */}
      <div className="relative w-full max-w-lg rounded-md bg-white p-6 shadow-lg">
        <button
          className="absolute right-4 top-4 rounded p-1 hover:bg-gray-200"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>

        {/*  Matched title style */}
        <h2 className="mb-4 text-lg font-bold text-dark-gray">
          {initialData ? "Edit Hero Image" : "Add New Hero Image"}
        </h2>

        {/*  Form now uses grid layout for consistent spacing */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <NotchedInput
            name="title"
            label="Title (for admin)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <NotchedInput
            name="linkUrl"
            label="Link URL (e.g., /products)"
            value={form.linkUrl}
            onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
            required
          />
          <NotchedInput
            name="displayOrder"
            label="Display Order"
            type="number"
            value={form.displayOrder}
            onChange={(e) =>
              setForm({ ...form, displayOrder: Number(e.target.value) })
            }
          />
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Banner Image
            </label>
            <input
              type="file"
              name="image"
              onChange={(e) => setNewImage(e.target.files?.[0] || null)}
              accept="image/*"
              className="input-box"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="h-4 w-4"
            />
            Active
          </label>
          <button type="submit" className="btn-dark w-full rounded py-2 !mt-6">
            {initialData ? "Update Banner" : "Create Banner"}
          </button>
        </form>
      </div>
    </div>
  );
}
