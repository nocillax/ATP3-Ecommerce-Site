"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Brand, BrandForm } from "@/types";
import NotchedInput from "@/components/ui/NotchedInput";
import NotchedTextarea from "@/components/ui/NotchedTextarea";

interface ModalFormState {
  name: string;
  description: string;
  imageUrl: string;
  newImage: File | null;
}

interface ValidationErrors {
  name?: string;
  description?: string;
  newImage?: string;
}

interface BrandModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Brand;
  onSubmit: (data: BrandForm) => void;
}

export default function BrandModal({
  isOpen,
  onClose,
  initialData,
  onSubmit,
}: BrandModalProps) {
  const [form, setForm] = useState<ModalFormState>({
    name: "",
    description: "",
    imageUrl: "",
    newImage: null,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        imageUrl: initialData.imageUrl ?? "",
        newImage: null,
      });
    } else {
      setForm({
        name: "",
        description: "",
        imageUrl: "",
        newImage: null,
      });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (e.target.type === "file" && "files" in e.target) {
      const files = (e.target as HTMLInputElement).files;
      setForm((prev) => ({ ...prev, newImage: files?.[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: "", newImage: null }));
  };

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};
    if (!form.name.trim()) newErrors.name = "Brand name is required.";
    if (!form.description.trim())
      newErrors.description = "Description is required.";
    if (!form.imageUrl && !form.newImage)
      newErrors.newImage = "Logo image is required.";
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
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white max-w-md w-full rounded-md p-6 relative shadow-lg">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>
        <h2 className="text-lg font-bold mb-4">
          {initialData ? "Edit Brand" : "Add Brand"}
        </h2>

        {/*  Validation Summary Block */}
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
            name="name"
            label="Brand Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <NotchedTextarea
            id="description"
            name="description"
            label="Description"
            rows={3}
            value={form.description ?? ""}
            onChange={handleChange}
          />

          <div className="space-y-2">
            <label className="text-sm font-bold">Logo</label>
            {form.imageUrl && !form.newImage && (
              <div className="relative w-24 h-24">
                <img
                  src={form.imageUrl}
                  alt="Current logo"
                  className="h-full w-full object-contain rounded"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white"
                >
                  <X size={12} />
                </button>
              </div>
            )}
            <input
              type="file"
              name="newImage"
              onChange={handleChange}
              accept="image/*"
            />
          </div>

          <button type="submit" className="btn-dark w-full">
            {initialData ? "Update Brand" : "Create Brand"}
          </button>
        </form>
      </div>
    </div>
  );
}
