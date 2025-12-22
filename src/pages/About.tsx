import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About | Urban Wear - Premium Streetwear</title>
        <meta
          name="description"
          content="Learn about Urban Wear's mission to redefine urban fashion with premium quality streetwear."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            {/* Hero */}
            <div className="max-w-4xl mx-auto text-center mb-20">
              <p className="text-primary text-sm uppercase tracking-widest mb-4">Our Story</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-8">
                Redefining <span className="text-gradient-gold">Urban Fashion</span>
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Born from the streets, crafted for those who dare to stand out. Urban Wear represents
                the fusion of luxury craftsmanship and authentic street culture.
              </p>
            </div>

            {/* Image */}
            <div className="relative rounded-xl overflow-hidden aspect-[21/9] mb-20">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=700&fit=crop"
                alt="Urban Wear Store"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent flex items-center">
                <div className="max-w-lg p-8 md:p-16">
                  <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Premium Quality
                  </h2>
                  <p className="text-muted-foreground">
                    Every piece is crafted using the finest materials, ensuring comfort, durability,
                    and timeless style.
                  </p>
                </div>
              </div>
            </div>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {[
                {
                  title: "Craftsmanship",
                  description:
                    "Every stitch tells a story. We work with master craftsmen to ensure exceptional quality.",
                },
                {
                  title: "Sustainability",
                  description:
                    "Committed to ethical production and sustainable materials for a better future.",
                },
                {
                  title: "Community",
                  description:
                    "More than a brand, we're a movement. Join our community of urban pioneers.",
                },
              ].map((value) => (
                <div key={value.title} className="glass rounded-xl p-8 text-center">
                  <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="glass rounded-xl p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: "2019", label: "Founded" },
                  { value: "50K+", label: "Customers" },
                  { value: "200+", label: "Products" },
                  { value: "15", label: "Countries" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-4xl font-bold text-primary mb-2">
                      {stat.value}
                    </p>
                    <p className="text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default About;
