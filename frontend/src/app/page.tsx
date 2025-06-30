import HeroSection from "@/components/HeroSection";
import FeaturedCategories from "@/components/FeaturedCategories";
import OffersSection from "@/components/OffersSection";
import BestSellers from "@/components/BestSellers";
import NewArrivals from "@/components/NewArrivals";
import BrandShowcase from "@/components/BrandShowcase";
import FeaturedProducts from "@/components/FeaturedProducts";

const Index = () => {
  return (
    <div className="min-h-screen bg-mint-light">
      <main>
        <HeroSection />
        <FeaturedCategories />
        <BestSellers />
        <NewArrivals />
        <FeaturedProducts />
        <BrandShowcase />
      </main>
    </div>
  );
};

export default Index;
