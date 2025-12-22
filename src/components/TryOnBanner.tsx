import { Link } from "react-router-dom";
import { Camera, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const TryOnBanner = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="glass rounded-2xl p-8 md:p-16">
          <div className="max-w-3xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-8">
              <Camera className="h-8 w-8 text-primary" />
            </div>

            {/* Content */}
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Virtual Try-On <span className="text-gradient-gold">Experience</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              See how our pieces look on you before you buy. Use your webcam to virtually try on any item from our collection.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {[
                "Real-time AR overlay",
                "Multiple angles",
                "Save & share looks",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {feature}
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button variant="hero" size="xl" asChild>
              <Link to="/try-on">
                Start Virtual Try-On
                <Camera className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TryOnBanner;
