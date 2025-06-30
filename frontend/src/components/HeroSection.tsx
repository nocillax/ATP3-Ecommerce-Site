// FILE: src/components/HeroSection.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import Link from "next/link"; // Import Link for the button
import { HeroImage } from "@/types"; // You'll need to add this type

export default function HeroSection() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [current, setCurrent] = useState(0);

  // Fetch the active hero images from your new API endpoint
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await api.get("/hero-images");
        setImages(response.data);
      } catch (error) {
        console.error("Failed to fetch hero images:", error);
      }
    };
    fetchHeroImages();
  }, []);

  const handlePrev = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const handleNext = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  if (images.length === 0) {
    // Don't render anything if there are no images to show
    return null;
  }

  // Get the current image object
  const currentImage = images[current];

  return (
    <section className="w-full max-w-7xl mx-auto px-4">
      <div className="relative h-[250px] md:h-[350px] rounded-md overflow-hidden shadow-soft">
        {/* Image Layer: We now map and stack all images */}
        {images.map((image, index) => (
          <div
            key={image.id}
            className={`
            absolute inset-0 bg-cover bg-center transition-opacity duration-700 ease-in-out
            ${index === current ? "opacity-100" : "opacity-0"}
          `}
            style={{
              backgroundImage: `url('${process.env.NEXT_PUBLIC_API_BASE_URL}${image.imageUrl}')`,
            }}
          />
        ))}

        {/* Overlay Layer: Sits on top of the images */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Content Layer: The button and arrows, with a z-index to stay on top */}
        <div className="relative z-10 h-full flex items-end pb-6 px-6">
          <Link href={currentImage.linkUrl || "/products"}>
            <div className="btn-primary px-6 py-3 rounded-md text-sm">
              SHOP NOW
            </div>
          </Link>
        </div>

        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 ..."
        >
          <ChevronLeft className="w-4 h-6 text-mint-light" strokeWidth={1.75} />
        </button>

        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 ..."
        >
          <ChevronRight
            className="w-4 h-6 text-mint-light"
            strokeWidth={1.75}
          />
        </button>
      </div>
    </section>
  );
}
