import Link from "next/link";

// The props now more closely match your API data structure
interface ProductCardProps {
  id: number;
  brand: string;
  name: string; // Was 'title'
  price: number;
  imageUrls: string[]; // Was 'image'
  isOnSale?: boolean;
  discountPercent?: number;
  rating?: number;
  reviewCount?: number; // Was 'reviewsCount'
}

export default function ProductCard({
  id,
  brand,
  name,
  price,
  imageUrls,
  isOnSale,
  discountPercent,
  rating,
  reviewCount,
}: ProductCardProps) {
  // Calculate the original price only if there is a sale
  const originalPrice =
    isOnSale && discountPercent
      ? Math.round(price / (1 - discountPercent / 100))
      : null;

  const imageUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL +
    (imageUrls?.[0] || "/placeholder.png");

  return (
    <Link href={`/products/${id}`} className="block group">
      <div className="w-[186px] bg-mint-light rounded-md border border-light-green shadow-category overflow-hidden hover:shadow-lg transition-shadow relative flex flex-col h-full">
        {/* ✅ NEW: Discount Badge */}
        {isOnSale && (discountPercent ?? 0) > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            {discountPercent}% Off
          </div>
        )}

        {/* Product Image */}
        <div className="w-full h-[197px] bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={`${brand} ${name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}

        <div className="p-3 flex flex-col flex-grow">
          <div className="flex-grow">
            {/* ✅ Brand name is now uppercase with a different font */}
            <h3 className="font-crimson text-xs font-bold text-dark-gray/60 mb-1 uppercase tracking-wider">
              {brand}
            </h3>
            {/* ✅ Title is now limited to 2 lines with an ellipsis (...) if it's too long */}
            <p
              title={name}
              className="font-quicksand text-base font-semibold text-dark-gray leading-tight line-clamp-2 h-[48px]"
            >
              {name}
            </p>
            {/* Rating Section */}
            <div className="flex items-center gap-1 mt-2 min-h-[16px]">
              {/* Star Mapping Logic - this part is correct */}
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (rating ?? 0) >= star;
                const isHalf =
                  (rating ?? 0) >= star - 0.5 && (rating ?? 0) < star;
                return (
                  <svg
                    key={star}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={isFilled ? "#facc15" : isHalf ? "url(#half)" : "none"}
                    viewBox="0 0 24 24"
                    stroke="#facc15"
                    strokeWidth="1.5"
                    className="w-3 h-3"
                  >
                    {isHalf && (
                      <defs>
                        <linearGradient id={`half-${id}`}>
                          {" "}
                          {/* Use a unique ID for the gradient */}
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

              {/* Review Count - this part is also correct */}
              {typeof reviewCount === "number" && (
                <span className="text-xs font-montserrat text-dark-gray ml-1">
                  ({reviewCount})
                </span>
              )}
            </div>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-2">
            <div className="flex items-baseline gap-1">
              <sup className="text-xs font-crimson text-dark-gray relative -top-1">
                $
              </sup>
              <span className="text-xl font-semibold font-crimson text-dark-gray">
                {price}
              </span>
            </div>
            {/* ✅ FIX: Only show original price if it exists (i.e., on sale) */}
            {originalPrice && (
              <span className="text-sm text-dark-gray line-through align-sub font-crimson">
                {originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
