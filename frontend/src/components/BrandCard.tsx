import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface BrandCardProps {
  name: string;
  subtitle?: string;
  image: string;
  slug: string;
}

export default function BrandCard({
  name,
  subtitle,
  image,
  slug,
}: BrandCardProps) {
  return (
    <Link href={`/products?brand=${slug}`} className="block group">
      <div className="relative rounded-md overflow-hidden shadow-soft">
        <img
          src={image}
          alt={`Collection of ${name}`}
          className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white font-reem-kufi font-bold text-xl">
            {name}
          </h3>
          <p className="text-white/80 font-montserrat text-sm">{subtitle}</p>
        </div>
      </div>
    </Link>
  );
}
