import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, isLoading } = useWishlist();

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${index * 100}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-card shadow-card transition-all duration-500 group-hover:shadow-hover">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-700",
              isHovered && "scale-110"
            )}
          />
          
          {/* Overlay */}
          <div
            className={cn(
              "absolute inset-0 bg-background/60 flex items-center justify-center gap-4 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <Button
              variant="glass"
              size="icon"
              onClick={handleQuickAdd}
              className="rounded-full"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
            <Button
              variant="glass"
              size="icon"
              onClick={handleWishlistToggle}
              disabled={isLoading}
              className={cn(
                "rounded-full",
                inWishlist && "bg-primary/20 text-primary"
              )}
            >
              <Heart
                className={cn("h-5 w-5", inWishlist && "fill-primary")}
              />
            </Button>
            <Button variant="glass" size="icon" className="rounded-full">
              <Eye className="h-5 w-5" />
            </Button>
          </div>

          {/* Sale Badge */}
          {product.originalPrice && (
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              SALE
            </div>
          )}

          {/* Try-On Badge */}
          {product.tryOnCompatible && (
            <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-xs font-medium text-foreground">
              Try-On
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
            {product.category}
          </p>
          <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-primary">
              Rs. {product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
