import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import PaymentMethodSelector from "@/components/PaymentMethodSelector";
import { PAYMENT_GATEWAYS, PaymentGateway } from "@/config/paymentConfig";
import { processPayment } from "@/utils/paymentProcessing";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Form validation schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().optional(),
  walletNumber: z.string().min(10, "Enter wallet number").optional(),
  // Stripe card fields (conditional)
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<PaymentGateway | "">("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderNumber] = useState(`URB-${Date.now().toString().slice(-6)}`);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      walletNumber: "",
    },
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
    if (!user) {
      navigate("/auth");
    }
  }, [items, user, navigate]);

  const deliveryFee = totalPrice >= 5000 ? 0 : 250;
  const finalTotal = totalPrice + deliveryFee;

  const onSubmit = async (data: CheckoutFormData) => {
    if (!selectedPayment) {
      toast.error("Please select a payment method");
      return;
    }

    if (
      (selectedPayment === PAYMENT_GATEWAYS.JAZZ_CASH ||
        selectedPayment === PAYMENT_GATEWAYS.EASYPAISA) &&
      !data.walletNumber
    ) {
      toast.error("Please enter your wallet number");
      return;
    }

    setIsProcessing(true);
    try {
      const orderDetails = {
        orderNumber,
        customerName: data.fullName,
        customerEmail: data.email,
        customerPhone: data.phone,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
        items,
        subtotal: totalPrice,
        deliveryFee,
        total: finalTotal,
        expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      };

      let paymentData: any = {};

      switch (selectedPayment) {
        case PAYMENT_GATEWAYS.COD:
          paymentData = {};
          break;
        case PAYMENT_GATEWAYS.STRIPE:
        case PAYMENT_GATEWAYS.VISA:
          // In production, use Stripe.js or stripe-react
          paymentData = {
            token: "tok_visa", // Mock token - replace with actual Stripe token
          };
          break;
        case PAYMENT_GATEWAYS.GOOGLE_PAY:
          paymentData = {
            token: "mock_google_pay_token", // Mock token
          };
          break;
        case PAYMENT_GATEWAYS.JAZZ_CASH:
          paymentData = {
            phoneNumber: data.walletNumber || data.phone,
          };
          break;
        case PAYMENT_GATEWAYS.EASYPAISA:
          paymentData = {
            phoneNumber: data.walletNumber || data.phone,
          };
          break;
      }

      const result = await processPayment(
        selectedPayment,
        paymentData,
        finalTotal,
        orderDetails
      ) as { success?: boolean; status?: string };

      if (result.success || result.status === "pending" || result.status === "mocked") {
        toast.success("Order placed successfully!");
        clearCart();
        
        // Store order details in localStorage for confirmation page
        localStorage.setItem(
          "lastOrder",
          JSON.stringify({
            ...orderDetails,
            paymentMethod: selectedPayment,
            paymentStatus: result.status,
          })
        );

        navigate("/order-confirmation");
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        error instanceof Error ? error.message : "An error occurred during checkout"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Checkout | Urban Wear</title>
        <meta name="description" content="Complete your Urban Wear purchase" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-28 pb-20">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Header */}
            <div className="mb-12 flex items-center justify-between">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Checkout
              </h1>
              <Button
                variant="ghost"
                onClick={() => navigate("/cart")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Cart
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Ahmed Khan" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="ahmed@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+92 300 1234567" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input placeholder="Lahore" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="123 Main Street, Gulberg"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Postal Code (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="54000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Payment Methods */}
                        <div className="border-t border-border pt-8">
                          <PaymentMethodSelector
                            selectedMethod={selectedPayment}
                            onMethodChange={setSelectedPayment}
                          />
                        </div>

                        {(selectedPayment === PAYMENT_GATEWAYS.JAZZ_CASH ||
                          selectedPayment === PAYMENT_GATEWAYS.EASYPAISA) && (
                          <div className="space-y-4 border-t border-border pt-8">
                            <h3 className="font-semibold text-foreground">Wallet Details</h3>
                            <FormField
                              control={form.control}
                              name="walletNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Wallet Number</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="03xx 1234567"
                                      inputMode="numeric"
                                      maxLength={15}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}

                        {/* Card Details for Stripe/Visa */}
                        {(selectedPayment === PAYMENT_GATEWAYS.STRIPE ||
                          selectedPayment === PAYMENT_GATEWAYS.VISA) && (
                          <div className="space-y-4 border-t border-border pt-8">
                            <h3 className="font-semibold text-foreground">Card Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name="cardNumber"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="4242 4242 4242 4242"
                                        maxLength={19}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="cardExpiry"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Expiry Date</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="cardCvc"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>CVC</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="123"
                                        maxLength={3}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          variant="hero"
                          size="lg"
                          className="w-full"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            `Place Order - Rs. ${finalTotal.toLocaleString()}`
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-28">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Items */}
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {items.map((item) => (
                        <div
                          key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                          className="flex gap-3"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-20 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 text-sm">
                            <p className="font-semibold text-foreground text-xs line-clamp-2">
                              {item.name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {item.selectedSize} · {item.selectedColor}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              Qty: {item.quantity}
                            </p>
                            <p className="font-semibold text-primary text-xs mt-1">
                              Rs. {(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-medium">
                          Rs. {totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Delivery</span>
                        <span className="font-medium">
                          {deliveryFee === 0 ? "Free" : `Rs. ${deliveryFee}`}
                        </span>
                      </div>
                      <div className="border-t border-border pt-3 flex justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-lg font-bold text-primary">
                          Rs. {finalTotal.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {totalPrice >= 5000 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                        <p className="text-green-800">
                          ✓ Congratulations! You qualify for free delivery.
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      <p className="mb-2">Order Number: {orderNumber}</p>
                      <p>Estimated delivery: 3-5 business days</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Checkout;
