import HeroSection from "@/components/HeroSection";
import Header from "@/components/Header";
import FeaturedCategories from "@/components/FeaturedCategories";
import OffersSection from "@/components/OffersSection";
import BestSellers from "@/components/BestSellers";
import NewArrivals from "@/components/NewArrivals";
import CollectionShowcase from "@/components/CollectionShowcase";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-mint-light">
      <Header />
      <main>
        <HeroSection />
        <FeaturedCategories />
        <OffersSection />
        <BestSellers />
        <NewArrivals />
        <CollectionShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
