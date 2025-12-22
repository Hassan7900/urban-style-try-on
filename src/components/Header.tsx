import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/collections", label: "Collections" },
    { href: "/try-on", label: "Virtual Try-On" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-gradient-gold">
              SHOPPING ZILLA
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
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden md:block text-sm text-muted-foreground">
                  {user.email?.split("@")[0]}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Sign Out
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
        </nav>
      </div>
    </header>
  );
};

export default Header;
