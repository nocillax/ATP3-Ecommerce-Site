interface ProductCardProps {
  brand: string;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  image: string;
  isNew?: boolean;
}

const ProductCard = ({
  brand,
  title,
  subtitle,
  price,
  originalPrice,
  image,
  isNew = false,
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
