import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, Check, ShoppingCart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product";
import { products } from "@/data/products";
import { cn } from "@/lib/utils";

const BUNDLE_SIZE = 3;
const BUNDLE_DISCOUNT = 0.2; // 20% off

interface BundleBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

const BundleBuilder = ({ isOpen, onClose }: BundleBuilderProps) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  const progress = (selectedProducts.length / BUNDLE_SIZE) * 100;
  const isComplete = selectedProducts.length >= BUNDLE_SIZE;

  const originalTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const discountedTotal = isComplete ? originalTotal * (1 - BUNDLE_DISCOUNT) : originalTotal;
  const savings = originalTotal - discountedTotal;

  const toggleProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= BUNDLE_SIZE) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const addBundleToCart = () => {
    selectedProducts.forEach((product) => {
      addToCart(product, product.sizes[0], product.colors[0]);
    });
    setSelectedProducts([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-xl">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Build Your Bundle
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Buy {BUNDLE_SIZE}, get {BUNDLE_DISCOUNT * 100}% off!
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {selectedProducts.length} of {BUNDLE_SIZE} items selected
                </span>
                {isComplete && (
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-primary font-medium flex items-center gap-1"
                  >
                    <Sparkles className="h-4 w-4" /> Discount unlocked!
                  </motion.span>
                )}
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(0, 12).map((product) => {
                const isSelected = selectedProducts.some((p) => p.id === product.id);
                const isDisabled = !isSelected && selectedProducts.length >= BUNDLE_SIZE;

                return (
                  <motion.button
                    key={product.id}
                    onClick={() => toggleProduct(product)}
                    disabled={isDisabled}
                    whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                    whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                    className={cn(
                      "relative group rounded-xl overflow-hidden border-2 transition-all text-left",
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50",
                      isDisabled && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {/* Selection Badge */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground rounded-full p-1"
                      >
                        <Check className="h-4 w-4" />
                      </motion.div>
                    )}

                    {/* Image */}
                    <div className="aspect-square bg-secondary">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3 bg-card">
                      <h3 className="font-medium text-foreground text-sm line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-primary font-bold">
                        Rs {product.price.toLocaleString()}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer with Price Summary */}
          <div className="p-6 border-t border-border bg-secondary/50">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                {selectedProducts.length > 0 ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      {isComplete && (
                        <span className="text-muted-foreground line-through text-lg">
                          Rs {originalTotal.toLocaleString()}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-foreground">
                        Rs {discountedTotal.toLocaleString()}
                      </span>
                    </div>
                    {isComplete && (
                      <motion.p
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-primary font-medium"
                      >
                        You save Rs {savings.toLocaleString()}!
                      </motion.p>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Select {BUNDLE_SIZE} items to unlock 20% off</p>
                )}
              </div>

              <Button
                size="lg"
                disabled={!isComplete}
                onClick={addBundleToCart}
                className="w-full sm:w-auto min-w-[200px]"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {isComplete ? "Add Bundle to Cart" : `Select ${BUNDLE_SIZE - selectedProducts.length} more`}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BundleBuilder;
