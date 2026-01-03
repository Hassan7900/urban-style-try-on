import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search, Sun, Moon, Loader2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsSearchOpen(false);
    }
  };

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/collections", label: "Collections" },
    { href: "/try-on", label: "Virtual Try-On" },
    { href: "/about", label: "About" },
    ...(profile?.role === 'seller' ? [{ href: "/seller-dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-gradient-gold">
              URBAN WEAR
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden md:flex">
                  <Search className="h-5 w-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-2" align="end">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button type="submit" size="icon" variant="default">
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="hidden md:flex"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm text-muted-foreground">
                    {profile?.first_name || user.email?.split("@")[0]}
                  </span>
                  {profile?.role && (
                    <span className="text-xs text-primary capitalize">
                      {profile.role}
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    setIsSigningOut(true);
                    try {
                      await signOut();
                      // Small delay to ensure auth state updates
                      setTimeout(() => {
                        navigate('/');
                      }, 100);
                    } catch (error) {
                      console.error('Sign out failed:', error);
                      // Still navigate even if there's an error
                      navigate('/');
                    } finally {
                      setIsSigningOut(false);
                    }
                  }}
                  disabled={isSigningOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isSigningOut ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing Out...
                    </>
                  ) : (
                    'Sign Out'
                  )}
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/auth")}
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/wishlist")}
              className="relative hidden md:flex"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/cart")}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-x-0 top-20 bg-background border-t border-border transition-all duration-300 ease-in-out",
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile Theme Toggle */}
          <Button
            variant="ghost"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="justify-start text-lg font-medium text-foreground hover:text-primary transition-colors py-2"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-5 w-5 mr-2" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="h-5 w-5 mr-2" />
                Dark Mode
              </>
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
