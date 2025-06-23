interface ProductCardProps {
  brand: string;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  image: string;
  isNew?: boolean;
  rating?: number;
  reviewsCount?: number;
}

const ProductCard = ({
  brand,
  title,
  subtitle,
  price,
  originalPrice,
  image,
  isNew = false,
  rating,
  reviewsCount,
}: ProductCardProps) => {
  return (
    <div className="w-[186px] bg-mint-light rounded-md border border-light-green shadow-category overflow-hidden group hover:shadow-lg transition-shadow">
      {/* Product Image */}
      <div className="w-full h-[197px] bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={`${brand} ${title}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-3">
        <div className="mb-3">
          <h3 className="font-crimson text-base font-semibold text-dark-gray mb-1">
            {brand}
          </h3>
          <p className="font-crimson text-base font-semibold text-dark-gray leading-tight">
            {title}
          </p>
          {subtitle && (
            <p className="font-crimson text-sm text-dark-gray">{subtitle}</p>
          )}
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = rating >= star;
              const isHalf = rating >= star - 0.5 && rating < star;
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

            {/* Review Count */}
            {typeof reviewsCount === "number" && (
              <span className="text-xs font-montserrat text-dark-gray ml-1 mt-1">
                ({reviewsCount})
              </span>
            )}
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-baseline gap-2">
          <div className="flex items-baseline gap-1">
            <sup className="text-xs font-crimson text-dark-gray relative -top-1">
              BDT
            </sup>
            <span className="text-xl font-semibold font-crimson text-dark-gray">
              {price}
            </span>
          </div>
          {originalPrice && (
            <span className="text-sm text-dark-gray line-through align-sub font-crimson">
              {originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
