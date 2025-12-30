import { Helmet } from "react-helmet-async";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, Package, CheckCircle, XCircle, Clock, AlertTriangle } from "lucide-react";

interface ReturnRequest {
  id: string;
  orderNumber: string;
  status: 'pending' | 'approved' | 'received' | 'refunded' | 'rejected';
  requestDate: string;
  reason: string;
  items: {
    name: string;
    quantity: number;
    image: string;
    price: number;
  }[];
  refundAmount: number;
  progress: number;
}

const Returns = () => {
  const [selectedReturn, setSelectedReturn] = useState<string | null>(null);

  // Demo return requests
  const returnRequests: ReturnRequest[] = [
    {
      id: "1",
      orderNumber: "URB-2025-001",
      status: "pending",
      requestDate: "Dec 28, 2025",
      reason: "Wrong size received",
      progress: 20,
      refundAmount: 2850,
      items: [
        { name: "Urban Hoodie", quantity: 1, image: "/api/placeholder/80/80", price: 2850 }
      ]
    },
    {
      id: "2",
      orderNumber: "URB-2025-002",
      status: "approved",
      requestDate: "Dec 26, 2025",
      reason: "Item damaged during shipping",
      progress: 50,
      refundAmount: 1950,
      items: [
        { name: "Premium T-Shirt", quantity: 1, image: "/api/placeholder/80/80", price: 1950 }
      ]
    },
    {
      id: "3",
      orderNumber: "URB-2025-003",
      status: "received",
      requestDate: "Dec 24, 2025",
      reason: "Not satisfied with quality",
      progress: 75,
      refundAmount: 4200,
      items: [
        { name: "Urban Jacket", quantity: 1, image: "/api/placeholder/80/80", price: 4200 },
        { name: "Denim Jeans", quantity: 1, image: "/api/placeholder/80/80", price: 3200 }
      ]
    },
    {
      id: "4",
      orderNumber: "URB-2025-004",
      status: "refunded",
      requestDate: "Dec 20, 2025",
      reason: "Changed mind",
      progress: 100,
      refundAmount: 1650,
      items: [
        { name: "Casual Shirt", quantity: 1, image: "/api/placeholder/80/80", price: 1650 }
      ]
    },
    {
      id: "5",
      orderNumber: "URB-2025-005",
      status: "rejected",
      requestDate: "Dec 22, 2025",
      reason: "Item used/worn",
      progress: 100,
      refundAmount: 0,
      items: [
        { name: "Winter Hoodie", quantity: 1, image: "/api/placeholder/80/80", price: 2850 }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'received':
        return <Package className="h-5 w-5 text-purple-500" />;
      case 'refunded':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-purple-100 text-purple-800';
      case 'refunded':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
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
        <title>Returns & Refunds | Urban Wear</title>
        <meta name="description" content="Manage your returns and refunds with Urban Wear. Track return status and get help with your orders." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Returns & Refunds
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Track your return requests and manage refunds for your Urban Wear orders.
                </p>
              </div>

              {/* Returns Overview */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{returnRequests.filter(r => r.status === 'pending').length}</div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{returnRequests.filter(r => r.status === 'approved').length}</div>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Package className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{returnRequests.filter(r => r.status === 'received').length}</div>
                    <p className="text-sm text-muted-foreground">Received</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{returnRequests.filter(r => r.status === 'refunded').length}</div>
                    <p className="text-sm text-muted-foreground">Refunded</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-foreground">{returnRequests.filter(r => r.status === 'rejected').length}</div>
                    <p className="text-sm text-muted-foreground">Rejected</p>
                  </CardContent>
                </Card>
              </div>

              {/* Return Policy Info */}
              <div className="bg-card rounded-xl p-8 shadow-card mb-12">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Return Policy
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Return Window</h3>
                      <p className="text-muted-foreground text-sm">
                        You can return items within 30 days of delivery for a full refund.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Return Conditions</h3>
                      <ul className="text-muted-foreground text-sm space-y-1">
                        <li>• Items must be unused and in original packaging</li>
                        <li>• Tags and labels must be attached</li>
                        <li>• Original receipt or order number required</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Non-Returnable Items</h3>
                      <ul className="text-muted-foreground text-sm space-y-1">
                        <li>• Personalized or custom items</li>
                        <li>• Intimate apparel and swimwear</li>
                        <li>• Items damaged due to misuse</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Refund Process</h3>
                      <p className="text-muted-foreground text-sm">
                        Refunds are processed within 5-7 business days after receiving your return.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Requests */}
              <div className="space-y-6">
                {returnRequests.map((returnRequest) => (
                  <Card key={returnRequest.id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(returnRequest.status)}
                          <div>
                            <CardTitle className="text-lg">Return for Order {returnRequest.orderNumber}</CardTitle>
                            <p className="text-sm text-muted-foreground">Requested on {returnRequest.requestDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={getStatusColor(returnRequest.status)}>
                            {formatStatus(returnRequest.status)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReturn(selectedReturn === returnRequest.id ? null : returnRequest.id)}
                          >
                            {selectedReturn === returnRequest.id ? 'Hide Details' : 'View Details'}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm text-muted-foreground">{returnRequest.progress}%</span>
                        </div>
                        <Progress value={returnRequest.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Return Requested</span>
                          <span>Approved</span>
                          <span>Received</span>
                          <span>Refunded</span>
                        </div>
                      </div>

                      {/* Return Details (Collapsible) */}
                      {selectedReturn === returnRequest.id && (
                        <div className="border-t pt-6 space-y-6">
                          {/* Reason */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">Return Reason</h4>
                            <p className="text-muted-foreground">{returnRequest.reason}</p>
                          </div>

                          {/* Items */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-4">Items Being Returned</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {returnRequest.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded-md"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-foreground">{item.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    <p className="text-sm font-medium text-primary">Rs. {item.price.toLocaleString()}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Refund Info */}
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-foreground">Refund Amount</span>
                              <span className="text-lg font-bold text-primary">
                                Rs. {returnRequest.refundAmount.toLocaleString()}
                              </span>
                            </div>
                            {returnRequest.status === 'refunded' && (
                              <p className="text-sm text-green-600 mt-2">
                                ✅ Refund has been processed to your original payment method
                              </p>
                            )}
                            {returnRequest.status === 'rejected' && (
                              <p className="text-sm text-red-600 mt-2">
                                ❌ Return request was rejected. Item does not meet return conditions.
                              </p>
                            )}
                          </div>

                          {/* Return Timeline */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-4">Return Timeline</h4>
                            <div className="space-y-4">
                              <div className="flex items-start gap-4">
                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                <div>
                                  <p className="font-medium text-foreground">Return Request Submitted</p>
                                  <p className="text-sm text-muted-foreground">{returnRequest.requestDate}</p>
                                </div>
                              </div>
                              {returnRequest.status !== 'pending' && returnRequest.status !== 'rejected' && (
                                <div className="flex items-start gap-4">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-foreground">Return Approved</p>
                                    <p className="text-sm text-muted-foreground">Return label sent via email</p>
                                  </div>
                                </div>
                              )}
                              {(returnRequest.status === 'received' || returnRequest.status === 'refunded') && (
                                <div className="flex items-start gap-4">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-foreground">Return Received</p>
                                    <p className="text-sm text-muted-foreground">Item received at warehouse for inspection</p>
                                  </div>
                                </div>
                              )}
                              {returnRequest.status === 'refunded' && (
                                <div className="flex items-start gap-4">
                                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-foreground">Refund Processed</p>
                                    <p className="text-sm text-muted-foreground">Refund credited to your account</p>
                                  </div>
                                </div>
                              )}
                              {returnRequest.status === 'rejected' && (
                                <div className="flex items-start gap-4">
                                  <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                  <div>
                                    <p className="font-medium text-foreground">Return Rejected</p>
                                    <p className="text-sm text-muted-foreground">Item does not meet return policy conditions</p>
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

              {/* Start Return Process */}
              <div className="mt-16 text-center bg-card rounded-xl p-8 shadow-card">
                <RotateCcw className="h-16 w-16 text-primary mx-auto mb-6" />
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Need to Return an Item?
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Start your return process easily. We'll guide you through each step and provide a prepaid return label.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button variant="hero" size="lg">
                    Start Return Process
                  </Button>
                  <Button variant="outline" size="lg">
                    Return Policy
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

export default Returns;