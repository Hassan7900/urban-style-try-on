import { useState } from "react";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface ShopFiltersProps {
  categories: string[];
  allColors: string[];
  selectedCategory: string;
  selectedColors: string[];
  priceRange: [number, number];
  maxPrice: number;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onColorToggle: (color: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const ShopFilters = ({
  categories,
  allColors,
  selectedCategory,
  selectedColors,
  priceRange,
  maxPrice,
  searchQuery,
  onCategoryChange,
  onColorToggle,
  onPriceChange,
  onSearchChange,
  onClearFilters,
  onClose,
  showCloseButton = false,
}: ShopFiltersProps) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    colors: true,
  });

  const hasActiveFilters =
    selectedCategory !== "All" ||
    selectedColors.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    searchQuery !== "";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-PK", {
      style: "currency",
      currency: "PKR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const colorMap: Record<string, string> = {
    Black: "#000000",
    White: "#FFFFFF",
    Grey: "#808080",
    Navy: "#000080",
    Blue: "#2563eb",
    Red: "#dc2626",
    Olive: "#808000",
    Khaki: "#c3b091",
    Beige: "#f5f5dc",
    Brown: "#8B4513",
    Tan: "#D2B48C",
    Cream: "#FFFDD0",
    Charcoal: "#36454F",
    Burgundy: "#800020",
    Maroon: "#800000",
    Indigo: "#4B0082",
    Multi: "linear-gradient(135deg, #ff6b6b, #4ecdc4, #45b7d1)",
  };

  return (
    <div className="glass rounded-xl p-6 sticky top-28">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          <h2 className="font-display text-lg font-semibold text-foreground">
            Filters
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
          {showCloseButton && onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-background/50"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => onSearchChange("")}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Categories */}
      <Collapsible
        open={openSections.categories}
        onOpenChange={(open) =>
          setOpenSections((prev) => ({ ...prev, categories: open }))
        }
        className="mb-6"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
          <span>Categories</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              openSections.categories && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Price Range */}
      <Collapsible
        open={openSections.price}
        onOpenChange={(open) =>
          setOpenSections((prev) => ({ ...prev, price: open }))
        }
        className="mb-6"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
          <span>Price Range</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              openSections.price && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          <div className="px-1">
            <Slider
              value={priceRange}
              onValueChange={(value) => onPriceChange(value as [number, number])}
              max={maxPrice}
              min={0}
              step={500}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {formatPrice(priceRange[0])}
              </span>
              <span className="text-muted-foreground">
                {formatPrice(priceRange[1])}
              </span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Colors */}
      <Collapsible
        open={openSections.colors}
        onOpenChange={(open) =>
          setOpenSections((prev) => ({ ...prev, colors: open }))
        }
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
          <span>Colors</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              openSections.colors && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <div className="grid grid-cols-4 gap-2">
            {allColors.map((color) => {
              const isSelected = selectedColors.includes(color);
              const colorValue = colorMap[color] || "#808080";
              const isGradient = colorValue.includes("gradient");

              return (
                <button
                  key={color}
                  onClick={() => onColorToggle(color)}
                  className={cn(
                    "group relative flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all",
                    isSelected
                      ? "bg-primary/10 ring-2 ring-primary"
                      : "hover:bg-secondary"
                  )}
                  title={color}
                >
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-transform group-hover:scale-110",
                      isSelected ? "border-primary" : "border-border",
                      color === "White" && "border-muted-foreground/30"
                    )}
                    style={{
                      background: isGradient ? colorValue : colorValue,
                    }}
                  />
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                    {color}
                  </span>
                </button>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ShopFilters;
