import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Filter, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ShopFilters from "@/components/ShopFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { products, categories } from "@/data/products";
import { cn } from "@/lib/utils";

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate max price from products
  const maxPrice = useMemo(() => {
    return Math.max(...products.map((p) => p.price));
  }, []);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);

  // Get all unique colors from products
  const allColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach((product) => {
      product.colors.forEach((color) => colors.add(color));
    });
    return Array.from(colors).sort();
  }, []);

  // Filter products based on all criteria
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }

      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Color filter
      if (selectedColors.length > 0) {
        const hasMatchingColor = product.colors.some((color) =>
          selectedColors.includes(color)
        );
        if (!hasMatchingColor) return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        const matchesDescription = product.description
          .toLowerCase()
          .includes(query);
        if (!matchesName && !matchesCategory && !matchesDescription) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedColors, priceRange, searchQuery]);

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((c) => c !== color)
        : [...prev, color]
    );
  };

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSelectedColors([]);
    setPriceRange([0, maxPrice]);
    setSearchQuery("");
  };

  const activeFilterCount =
    (selectedCategory !== "All" ? 1 : 0) +
    selectedColors.length +
    (priceRange[0] > 0 || priceRange[1] < maxPrice ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <>
      <Helmet>
        <title>Shop | Urban Wear Premium Fashion Collection</title>
        <meta
          name="description"
          content="Browse our full collection of premium fashion. Hoodies, jackets, pants, sneakers and accessories. Free delivery on orders over Rs. 5,000."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <main className="pt-32 pb-20">
          <div className="container mx-auto px-4">
            {/* Header */}
            <div className="mb-8">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Shop Collection
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-muted-foreground">
                  {filteredProducts.length} product{filteredProducts.length !== 1 && "s"}
                </p>
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground">•</span>
                    {selectedCategory !== "All" && (
                      <Badge variant="secondary" className="gap-1">
                        {selectedCategory}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setSelectedCategory("All")}
                        />
                      </Badge>
                    )}
                    {selectedColors.map((color) => (
                      <Badge key={color} variant="secondary" className="gap-1">
                        {color}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => handleColorToggle(color)}
                        />
                      </Badge>
                    ))}
                    {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                      <Badge variant="secondary" className="gap-1">
                        Rs. {priceRange[0].toLocaleString()} - Rs.{" "}
                        {priceRange[1].toLocaleString()}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setPriceRange([0, maxPrice])}
                        />
                      </Badge>
                    )}
                    {searchQuery && (
                      <Badge variant="secondary" className="gap-1">
                        "{searchQuery}"
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setSearchQuery("")}
                        />
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters Sidebar - Desktop */}
              <aside className="hidden lg:block lg:w-72 shrink-0">
                <ShopFilters
                  categories={categories}
                  allColors={allColors}
                  selectedCategory={selectedCategory}
                  selectedColors={selectedColors}
                  priceRange={priceRange}
                  maxPrice={maxPrice}
                  searchQuery={searchQuery}
                  onCategoryChange={setSelectedCategory}
                  onColorToggle={handleColorToggle}
                  onPriceChange={setPriceRange}
                  onSearchChange={setSearchQuery}
                  onClearFilters={handleClearFilters}
                />
              </aside>

              {/* Mobile Filters Overlay */}
              <AnimatePresence>
                {showFilters && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                      onClick={() => setShowFilters(false)}
                    />
                    <motion.aside
                      initial={{ x: "-100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "-100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="fixed left-0 top-0 h-full w-80 max-w-[90vw] bg-background z-50 lg:hidden overflow-y-auto p-4"
                    >
                      <ShopFilters
                        categories={categories}
                        allColors={allColors}
                        selectedCategory={selectedCategory}
                        selectedColors={selectedColors}
                        priceRange={priceRange}
                        maxPrice={maxPrice}
                        searchQuery={searchQuery}
                        onCategoryChange={setSelectedCategory}
                        onColorToggle={handleColorToggle}
                        onPriceChange={setPriceRange}
                        onSearchChange={setSearchQuery}
                        onClearFilters={handleClearFilters}
                        onClose={() => setShowFilters(false)}
                        showCloseButton
                      />
                    </motion.aside>
                  </>
                )}
              </AnimatePresence>

              {/* Products Grid */}
              <div className="flex-1">
                {/* Mobile Filter Toggle & Search */}
                <div className="lg:hidden mb-6 flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(true)}
                    className="shrink-0"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 justify-center">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                      >
                        <ProductCard product={product} index={index} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {filteredProducts.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No products found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search query
                    </p>
                    <Button variant="outline" onClick={handleClearFilters}>
                      Clear all filters
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Shop;
