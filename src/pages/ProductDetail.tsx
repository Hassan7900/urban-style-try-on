import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, Minus, Plus, Camera, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <title>{product.name} | Urban Wear</title>
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

                {/* Product Details Tabs */}
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="size-guide">Size Guide</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="mt-6">
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {product.description}
                    </p>
                  </TabsContent>
                  <TabsContent value="size-guide" className="mt-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                          Size Chart
                        </h4>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse border border-border">
                            <thead>
                              <tr className="bg-muted">
                                <th className="border border-border px-4 py-2 text-left font-medium">Size</th>
                                <th className="border border-border px-4 py-2 text-left font-medium">Chest (inches)</th>
                                <th className="border border-border px-4 py-2 text-left font-medium">Waist (inches)</th>
                                <th className="border border-border px-4 py-2 text-left font-medium">Length (inches)</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="border border-border px-4 py-2 font-medium">S</td>
                                <td className="border border-border px-4 py-2">36-38</td>
                                <td className="border border-border px-4 py-2">28-30</td>
                                <td className="border border-border px-4 py-2">27</td>
                              </tr>
                              <tr className="bg-muted/50">
                                <td className="border border-border px-4 py-2 font-medium">M</td>
                                <td className="border border-border px-4 py-2">38-40</td>
                                <td className="border border-border px-4 py-2">30-32</td>
                                <td className="border border-border px-4 py-2">28</td>
                              </tr>
                              <tr>
                                <td className="border border-border px-4 py-2 font-medium">L</td>
                                <td className="border border-border px-4 py-2">40-42</td>
                                <td className="border border-border px-4 py-2">32-34</td>
                                <td className="border border-border px-4 py-2">29</td>
                              </tr>
                              <tr className="bg-muted/50">
                                <td className="border border-border px-4 py-2 font-medium">XL</td>
                                <td className="border border-border px-4 py-2">42-44</td>
                                <td className="border border-border px-4 py-2">34-36</td>
                                <td className="border border-border px-4 py-2">30</td>
                              </tr>
                              <tr>
                                <td className="border border-border px-4 py-2 font-medium">XXL</td>
                                <td className="border border-border px-4 py-2">44-46</td>
                                <td className="border border-border px-4 py-2">36-38</td>
                                <td className="border border-border px-4 py-2">31</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-display text-lg font-semibold text-foreground mb-4">
                          How to Measure
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <h5 className="font-medium text-foreground">Chest</h5>
                            <p className="text-sm text-muted-foreground">
                              Measure around the fullest part of your chest, keeping the tape horizontal.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-medium text-foreground">Waist</h5>
                            <p className="text-sm text-muted-foreground">
                              Measure around your natural waistline, which is usually just above the belly button.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-medium text-foreground">Length</h5>
                            <p className="text-sm text-muted-foreground">
                              Measure from the highest point of the shoulder to the bottom of the garment.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <h5 className="font-medium text-foreground">Tips</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Take measurements while wearing form-fitting clothing</li>
                              <li>• Use a flexible measuring tape</li>
                              <li>• If between sizes, size up for comfort</li>
                              <li>• Our sizes are based on Pakistani standards</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

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
