// FILE: src/components/admin/CategoryModal.tsx
// ACTION: Replace the entire file with this robust version.

"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import NotchedInput from "@/components/ui/NotchedInput";
import { Category, CategoryForm } from "@/types"; // Import our official types

// 1. Define the shape of the data AS IT EXISTS inside the modal's state.
interface ModalFormState {
  name: string;
  description: string;
  isFeatured: boolean;
}

// 2. Update the props to be strongly-typed, using our official types.
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Category; // Use the Category type for incoming data
  onSubmit: (data: CategoryForm) => void; // Use the CategoryForm for submitted data
}

export default function CategoryModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: CategoryModalProps) {
  // 3. The form state is now based on our ModalFormState interface.
  const [form, setForm] = useState<ModalFormState>({
    name: "",
    description: "",
    isFeatured: false,
  });

  // 4. This useEffect correctly translates API data into form state.
  useEffect(() => {
    if (initialData) {
      // When editing, populate the form with existing data
      setForm({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        isFeatured: initialData.isFeatured ?? false,
      });
    } else {
      // When creating, reset to the default state
      setForm({ name: "", description: "", isFeatured: false });
    }
  }, [initialData, isOpen]);

  // This generic handler works for both text inputs and checkboxes.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 5. This handleSubmit now translates form state into the clean CategoryForm object.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create the clean data object that matches the CategoryForm contract.
    const dataToSend: CategoryForm = {
      name: form.name,
      description: form.description,
      isFeatured: form.isFeatured,
    };

    onSubmit(dataToSend); // Send the clean data up to the parent.
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white max-w-md w-full rounded-md p-6 relative shadow-lg">
        <button
          className="absolute top-4 right-4 p-1 rounded hover:bg-gray-200"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-bold mb-4 font-playfair text-dark-gray">
          {initialData ? "Edit Category" : "Add New Category"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <NotchedInput
            id="name"
            name="name"
            label="Category Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <NotchedInput
            id="description"
            name="description"
            label="Description"
            value={form.description}
            onChange={handleChange}
          />

          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="h-4 w-4"
            />
            <span>Featured Category</span>
          </label>

          <button
            type="submit"
            className="btn-dark px-6 py-2 rounded text-sm w-full !mt-6"
          >
            {initialData ? "Update Category" : "Create Category"}
          </button>
        </form>
      </div>
    </div>
  );
}
