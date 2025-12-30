import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Truck, Package, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";

interface ShippingOrder {
  id: string;
  orderNumber: string;
  status: 'processing' | 'shipped' | 'out-for-delivery' | 'delivered';
  estimatedDelivery: string;
  trackingNumber: string;
  items: {
    name: string;
    quantity: number;
    image: string;
  }[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    phone: string;
  };
  progress: number;
}

const Shipping = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Demo shipping data
  const shippingOrders: ShippingOrder[] = [
    {
      id: "1",
      orderNumber: "URB-2025-001",
      status: "processing",
      estimatedDelivery: "Jan 05, 2026",
      trackingNumber: "TRK123456789",
      progress: 25,
      items: [
        { name: "Urban Hoodie", quantity: 1, image: "/api/placeholder/80/80" },
        { name: "Cargo Pants", quantity: 1, image: "/api/placeholder/80/80" }
      ],
      shippingAddress: {
        name: "Ahmed Khan",
        address: "123 Main Street, Gulberg",
        city: "Lahore, Pakistan",
        phone: "+92 300 1234567"
      }
    },
    {
      id: "2",
      orderNumber: "URB-2025-002",
      status: "shipped",
      estimatedDelivery: "jan 02, 2026",
      trackingNumber: "TRK987654321",
      progress: 60,
      items: [
        { name: "Premium T-Shirt", quantity: 2, image: "/api/placeholder/80/80" }
      ],
      shippingAddress: {
        name: "Sara Ahmed",
        address: "456 Park Avenue, DHA",
        city: "Karachi, Pakistan",
        phone: "+92 301 7654321"
      }
    },
    {
      id: "3",
      orderNumber: "URB-2025-003",
      status: "out-for-delivery",
      estimatedDelivery: "Dec 31, 2025",
      trackingNumber: "TRK456789123",
      progress: 85,
      items: [
        { name: "Urban Jacket", quantity: 1, image: "/api/placeholder/80/80" },
        { name: "Denim Jeans", quantity: 1, image: "/api/placeholder/80/80" },
        { name: "Sneakers", quantity: 1, image: "/api/placeholder/80/80" }
      ],
      shippingAddress: {
        name: "Muhammad Ali",
        address: "789 Commercial Area, Phase 5",
        city: "Islamabad, Pakistan",
        phone: "+92 302 1122334"
      }
    },
    {
      id: "4",
      orderNumber: "URB-2025-004",
      status: "delivered",
      estimatedDelivery: "Dec 28, 2025",
      trackingNumber: "TRK321654987",
      progress: 100,
      items: [
        { name: "Casual Shirt", quantity: 1, image: "/api/placeholder/80/80" }
      ],
      shippingAddress: {
        name: "Fatima Bibi",
        address: "321 Residential Street, Cantt",
        city: "Rawalpindi, Pakistan",
        phone: "+92 303 4455667"
      }
    },
    {
      id: "5",
      orderNumber: "URB-2025-005",
      status: "shipped",
      estimatedDelivery: "Jan 2, 2026",
      trackingNumber: "TRK654987321",
      progress: 45,
      items: [
        { name: "Winter Hoodie", quantity: 1, image: "/api/placeholder/80/80" },
        { name: "Track Pants", quantity: 1, image: "/api/placeholder/80/80" }
      ],
      shippingAddress: {
        name: "Hassan Raza",
        address: "654 Business District, Mall Road",
        city: "Peshawar, Pakistan",
        phone: "+92 304 7788990"
      }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'shipped':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'out-for-delivery':
        return <Truck className="h-5 w-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'out-for-delivery':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <>
      <Helmet>
        <title>Shipping & Tracking | Urban Wear</title>
        <meta name="description" content="Track your Urban Wear orders in real-time. Get shipping updates and delivery information." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Shipping & Tracking
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Track your orders in real-time and get updates on delivery status across Pakistan.
                </p>
              </div>

              {/* Shipping Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Package className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{shippingOrders.filter(o => o.status === 'processing').length}</div>
                    <p className="text-sm text-muted-foreground">Processing</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{shippingOrders.filter(o => o.status === 'shipped' || o.status === 'out-for-delivery').length}</div>
                    <p className="text-sm text-muted-foreground">In Transit</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <MapPin className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{shippingOrders.filter(o => o.status === 'out-for-delivery').length}</div>
                    <p className="text-sm text-muted-foreground">Out for Delivery</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{shippingOrders.filter(o => o.status === 'delivered').length}</div>
                    <p className="text-sm text-muted-foreground">Delivered</p>
                  </CardContent>
                </Card>
              </div>

              {/* Shipping Orders */}
              <div className="space-y-6">
                {shippingOrders.map((order) => (
                  <Card key={order.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <CardTitle className="text-lg">Order {order.orderNumber}</CardTitle>
                            <p className="text-sm text-muted-foreground">Tracking: {order.trackingNumber}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(order.status)}>
                            {formatStatus(order.status)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          >
                            {selectedOrder === order.id ? 'Hide Details' : 'View Details'}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">{order.progress}%</span>
                        </div>
                        <Progress value={order.progress} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Estimated Delivery: {order.estimatedDelivery}
                        </p>
                      </div>

                      {/* Order Details (Collapsible) */}
                      {selectedOrder === order.id && (
                        <div className="border-t pt-6 space-y-6">
                          {/* Items */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-4">Items</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                  />
                                  <div>
                                    <p className="font-medium text-foreground">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-4">Shipping Address</h4>
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <p className="font-medium text-foreground">{order.shippingAddress.name}</p>
                              <p className="text-sm text-muted-foreground">{order.shippingAddress.address}</p>
                              <p className="text-sm text-muted-foreground">{order.shippingAddress.city}</p>
                              <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
                            </div>
                          </div>

                          {/* Tracking Timeline */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-4">Tracking Updates</h4>
                            <div className="space-y-4">
                              <div className="flex items-start gap-4">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                <div>
                                  <p className="font-medium text-foreground">Order Confirmed</p>
                                  <p className="text-sm text-muted-foreground">Dec 25, 2025 - 10:30 AM</p>
                                </div>
                              </div>
                              {order.status !== 'processing' && (
                                <div className="flex items-start gap-4">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-foreground">Order Shipped</p>
                                    <p className="text-sm text-muted-foreground">Dec 26, 2025 - 2:15 PM</p>
                                  </div>
                                </div>
                              )}
                              {order.status === 'out-for-delivery' && (
                                <div className="flex items-start gap-4">
                                  <Truck className="h-5 w-5 text-orange-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-foreground">Out for Delivery</p>
                                    <p className="text-sm text-muted-foreground">Dec 30, 2025 - 9:45 AM</p>
                                  </div>
                                </div>
                              )}
                              {order.status === 'delivered' && (
                                <div className="flex items-start gap-4">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-foreground">Delivered</p>
                                    <p className="text-sm text-muted-foreground">Dec 28, 2025 - 4:20 PM</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Help Section */}
              <div className="mt-16 text-center bg-card rounded-xl p-8 shadow-card">
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Need Help with Your Order?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Our customer service team is here to help with any shipping or delivery questions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg">
                    Contact Support
                  </Button>
                  <Button variant="outline" size="lg">
                    Shipping FAQ
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

export default Shipping;