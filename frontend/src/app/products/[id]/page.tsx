// "use client";

// import { useState } from "react";
// import { Minus, Plus } from "lucide-react";
// import ProductCard from "@/components/ProductCard";

// const thumbnails = [
//   "/images/hero/hero1.jpg",
//   "/images/hero/hero2.jpg",
//   "/images/hero/hero1.jpg",
// ];

// const recommended = [
//   {
//     brand: "AYRAH",
//     title: "Signature Satin Hijab",
//     subtitle: "- Platinum Haze -",
//     price: 899,
//     originalPrice: 1199,
//     image:
//       "https://images.unsplash.com/photo-1594736797933-d0401ba886fe?auto=format&fit=crop&w=800&q=80",
//   },
//   {
//     brand: "VELURÉ",
//     title: "Premium Silk Hijab",
//     subtitle: "- Mocha Dusk -",
//     price: 1299,
//     originalPrice: 1699,
//     image:
//       "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
//   },
// ];

// export default function ProductDetailsPage() {
//   const product = {
//     brand: "VELURÉ",
//     title: "Chiffon Silk Hijab",
//     subtitle: "ECLIPSE BLACK",
//     price: 1599,
//     originalPrice: 1999,
//     description:
//       "Light as air and rich in elegance, this deep black chiffon silk hijab offers an ethereal drape with a whisper of luxury in every fold.",
//     image: "/images/hero/hero1.jpg",
//     rating: 4.8,
//     reviewsCount: 120,
//   };

//   const [mainImage, setMainImage] = useState(product.image);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedColor, setSelectedColor] = useState("black");
//   const [tab, setTab] = useState<"details" | "reviews">("details");

//   return (
//     <section className="max-w-7xl mx-auto px-4 py-10">
//       {/* Top Section */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
//         {/* Image Column */}
//         <div>
//           <div className="w-full h-[420px] bg-gray-100 rounded-md overflow-hidden shadow-soft mb-4">
//             <img
//               src={mainImage}
//               alt={product.title}
//               className="w-full h-full object-cover"
//             />
//           </div>
//           <div className="flex gap-2">
//             {thumbnails.map((img, i) => (
//               <button
//                 key={i}
//                 className={`w-[80px] h-[80px] rounded-md overflow-hidden border ${
//                   img === mainImage ? "border-dark-gray" : "border-light-green"
//                 } shadow-soft`}
//                 onClick={() => setMainImage(img)}
//               >
//                 <img src={img} alt="" className="w-full h-full object-cover" />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Info Column */}
//         <div className="flex flex-col justify-between">
//           <div>
//             <h2 className="text-2xl font-reem-kufi font-extrabold text-dark-gray mb-2">
//               {product.brand}
//             </h2>
//             <h3 className="text-xl font-reem-kufi font-bold text-dark-gray mb-1">
//               {product.title}
//             </h3>
//             <h4 className="text-base font-crimson font-bold text-dark-gray mb-4">
//               {product.subtitle}
//             </h4>

//             {/* Rating */}
//             <div className="flex items-center gap-2 mb-4">
//               {[1, 2, 3, 4, 5].map((star) => {
//                 const isFilled = product.rating >= star;
//                 const isHalf =
//                   product.rating >= star - 0.5 && product.rating < star;
//                 return (
//                   <svg
//                     key={star}
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill={isFilled ? "#facc15" : isHalf ? "url(#half)" : "none"}
//                     viewBox="0 0 24 24"
//                     stroke="#facc15"
//                     strokeWidth="1.5"
//                     className="w-5 h-5"
//                   >
//                     {isHalf && (
//                       <defs>
//                         <linearGradient id="half">
//                           <stop offset="50%" stopColor="#facc15" />
//                           <stop offset="50%" stopColor="transparent" />
//                         </linearGradient>
//                       </defs>
//                     )}
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
//                     />
//                   </svg>
//                 );
//               })}
//               <span className="text-sm font-montserrat text-dark-gray">
//                 {product.rating.toFixed(1)}{" "}
//                 <span className="text-dark-gray/60 font-normal">
//                   ({product.reviewsCount} reviews)
//                 </span>
//               </span>
//             </div>

//             {/* Price */}
//             <div className="flex items-baseline gap-3 mb-4">
//               <div className="flex items-baseline gap-1">
//                 <sup className="text-xs font-crimson text-dark-gray -top-1 relative">
//                   BDT
//                 </sup>
//                 <span className="text-2xl font-semibold font-crimson text-dark-gray">
//                   {product.price}
//                 </span>
//               </div>
//               <span className="text-base text-dark-gray/60 line-through font-crimson">
//                 {product.originalPrice}
//               </span>
//             </div>

//             {/* Color Selector */}
//             <div className="mb-6">
//               <p className="text-sm font-reem-kufi font-bold mb-2">Color</p>
//               <div className="flex gap-3">
//                 {["black", "mocha", "sage"].map((color) => (
//                   <button
//                     key={color}
//                     className={`w-8 h-8 rounded-full border-2 ${
//                       selectedColor === color
//                         ? "border-dark-gray"
//                         : "border-transparent"
//                     }`}
//                     style={{ backgroundColor: color }}
//                     onClick={() => setSelectedColor(color)}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Description */}
//             <p className="text-sm font-montserrat text-dark-gray leading-relaxed mb-6">
//               {product.description}
//             </p>
//           </div>

//           {/* Quantity + Cart */}
//           <div className="flex items-center gap-6">
//             <div className="flex items-center border border-dark-gray rounded-full overflow-hidden">
//               <button
//                 onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                 className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
//               >
//                 <Minus className="w-4 h-4 text-dark-gray" />
//               </button>
//               <span className="px-4 text-sm font-bold text-dark-gray">
//                 {quantity}
//               </span>
//               <button
//                 onClick={() => setQuantity((q) => q + 1)}
//                 className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition"
//               >
//                 <Plus className="w-4 h-4 text-dark-gray" />
//               </button>
//             </div>

//             <button className="btn-dark px-6 py-2 rounded-md text-sm">
//               ADD TO CART
//             </button>
//             <button className="btn-primary px-6 py-2 rounded-md text-sm">
//               BUY NOW
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Tabs: Details / Reviews */}
//       <div className="mt-16 border-t pt-6">
//         <div className="flex gap-6 mb-4">
//           {["details", "reviews"].map((label) => (
//             <button
//               key={label}
//               className={`text-sm font-bold uppercase font-reem-kufi ${
//                 tab === label
//                   ? "text-dark-gray border-b-2 border-dark-gray"
//                   : "text-dark-gray/50"
//               }`}
//               onClick={() => setTab(label as "details" | "reviews")}
//             >
//               {label}
//             </button>
//           ))}
//         </div>
//         {tab === "details" ? (
//           <p className="text-sm font-montserrat text-dark-gray max-w-3xl">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
//             voluptatem, tempora culpa, odio sequi ab cumque fugiat voluptas,
//             nobis harum aspernatur modi deserunt hic.
//           </p>
//         ) : (
//           <p className="text-sm font-montserrat text-dark-gray italic">
//             No reviews yet.
//           </p>
//         )}
//       </div>

//       {/* You Might Also Like */}
//       <div className="mt-20">
//         <h3 className="text-xl font-playfair font-bold text-dark-gray mb-6">
//           You Might Also Like
//         </h3>
//         <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
//           {recommended.map((prod, i) => (
//             <ProductCard key={i} {...prod} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// FILE: src/app/products/[id]/page.tsx
// FILE: src/app/products/[id]/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ReviewCard from "@/components/ReviewCard";
import api from "@/lib/api";
import { Product, ProductVariant, Review } from "@/types";

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<"details" | "reviews">("details");

  const pathname = usePathname();
  const id = pathname.split("/").pop();

  // Fetch all data on component load
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        const fetchedProduct = response.data;

        setProduct(fetchedProduct);

        // Set initial state
        const firstVariant = fetchedProduct.variants?.[0] || null;
        setSelectedVariant(null);
        // Set initial main image from the variant if it exists, otherwise fall back to main product image
        /* setMainImage(
          firstVariant?.imageUrls?.[0] || fetchedProduct.imageUrls?.[0] || ""
        ); */
        setMainImage(fetchedProduct.imageUrls?.[0] || "");
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch related products when the main product is loaded
  useEffect(() => {
    if (!product?.categories?.length) return;
    const fetchRelatedProducts = async () => {
      try {
        const categoryName = product.categories[0].name;
        const response = await api.get(
          `/products?category=${categoryName}&limit=5`
        );
        setRelatedProducts(
          response.data.data.filter((p: Product) => p.id !== product.id)
        );
      } catch (error) {
        console.error("Failed to fetch related products:", error);
      }
    };
    fetchRelatedProducts();
  }, [product]);

  // Update the main image whenever the selected variant changes
  useEffect(() => {
    if (selectedVariant?.imageUrls?.length) {
      setMainImage(selectedVariant.imageUrls[0]);
    }
  }, [selectedVariant]);

  // ✅ Re-introduce this to create one long list of all unique images.
  const allThumbnails = useMemo(() => {
    if (!product) return [];
    const mainImages = product.imageUrls ?? [];
    const variantImages = product.variants.flatMap((v) => v.imageUrls ?? []);
    // Using a Set removes any duplicate images
    return [...new Set([...mainImages, ...variantImages])];
  }, [product]);

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (!product)
    return <div className="text-center py-20">Product not found.</div>;

  // ✅ NEW: Dynamically determine which thumbnails to show
  // If a variant is selected and has images, show them. Otherwise, show the main product images.
  const thumbnailsToShow = selectedVariant?.imageUrls?.length
    ? selectedVariant.imageUrls
    : product.imageUrls;

  const displayPrice = selectedVariant?.priceOverride ?? product.price;
  const originalPrice =
    product.isOnSale && product.discountPercent > 0
      ? Math.round(displayPrice / (1 - (product.discountPercent ?? 0) / 100))
      : null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Column */}
        <div>
          <div className="w-full h-[420px] bg-gray-100 rounded-md overflow-hidden shadow-soft mb-4">
            <img
              src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${mainImage}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* ✅ The gallery now maps over the complete 'allThumbnails' list. */}
          <div className="flex gap-2">
            {allThumbnails.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`w-[80px] h-[80px] rounded-md overflow-hidden border-2 transition ${
                  img === mainImage ? "border-dark-gray" : "border-transparent"
                }`}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${img}`}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="flex flex-col">
          <div>
            {/* ✅ Restored your original fonts and layout */}
            <h2 className="text-2xl font-reem-kufi font-extrabold text-dark-gray mb-2">
              {product.brand.name}
            </h2>
            <h3 className="text-xl font-quicksand font-bold text-dark-gray mb-1">
              {product.name}
            </h3>
            <h4 className="text-base font-montserrat font-base text-dark-gray mb-4">
              {product.subtitle}
            </h4>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (product.rating ?? 0) >= star;
                const isHalf =
                  (product.rating ?? 0) >= star - 0.5 &&
                  (product.rating ?? 0) < star;
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
                {Number(product.rating).toFixed(1)}{" "}
                <span className="text-dark-gray/60 font-normal">
                  ({product.reviewCount} reviews)
                </span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <div className="flex items-baseline gap-1">
                <sup className="text-sm font-crimson text-dark-gray -top-1 relative">
                  $
                </sup>
                <span className="text-2xl font-semibold font-crimson text-dark-gray">
                  {displayPrice}
                </span>
              </div>
              {originalPrice && (
                <span className="text-base text-dark-gray/60 line-through font-crimson">
                  {originalPrice}
                </span>
              )}
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <p className="text-sm font-reem-kufi font-bold mb-2">Color</p>
              <div className="flex gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedVariant?.id === variant.id
                        ? "border-dark-gray"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: variant.color.toLowerCase() }}
                    title={variant.color}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ✅ Restored your Quantity, Add to Cart, and Buy Now buttons */}
          <div className="flex items-center gap-6 mt-auto pt-6 border-t">
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

      {/* ✅ Restored your Details / Reviews tab section */}
      <div className="mt-16 border-t pt-6">
        <div className="flex gap-6 mb-4">
          {["details", "reviews"].map((label) => (
            <button
              key={label}
              onClick={() => setTab(label as "details" | "reviews")}
              className={`text-sm font-bold uppercase font-reem-kufi ${
                tab === label
                  ? "text-dark-gray border-b-2 border-dark-gray"
                  : "text-dark-gray/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "details" ? (
          <p className="text-sm font-montserrat text-dark-gray max-w-3xl leading-relaxed">
            {product.description}
          </p>
        ) : (
          <div>
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            ) : (
              <p className="text-sm font-montserrat text-dark-gray italic">
                No reviews yet.
              </p>
            )}
          </div>
        )}
      </div>

      {/* "You Might Also Like" Section */}
      <div className="mt-20">
        <h3 className="text-xl font-playfair font-bold text-dark-gray mb-6">
          You Might Also Like
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-8">
          {/* ✅ FIX: This now correctly maps over the `relatedProducts` state */}
          {relatedProducts.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              name={p.name}
              brand={p.brand.name}
              price={p.price}
              imageUrls={p.imageUrls}
              isOnSale={p.isOnSale}
              discountPercent={p.discountPercent}
              rating={p.rating}
              reviewCount={p.reviewCount}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
