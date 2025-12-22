import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import CategoryShowcase from "@/components/CategoryShowcase";
import TryOnBanner from "@/components/TryOnBanner";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Shopping Zilla | Pakistan's Premium Fashion Store</title>
        <meta
          name="description"
          content="Shop at Shopping Zilla for premium fashion in Pakistan. Hoodies, jackets, sneakers & more. Free delivery on orders over Rs. 5000."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <FeaturedProducts />
          <CategoryShowcase />
          <TryOnBanner />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
