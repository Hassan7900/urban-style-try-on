import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Package, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface SellerProduct {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  image: string | null;
  category: string;
  sizes: string[];
  colors: string[];
  in_stock: boolean;
  try_on_compatible: boolean;
  created_at: string;
  updated_at: string;
}

const categories = ["Hoodies", "T-Shirts", "Pants", "Jackets", "Footwear", "Accessories"];
const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36"];
const availableColors = ["Black", "White", "Grey", "Navy", "Red", "Blue", "Green", "Yellow", "Pink", "Purple"];

const ProductManagement: React.FC<{ onStatsChange?: () => void }> = ({ onStatsChange }) => {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    image: "",
    category: "",
    sizes: [] as string[],
    colors: [] as string[],
    inStock: true,
    tryOnCompatible: false,
  });

  const fetchProducts = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('seller_products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (profile?.role === 'seller') {
      fetchProducts();
    }
  }, [profile, user, fetchProducts]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      image: "",
      category: "",
      sizes: [],
      colors: [],
      inStock: true,
      tryOnCompatible: false,
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const productData = {
        seller_id: user.id,
        name: formData.name,
        description: formData.description || null,
        price: parseInt(formData.price),
        original_price: formData.originalPrice ? parseInt(formData.originalPrice) : null,
        image: formData.image || null,
        category: formData.category,
        sizes: formData.sizes,
        colors: formData.colors,
        in_stock: formData.inStock,
        try_on_compatible: formData.tryOnCompatible,
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('seller_products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;
        toast.success("Product updated successfully!");
      } else {
        const { error } = await supabase
          .from('seller_products')
          .insert(productData);

        if (error) throw error;
        toast.success("Product added successfully!");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
      onStatsChange?.();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error("Failed to save product");
    }
  };

  const handleEdit = (product: SellerProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      originalPrice: product.original_price?.toString() || "",
      image: product.image || "",
      category: product.category,
      sizes: product.sizes,
      colors: product.colors,
      inStock: product.in_stock,
      tryOnCompatible: product.try_on_compatible,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase
        .from('seller_products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      toast.success("Product deleted successfully!");
      fetchProducts();
      onStatsChange?.();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error("Failed to delete product");
    }
  };

  const toggleStock = async (product: SellerProduct) => {
    try {
      const { error } = await supabase
        .from('seller_products')
        .update({ in_stock: !product.in_stock })
        .eq('id', product.id);

      if (error) throw error;
      toast.success(`Product ${!product.in_stock ? 'enabled' : 'disabled'} successfully!`);
      fetchProducts();
      onStatsChange?.();
    } catch (error) {
      console.error('Error updating product stock:', error);
      toast.error("Failed to update product status");
    }
  };

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
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Product Management
          </h1>
          <p className="text-muted-foreground">
            Manage your products and inventory
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
              <DialogDescription>
                Fill in the product details below
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (PKR) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price (PKR)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="Leave empty if no discount"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Sizes</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableSizes.map((size) => (
                      <label key={size} className="flex items-center space-x-2">
                        <Checkbox
                          checked={formData.sizes.includes(size)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, sizes: [...formData.sizes, size] });
                            } else {
                              setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
                            }
                          }}
                        />
                        <span className="text-sm">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Colors</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableColors.map((color) => (
                      <label key={color} className="flex items-center space-x-2">
                        <Checkbox
                          checked={formData.colors.includes(color)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({ ...formData, colors: [...formData.colors, color] });
                            } else {
                              setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) });
                            }
                          }}
                        />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.inStock}
                    onCheckedChange={(checked) => setFormData({ ...formData, inStock: !!checked })}
                  />
                  <span className="text-sm">In Stock</span>
                </label>

                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData.tryOnCompatible}
                    onCheckedChange={(checked) => setFormData({ ...formData, tryOnCompatible: !!checked })}
                  />
                  <span className="text-sm">Virtual Try-On Compatible</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? "Update Product" : "Add Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Your Products ({products.length})
          </CardTitle>
          <CardDescription>
            Manage your product listings and inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No products yet</h3>
              <p className="text-muted-foreground mb-4">Start by adding your first product</p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {product.sizes.length} sizes, {product.colors.length} colors
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">Rs {product.price.toLocaleString()}</div>
                        {product.original_price && (
                          <div className="text-sm text-muted-foreground line-through">
                            Rs {product.original_price.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleStock(product)}
                        className={product.in_stock ? "text-green-600" : "text-red-600"}
                      >
                        {product.in_stock ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductManagement;