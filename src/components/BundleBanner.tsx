import { useState } from "react";
import { motion } from "framer-motion";
import { Package, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import BundleBuilder from "./BundleBuilder";

const BundleBanner = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 border border-primary/20">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 p-8 lg:p-12">
              {/* Left content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Limited Time Offer</span>
                </div>

                <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground mb-4">
                  Build Your Bundle
                  <br />
                  <span className="text-primary">Save 20%</span>
                </h2>

                <p className="text-muted-foreground text-lg mb-6 max-w-md">
                  Mix and match your favorites! Select any 3 items and unlock an exclusive 20% discount on your entire bundle.
                </p>

                <Button
                  size="lg"
                  onClick={() => setIsOpen(true)}
                  className="group text-lg px-8"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Start Building
                  <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>

              {/* Right visual */}
              <div className="flex-1 flex justify-center">
                <div className="relative">
                  {/* Stacked product cards mockup */}
                  <motion.div
                    initial={{ rotate: -6, x: -20 }}
                    whileInView={{ rotate: -6, x: -20 }}
                    className="absolute w-32 h-40 bg-card rounded-xl shadow-xl border border-border overflow-hidden"
                  >
                    <div className="w-full h-full bg-gradient-to-br from-secondary to-muted" />
                  </motion.div>
                  <motion.div
                    initial={{ rotate: 0, x: 0 }}
                    whileInView={{ rotate: 0, x: 0 }}
                    className="absolute w-32 h-40 bg-card rounded-xl shadow-xl border border-border overflow-hidden"
                    style={{ top: 10, left: 30 }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-secondary to-muted" />
                  </motion.div>
                  <motion.div
                    initial={{ rotate: 6, x: 20 }}
                    whileInView={{ rotate: 6, x: 20 }}
                    className="relative w-32 h-40 bg-card rounded-xl shadow-xl border border-primary/50 overflow-hidden"
                    style={{ top: 20, left: 60 }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-primary">3</div>
                        <div className="text-xs text-muted-foreground">Items</div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Discount badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute -top-4 -right-4 bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">20%</div>
                      <div className="text-[10px]">OFF</div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <BundleBuilder isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default BundleBanner;
