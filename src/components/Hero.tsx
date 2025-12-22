import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
      
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 animate-fade-up">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">New Collection 2024</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <span className="text-foreground">Pakistan's</span>
            <br />
            <span className="text-gradient-gold">Fashion Hub</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "200ms" }}>
            Premium quality fashion at unbeatable prices. 
            From Karachi to Peshawar, we deliver style to your doorstep.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "300ms" }}>
            <Button variant="hero" size="xl" asChild>
              <Link to="/shop">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="luxe" size="xl" asChild>
              <Link to="/try-on">
                Virtual Try-On
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-20 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: "400ms" }}>
            {[
              { value: "50K+", label: "Happy Customers" },
              { value: "200+", label: "Products" },
              { value: "100+", label: "Cities Served" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-pulse">
        <span className="text-xs text-muted-foreground uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-primary to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
