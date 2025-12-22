import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();

  if (items.length === 0) {
    return (
      <>
        <Helmet>
          <title>Cart | Shopping Zilla</title>
        </Helmet>

        <div className="min-h-screen bg-background">
          <Header />
          <main className="pt-32 pb-20">
            <div className="container mx-auto px-4">
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-secondary flex items-center justify-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                </div>
                <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                  Your Cart is Empty
                </h1>
                <p className="text-muted-foreground mb-8">
                  Looks like you haven't added anything yet.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/shop">Start Shopping</Link>
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Cart (${items.length}) | Shopping Zilla`}</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Your Cart
              </h1>
              <Button variant="ghost" onClick={clearCart} className="text-muted-foreground">
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                    className="glass rounded-xl p-6 flex gap-6"
                  >
                    <div className="w-24 h-32 rounded-lg overflow-hidden shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Size: {item.selectedSize} · Color: {item.selectedColor}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3 glass rounded-lg p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-sm font-medium text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="text-lg font-semibold text-primary">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="glass rounded-xl p-8 sticky top-28">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-8">
                    Order Summary
                  </h2>
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>Rs. {totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span>{totalPrice >= 5000 ? "Free" : "Rs. 250"}</span>
                    </div>
                    <div className="border-t border-border pt-4 flex justify-between text-lg font-semibold text-foreground">
                      <span>Total</span>
                      <span className="text-primary">
                        Rs. {(totalPrice >= 5000 ? totalPrice : totalPrice + 250).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {user ? (
                    <Button variant="hero" size="lg" className="w-full">
                      Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <Button variant="hero" size="lg" className="w-full" asChild>
                        <Link to="/auth">
                          Sign in to Checkout
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                      <p className="text-center text-sm text-muted-foreground">
                        or{" "}
                        <Link to="/auth" className="text-primary hover:underline">
                          create an account
                        </Link>
                      </p>
                    </div>
                  )}

                  <p className="text-center text-xs text-muted-foreground mt-6">
                    Free delivery on orders over Rs. 5,000
                  </p>
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

export default Cart;
