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
        <title>Urban Wear | Premium Streetwear & Luxury Urban Fashion</title>
        <meta
          name="description"
          content="Shop Urban Wear for premium streetwear and luxury urban fashion. Hoodies, jackets, sneakers & more. Free shipping on orders over $150."
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
