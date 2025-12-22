import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const collections = [
  {
    id: "essentials",
    name: "The Essentials",
    description: "Timeless basics crafted from premium materials",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&h=800&fit=crop",
    itemCount: 24,
  },
  {
    id: "noir",
    name: "Noir Collection",
    description: "All-black everything. Sophistication in its purest form.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&h=800&fit=crop",
    itemCount: 18,
  },
  {
    id: "street-luxe",
    name: "Street Luxe",
    description: "Where streetwear meets high fashion",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1200&h=800&fit=crop",
    itemCount: 32,
  },
];

const Collections = () => {
  return (
    <>
      <Helmet>
        <title>Collections | Urban Wear Premium Streetwear</title>
        <meta
          name="description"
          content="Explore Urban Wear's curated collections. From timeless essentials to limited edition drops."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-16">
              <p className="text-primary text-sm uppercase tracking-widest mb-2">Curated</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
                Collections
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Explore our carefully curated collections, each telling its own story of urban sophistication.
              </p>
            </div>

            {/* Collections */}
            <div className="space-y-24">
              {collections.map((collection, index) => (
                <div
                  key={collection.id}
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="relative overflow-hidden rounded-xl aspect-[4/3] group">
                      <img
                        src={collection.image}
                        alt={collection.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                  <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                    <p className="text-primary text-sm uppercase tracking-widest mb-4">
                      {collection.itemCount} Items
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                      {collection.name}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                      {collection.description}
                    </p>
                    <Button variant="hero" size="lg" asChild>
                      <Link to="/shop">
                        Explore Collection
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Collections;
