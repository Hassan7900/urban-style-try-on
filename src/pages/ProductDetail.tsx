import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Minus, Plus, Camera, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || "");
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Button variant="luxe" asChild>
            <Link to="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColor);
    }
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Shopping Zilla</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            {/* Back Link */}
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image */}
              <div className="relative">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-card shadow-card">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {product.tryOnCompatible && (
                  <Button
                    variant="glass"
                    className="absolute bottom-6 left-6"
                    asChild
                  >
                    <Link to={`/try-on?product=${product.id}`}>
                      <Camera className="h-4 w-4 mr-2" />
                      Try On
                    </Link>
                  </Button>
                )}
              </div>

              {/* Details */}
              <div className="space-y-8">
                <div>
                  <p className="text-primary text-sm uppercase tracking-widest mb-2">
                    {product.category}
                  </p>
                  <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                    {product.name}
                  </h1>
                <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary">
                      Rs. {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-muted-foreground line-through">
                        Rs. {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selection */}
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Size
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          "min-w-[48px] h-12 px-4 rounded-lg border text-sm font-medium transition-all",
                          selectedSize === size
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-secondary text-foreground hover:border-primary"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Color
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
                          selectedColor === color
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-secondary text-foreground hover:border-primary"
                        )}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Quantity
                  </h3>
                  <div className="inline-flex items-center gap-4 glass rounded-lg p-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium text-foreground">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    variant="hero"
                    size="xl"
                    className="flex-1"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="xl">
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetail;
