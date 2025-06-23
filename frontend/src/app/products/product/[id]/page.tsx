"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import ProductCard from "@/components/ProductCard";

const thumbnails = [
  "/images/hero/hero1.jpg",
  "/images/hero/hero2.jpg",
  "/images/hero/hero1.jpg",
];

const recommended = [
  {
    brand: "AYRAH",
    title: "Signature Satin Hijab",
    subtitle: "- Platinum Haze -",
    price: 899,
    originalPrice: 1199,
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba886fe?auto=format&fit=crop&w=800&q=80",
  },
  {
    brand: "VELURÉ",
    title: "Premium Silk Hijab",
    subtitle: "- Mocha Dusk -",
    price: 1299,
    originalPrice: 1699,
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
  },
];

export default function ProductDetailsPage() {
  const product = {
    brand: "VELURÉ",
    title: "Chiffon Silk Hijab",
    subtitle: "ECLIPSE BLACK",
    price: 1599,
    originalPrice: 1999,
    description:
      "Light as air and rich in elegance, this deep black chiffon silk hijab offers an ethereal drape with a whisper of luxury in every fold.",
    image: "/images/hero/hero1.jpg",
    rating: 4.8,
    reviewsCount: 120,
  };

  const [mainImage, setMainImage] = useState(product.image);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("black");
  const [tab, setTab] = useState<"details" | "reviews">("details");

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Column */}
        <div>
          <div className="w-full h-[420px] bg-gray-100 rounded-md overflow-hidden shadow-soft mb-4">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {thumbnails.map((img, i) => (
              <button
                key={i}
                className={`w-[80px] h-[80px] rounded-md overflow-hidden border ${
                  img === mainImage ? "border-dark-gray" : "border-light-green"
                } shadow-soft`}
                onClick={() => setMainImage(img)}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-reem-kufi font-extrabold text-dark-gray mb-2">
              {product.brand}
            </h2>
            <h3 className="text-xl font-reem-kufi font-bold text-dark-gray mb-1">
              {product.title}
            </h3>
            <h4 className="text-base font-crimson font-bold text-dark-gray mb-4">
              {product.subtitle}
            </h4>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = product.rating >= star;
                const isHalf =
                  product.rating >= star - 0.5 && product.rating < star;
                return (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isFilled ? "#facc15" : isHalf ? "url(#half)" : "none"}
                    viewBox="0 0 24 24"
                    stroke="#facc15"
                    strokeWidth="1.5"
                    className="w-5 h-5"
                  >
                    {isHalf && (
                      <defs>
                        <linearGradient id="half">
                          <stop offset="50%" stopColor="#facc15" />
                          <stop offset="50%" stopColor="transparent" />
                        </linearGradient>
                      </defs>
                    )}
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    />
                  </svg>
                );
              })}
              <span className="text-sm font-montserrat text-dark-gray">
                {product.rating.toFixed(1)}{" "}
                <span className="text-dark-gray/60 font-normal">
                  ({product.reviewsCount} reviews)
                </span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <div className="flex items-baseline gap-1">
                <sup className="text-xs font-crimson text-dark-gray -top-1 relative">
                  BDT
                </sup>
                <span className="text-2xl font-semibold font-crimson text-dark-gray">
                  {product.price}
                </span>
              </div>
              <span className="text-base text-dark-gray/60 line-through font-crimson">
                {product.originalPrice}
              </span>
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <p className="text-sm font-reem-kufi font-bold mb-2">Color</p>
              <div className="flex gap-3">
                {["black", "mocha", "sage"].map((color) => (
                  <button
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === color
                        ? "border-dark-gray"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm font-montserrat text-dark-gray leading-relaxed mb-6">
              {product.description}
            </p>
          </div>

          {/* Quantity + Cart */}
          <div className="flex items-center gap-6">
            <div className="flex items-center border border-dark-gray rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <Minus className="w-4 h-4 text-dark-gray" />
              </button>
              <span className="px-4 text-sm font-bold text-dark-gray">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
              >
                <Plus className="w-4 h-4 text-dark-gray" />
              </button>
            </div>

            <button className="btn-dark px-6 py-2 rounded-md text-sm">
              ADD TO CART
            </button>
            <button className="btn-primary px-6 py-2 rounded-md text-sm">
              BUY NOW
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Details / Reviews */}
      <div className="mt-16 border-t pt-6">
        <div className="flex gap-6 mb-4">
          {["details", "reviews"].map((label) => (
            <button
              key={label}
              className={`text-sm font-bold uppercase font-reem-kufi ${
                tab === label
                  ? "text-dark-gray border-b-2 border-dark-gray"
                  : "text-dark-gray/50"
              }`}
              onClick={() => setTab(label as "details" | "reviews")}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "details" ? (
          <p className="text-sm font-montserrat text-dark-gray max-w-3xl">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
            voluptatem, tempora culpa, odio sequi ab cumque fugiat voluptas,
            nobis harum aspernatur modi deserunt hic.
          </p>
        ) : (
          <p className="text-sm font-montserrat text-dark-gray italic">
            No reviews yet.
          </p>
        )}
      </div>

      {/* You Might Also Like */}
      <div className="mt-20">
        <h3 className="text-xl font-playfair font-bold text-dark-gray mb-6">
          You Might Also Like
        </h3>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {recommended.map((prod, i) => (
            <ProductCard key={i} {...prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
