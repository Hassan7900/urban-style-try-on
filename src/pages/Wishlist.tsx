import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { products } from "@/data/products";

const Wishlist = () => {
  const { user } = useAuth();
  const { wishlistItems, toggleWishlist, isLoading } = useWishlist();
  const { addToCart } = useCart();

  const wishlistProducts = products.filter((product) =>
    wishlistItems.includes(product.id)
  );

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart(product, product.sizes?.[0] || "M", product.colors?.[0] || "Default");
  };

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Wishlist | URBAN WEAR</title>
          <meta name="description" content="Sign in to view and manage your wishlist of saved products." />
        </Helmet>
        <Header />
        <main className="min-h-screen pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-6" />
              <h1 className="text-3xl font-display font-bold mb-4">Your Wishlist</h1>
              <p className="text-muted-foreground mb-8 max-w-md">
                Sign in to save your favorite items and access them from any device.
              </p>
              <Button asChild size="lg">
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Wishlist | URBAN WEAR</title>
        <meta name="description" content="View and manage your saved products. Add items to cart or remove them from your wishlist." />
      </Helmet>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Your Wishlist
            </h1>
            <p className="text-muted-foreground">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {wishlistProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Heart className="h-16 w-16 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-display font-bold mb-4">
                Your wishlist is empty
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Start adding items you love by clicking the heart icon on any product.
              </p>
              <Button asChild size="lg">
                <Link to="/shop">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => toggleWishlist(product.id)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="p-4">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mb-3">
                      {product.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        ${product.price}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="gap-2"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Wishlist;
