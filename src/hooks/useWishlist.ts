import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useWishlist = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistItems([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setWishlistItems(data?.map((item) => item.product_id) || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.includes(productId),
    [wishlistItems]
  );

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items to your wishlist",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const isCurrentlyInWishlist = isInWishlist(productId);

    try {
      if (isCurrentlyInWishlist) {
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;

        setWishlistItems((prev) => prev.filter((id) => id !== productId));
        toast({
          title: "Removed from wishlist",
          description: "Item removed from your wishlist",
        });
      } else {
        const { error } = await supabase.from("wishlist").insert({
          user_id: user.id,
          product_id: productId,
        });

        if (error) throw error;

        setWishlistItems((prev) => [...prev, productId]);
        toast({
          title: "Added to wishlist",
          description: "Item saved to your wishlist",
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    wishlistItems,
    isInWishlist,
    toggleWishlist,
    isLoading,
    wishlistCount: wishlistItems.length,
  };
};
