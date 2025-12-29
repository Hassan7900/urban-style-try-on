import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, Package, Users, TrendingUp, Settings, BarChart3 } from "lucide-react";
import ProductManagement from "./ProductManagement";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect, useCallback } from "react";

const SellerDashboard = () => {
  const { profile, user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStockProducts: 0,
    totalSales: 0,
    totalOrders: 0,
  });

  useEffect(() => {
    if (profile?.role === 'seller' && user) {
      fetchStats();
    }
  }, [profile, user, fetchStats]);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      // Fetch products count
      const { data: products, error: productsError } = await supabase
        .from('seller_products')
        .select('id, in_stock, price')
        .eq('seller_id', user.id);

      if (productsError) throw productsError;

      const totalProducts = products?.length || 0;
      const inStockProducts = products?.filter(p => p.in_stock).length || 0;

      // For now, we'll use placeholder values for sales and orders
      // In a real app, you'd have orders and sales tables
      setStats({
        totalProducts,
        inStockProducts,
        totalSales: 0, // Placeholder
        totalOrders: 0, // Placeholder
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [user]);

  if (profile?.role !== 'seller') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
        <p className="text-muted-foreground">You need to be a seller to access this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Seller Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {profile.first_name}! Manage your products and grow your business.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.inStockProducts} in stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rs {stats.totalSales.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.totalOrders} orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">Pending fulfillment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Stock</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inStockProducts}</div>
            <p className="text-xs text-muted-foreground">Available for sale</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5" />
              Store Settings
            </CardTitle>
            <CardDescription>
              Customize your store appearance and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Store Settings
            </Button>
            <Button className="w-full" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics & Reports
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Product Management */}
      <ProductManagement onStatsChange={fetchStats} />

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Your latest customer orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: "#ORD-001", customer: "Ahmed Khan", product: "Urban Cargo Pants", amount: "Rs 5,499", status: "Delivered" },
              { id: "#ORD-002", customer: "Sara Ahmed", product: "Premium Cotton Tee", amount: "Rs 1,999", status: "Processing" },
              { id: "#ORD-003", customer: "Bilal Hussain", product: "Classic Oversized Hoodie", amount: "Rs 4,999", status: "Shipped" },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm">{order.product}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{order.amount}</span>
                  <Badge variant={order.status === "Delivered" ? "default" : order.status === "Processing" ? "secondary" : "outline"}>
                    {order.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerDashboard;