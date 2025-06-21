"use client";

import {
  User,
  Droplets,
  Sparkles,
  Scissors,
  GraduationCap,
  ShoppingBag,
} from "lucide-react";

const categories = [
  { name: "MODEST\nCLOTHING", icon: User },
  { name: "FRAGRANCE", icon: Droplets },
  { name: "SKINCARE", icon: Sparkles },
  { name: "HAIRCARE", icon: Scissors },
  { name: "KID'S\nCOLLECTION", icon: GraduationCap },
  { name: "ACCESSORIES", icon: ShoppingBag },
];

const FeaturedCategories = () => {
  return (
    <section className="w-full px-4 md:px-6 mt-12 mb-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-playfair font-extrabold text-xl text-dark-gray mb-6">
          Featured Categories
        </h2>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
          {categories.map(({ name, icon: Icon }, i) => (
            <div
              key={i}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-[90px] h-[110px] bg-brown-light border border-brown rounded-md shadow-category flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Icon className="w-12 h-12 text-brown" strokeWidth={1.5} />
              </div>
              <p className="text-[11px] font-reem-kufi text-brown text-center whitespace-pre-line">
                {name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
