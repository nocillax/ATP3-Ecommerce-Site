"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Product, ProductForm, Category, Brand } from "@/types";
import MultiSelect from "@/components/admin/MultiSelect";
import NotchedInput from "@/components/ui/NotchedInput";
import { read } from "fs";
import NotchedSelect from "@/components/ui/NotchedSelect";
import NotchedTextarea from "@/components/ui/NotchedTextarea";

// This interface describes the shape of the form's state, using strings for inputs.
interface ModalFormState {
  name: string;
  subtitle: string;
  brandId: string;
  categoryIds: string[];
  price: string;
  cost: string;
  discount: string;
  isActive: boolean;
  isOnSale: boolean;
  isFeatured: boolean;
  description: string;
  imageUrls: string[];
  newImages: File[];
  variants: Array<{
    id?: number;
    color: string;
    stock: string; // Stored as a string
    priceOverride?: string;
    imageUrls?: string[];
    newImages: File[];
  }>;
}

interface ProductModalProps {
  mode: "create" | "edit" | "view";
  isOpen: boolean;
  onClose: () => void;
  initialData?: Product | null;
  onSubmit?: (data: ProductForm) => void;
  brands: Brand[];
  categories: Category[];
}

/* ─────────────────────────────────────── */
export default function ProductModal({
  mode,
  isOpen,
  onClose,
  initialData,
  onSubmit,
  brands = [],
  categories = [],
}: ProductModalProps) {
  /* ─────────────── State ─────────────── */
  // Define the empty state based on our new interface
  const emptyState: ModalFormState = {
    name: "",
    subtitle: "",
    brandId: "",
    categoryIds: [],
    price: "",
    cost: "",
    discount: "",
    isActive: false,
    isOnSale: false,
    isFeatured: false,
    description: "",
    imageUrls: [],
    newImages: [],
    variants: [],
  };
  const [form, setForm] = useState<ModalFormState>(emptyState);

  /* ─────────── Populate on edit/view ─────────── */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // TRANSLATION (IN): Numbers from API -> Strings for Form
  useEffect(() => {
    if (isOpen && initialData) {
      // This translates numbers from the API into strings for the form state
      setForm({
        name: initialData.name ?? "",
        subtitle: initialData.subtitle ?? "",
        brandId: String(initialData.brand?.id ?? ""),
        categoryIds: initialData.categories?.map((c) => String(c.id)) ?? [],
        price: String(initialData.price ?? ""),
        cost: String(initialData.cost ?? ""),
        discount: String(initialData.discountPercent ?? ""), // Map API's discountPercent to form's discount
        isActive: initialData.isActive ?? false,
        isOnSale: initialData.isOnSale ?? false,
        isFeatured: initialData.isFeatured ?? false,
        description: initialData.description ?? "",
        imageUrls: initialData.imageUrls ?? [],
        newImages: [],
        variants:
          initialData.variants?.map((v) => ({
            id: v.id,
            color: v.color,
            stock: String(v.stock),
            priceOverride: String(v.priceOverride ?? ""),
            imageUrls: v.imageUrls ?? [],
            newImages: [],
          })) ?? [],
      });
    } else if (!isOpen) {
      setForm(emptyState);
    }
  }, [isOpen, initialData]);
  /* ─────────── Helpers ─────────── */
  const readOnly = mode === "view";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, type } = e.target as any;
    if (type === "checkbox") {
      setForm((p) => ({
        ...p,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "file") {
      const files = Array.from((e.target as HTMLInputElement).files ?? []);
      setForm((p) => ({ ...p, newImages: files }));
    } else if ((e.target as HTMLSelectElement).multiple) {
      const selected = Array.from((e.target as HTMLSelectElement).options)
        .filter((o) => o.selected)
        .map((o) => o.value);
      setForm((p) => ({ ...p, [name]: selected }));
    } else {
      setForm((p) => ({ ...p, [name]: e.target.value }));
    }
  };

  const handleVariantChange = (
    idx: number,
    field: keyof ModalFormState["variants"][0],
    value: string | File[]
  ) => {
    const copy = [...form.variants];
    (copy[idx] as any)[field] = value;
    setForm({ ...form, variants: copy });
  };

  const handleAddVariant = () => {
    setForm({
      ...form,
      variants: [
        ...form.variants,
        // ✅ FIX #3 & #4: Default values must be strings to match the state type
        { color: "", stock: "0", priceOverride: "", newImages: [] },
      ],
    });
  };

  const handleRemoveVariant = (indexToRemove: number) => {
    setForm({
      ...form,
      variants: form.variants.filter((_, index) => index !== indexToRemove),
    });
  };

  const handleRemoveExistingImage = (urlToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((url) => url !== urlToRemove),
    }));
  };

  /* ─────────── Early escape ─────────── */
  if (!isOpen) return null;

  /* ─────────── JSX ─────────── */
  return (
    <div className="fixed inset-0 z-50 grid place-items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="relative w-full max-w-4xl rounded-md bg-white p-6 shadow-lg">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded p-1 hover:bg-gray-200"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="mb-4 text-lg font-bold">
          {mode === "create"
            ? "Add New Product"
            : mode === "edit"
            ? "Edit Product"
            : "Product Details"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!onSubmit) return;

            // ✅ FINAL FIX: TRANSLATION (OUT): Strings from Form -> Numbers for API
            const dataToSend: ProductForm = {
              name: form.name,
              subtitle: form.subtitle,
              description: form.description,
              isActive: form.isActive,
              isOnSale: form.isOnSale,
              isFeatured: form.isFeatured,
              brandId: Number(form.brandId),
              categoryIds: form.categoryIds.map(Number),
              price: parseFloat(form.price) || 0,
              cost: parseFloat(form.cost) || 0,
              discountPercent: parseFloat(form.discount) || 0, // Map form's discount to API's discountPercent
              newImages: form.newImages,
              imageUrls: form.imageUrls,
              variants: form.variants.map((v) => ({
                id: v.id,
                color: v.color,
                stock: Number(v.stock) || 0,
                priceOverride: v.priceOverride
                  ? parseFloat(v.priceOverride)
                  : undefined,
                newImages: v.newImages,
                imageUrls: v.imageUrls,
              })),
            };

            onSubmit(dataToSend);
            if (mode !== "view") onClose();
          }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          {/* ---------- Basic Info ---------- */}

          <NotchedInput
            name="name"
            value={form.name}
            onChange={handleChange}
            label="Product Name"
            placeholder="Product Name"
            disabled={readOnly}
          />

          <NotchedInput
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            label="Subtitle"
            placeholder="Subtitle"
            disabled={readOnly}
          />

          {/* Brand */}
          {readOnly ? (
            <div>
              <NotchedInput
                name="brandId"
                value={
                  brands.find((b) => String(b.id) === String(form.brandId))
                    ?.name || "—"
                }
                label="Brand"
                placeholder="Brand"
                disabled={true}
              />
            </div>
          ) : (
            <NotchedSelect
              name="brandId"
              value={form.brandId}
              onChange={handleChange}
              label="Brand"
              options={[
                { value: "", label: "Select Brand" },
                ...brands.map((b) => ({
                  value: String(b.id),
                  label: b.name,
                })),
              ]}
            />
          )}

          {/* Categories (multi) */}
          <div className="md:col-span-2">
            <MultiSelect
              label="Categories"
              placeholder="Select categories..."
              disabled={readOnly}
              options={categories.map((c) => ({
                value: String(c.id),
                label: c.name,
              }))}
              selectedValues={form.categoryIds}
              onChange={(selected) => {
                setForm((prev) => ({ ...prev, categoryIds: selected }));
              }}
            />
          </div>

          {/* Pricing */}
          <NotchedInput
            label="Price"
            type="number"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            disabled={readOnly}
          />

          <NotchedInput
            label="Cost"
            type="number"
            step="0.01"
            name="cost"
            value={form.cost}
            onChange={handleChange}
            placeholder="Cost"
            disabled={readOnly}
          />

          <NotchedInput
            label="Discount %"
            type="number"
            step="0.01"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount %"
            disabled={readOnly}
          />

          {/* Toggles */}
          <div className="md:col-span-2 flex items-center gap-x-6 gap-y-2 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                disabled={readOnly}
                className="h-4 w-4"
              />
              Active
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                disabled={readOnly}
                className="h-4 w-4"
              />
              Featured
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isOnSale"
                checked={form.isOnSale}
                onChange={handleChange}
                disabled={readOnly}
                className="h-4 w-4"
              />
              On Sale
            </label>
          </div>

          {/* Description */}
          <NotchedTextarea
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="md:col-span-2"
            rows={3}
            disabled={readOnly}
          />

          {/* ---------- Images ---------- */}
          <div className="md:col-span-2">
            <h3 className="mb-2 font-semibold">Product Images</h3>

            {/* Existing previews */}
            {form.imageUrls.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {form.imageUrls.map((url) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt="Existing product"
                      className="h-16 w-16 rounded object-cover"
                    />
                    {/* ✅ This button only appears when not in 'view' mode */}
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(url)}
                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!readOnly && (
              <input
                type="file"
                multiple
                onChange={handleChange}
                name="newImages"
              />
            )}
          </div>

          {/* ---------- Variants ---------- */}
          <div className="md:col-span-2">
            <h3 className="mb-2 font-semibold">Variants</h3>

            {form.variants.map((v, idx) => (
              <div
                key={v.id ?? `new-${idx}`}
                className="mb-4 rounded border p-3 md:flex md:items-center md:gap-4"
              >
                {v.imageUrls && v.imageUrls.length > 0 && (
                  <div className="relative h-10 w-10">
                    <img
                      src={v.imageUrls[0]}
                      alt="Variant"
                      className="h-10 w-10 rounded object-cover"
                    />
                    {!readOnly && (
                      <button
                        type="button"
                        // When clicked, we set this variant's imageUrls to an empty array
                        onClick={() =>
                          handleVariantChange(idx, "imageUrls", [])
                        }
                        className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}

                <NotchedInput
                  label="Color"
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) =>
                    handleVariantChange(idx, "color", e.target.value)
                  }
                  disabled={readOnly}
                />
                <NotchedInput
                  label="Stock"
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  // ✅ FIX #2: Assign the string value directly to the string state
                  onChange={(e) =>
                    handleVariantChange(idx, "stock", e.target.value)
                  }
                  disabled={readOnly}
                />
                <NotchedInput
                  label="Price Override"
                  type="number"
                  placeholder="Price Override"
                  value={v.priceOverride ?? ""}
                  onChange={(e) =>
                    handleVariantChange(idx, "priceOverride", e.target.value)
                  }
                  disabled={readOnly}
                />

                {!readOnly && (
                  <NotchedInput
                    label="Upload Image"
                    type="file"
                    onChange={(e) =>
                      handleVariantChange(
                        idx,
                        "newImages",
                        Array.from(e.target.files ?? [])
                      )
                    }
                  />
                )}

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(idx)}
                    className="ml-auto text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {/* Add variant */}
            {!readOnly && (
              <button
                type="button"
                onClick={handleAddVariant}
                className="btn-dark mt-2 px-4 py-1 text-xs"
              >
                + Add Variant
              </button>
            )}
          </div>

          {/* ---------- Submit ---------- */}
          {mode !== "view" && (
            <button
              type="submit"
              className="btn-dark col-span-1 mt-2 rounded py-2 md:col-span-2"
            >
              {mode === "create" ? "Create Product" : "Update Product"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
