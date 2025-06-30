"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import NotchedInput from "@/components/ui/NotchedInput";
import { Category, CategoryForm } from "@/types";

interface ModalFormState {
  name: string;
  description: string;
  isFeatured: boolean;
}

interface ValidationErrors {
  name?: string;
  description?: string;
}

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Category;
  onSubmit: (data: CategoryForm) => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: CategoryModalProps) {
  const [form, setForm] = useState<ModalFormState>({
    name: "",
    description: "",
    isFeatured: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        isFeatured: initialData.isFeatured ?? false,
      });
    } else {
      setForm({ name: "", description: "", isFeatured: false });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    if (!form.name.trim()) newErrors.name = "Category name is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const dataToSend: CategoryForm = {
      name: form.name,
      description: form.description,
      isFeatured: form.isFeatured,
    };
    onSubmit(dataToSend);
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

        {/* ✅ Validation Summary Block */}
        {Object.keys(errors).length > 0 && (
          <div className="p-3 border border-red-300 bg-red-50 rounded-md text-sm mb-4">
            <ul className="list-disc list-inside text-red-600">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

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
