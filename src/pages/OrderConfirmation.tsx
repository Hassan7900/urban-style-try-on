import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Truck, Package, Clock, MapPin, CreditCard } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [orderNumber] = useState(`URB-${Date.now().toString().slice(-6)}`);

  // Mock order details - in a real app, this would come from context/state
  const orderDetails = {
    orderNumber,
    estimatedDelivery: "Dec 35, 2025",
    items: [
      { name: "Urban Hoodie", quantity: 1, price: 2850, image: "/api/placeholder/80/80" },
      { name: "Premium T-Shirt", quantity: 2, price: 1950, image: "/api/placeholder/80/80" }
    ],
    subtotal: 6750,
    delivery: 250,
    total: 7000,
    shippingAddress: {
      name: "Ahmed Khan",
      address: "123 Main Street, Gulberg",
      city: "Lahore, Pakistan",
      phone: "+92 300 1234567"
    },
    paymentMethod: "Cash on Delivery"
  };

  useEffect(() => {
    // Auto-redirect to shipping tracking after 5 seconds
    const timer = setTimeout(() => {
      navigate('/shipping');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Order Confirmed | Urban Wear</title>
        <meta name="description" content="Your order has been confirmed! Track your Urban Wear order in real-time." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Success Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Order Confirmed!
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-6">
                  Thank you for shopping with Urban Wear! Your order has been successfully placed and is being processed.
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 inline-block">
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="text-2xl font-bold text-primary">{orderDetails.orderNumber}</p>
                </div>
              </div>

              {/* Order Status */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Order Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Order Placed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-blue-500" />
                        <span className="text-muted-foreground">Processing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Truck className="h-5 w-5 text-gray-400" />
                        <span className="text-muted-foreground">Shipped</span>
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">
                      Processing
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Estimated Delivery: <span className="font-medium text-foreground">{orderDetails.estimatedDelivery}</span>
                  </p>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {orderDetails.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-foreground">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}

                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>Rs. {orderDetails.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery</span>
                        <span>Rs. {orderDetails.delivery.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">Rs. {orderDetails.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping & Payment */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Address
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{orderDetails.shippingAddress.name}</p>
                        <p className="text-muted-foreground">{orderDetails.shippingAddress.address}</p>
                        <p className="text-muted-foreground">{orderDetails.shippingAddress.city}</p>
                        <p className="text-muted-foreground">{orderDetails.shippingAddress.phone}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Method
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium text-foreground">{orderDetails.paymentMethod}</p>
                      <p className="text-sm text-muted-foreground">
                        You will pay when your order is delivered to your doorstep.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* What's Next */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                        <Package className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Order Processing</h3>
                      <p className="text-sm text-muted-foreground">
                        We're preparing your items for shipment. This usually takes 1-2 business days.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-3">
                        <Truck className="h-6 w-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Shipping</h3>
                      <p className="text-sm text-muted-foreground">
                        Once shipped, you'll receive tracking information via SMS and email.
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">Delivery</h3>
                      <p className="text-sm text-muted-foreground">
                        Your order will be delivered to your doorstep. Pay only when you receive it.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  You will be redirected to order tracking in <span className="font-medium text-foreground">5 seconds</span>...
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg" asChild>
                    <a href="/shipping">
                      Track Your Order
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <a href="/shop">
                      Continue Shopping
                    </a>
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

export default OrderConfirmation;