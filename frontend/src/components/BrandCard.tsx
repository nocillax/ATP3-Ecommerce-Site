import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface BrandCardProps {
  name: string;
  subtitle?: string;
  image: string;
  slug: string;
}

const BrandCard = ({ name, subtitle, image, slug }: BrandCardProps) => {
  return (
    <div className="bg-mint-light rounded-md border border-light-green shadow-soft overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-[300px] bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 text-center">
        <h3 className="font-reem-kufi text-2xl font-bold text-dark-gray mb-1">
          {name}
        </h3>
        {subtitle && (
          <h4 className="font-quicksand text-base font-semibold text-dark-gray mb-4">
            {subtitle}
          </h4>
        )}
        <Link href={`/brands/${slug}`}>
          <button className="border border-dark-gray text-dark-gray px-4 py-2 rounded hover:bg-dark-gray hover:text-white transition text-sm font-reem-kufi font-bold">
            SEE PRODUCTS
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BrandCard;
