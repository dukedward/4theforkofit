import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Menu,
  X,
  Flame,
  LogIn,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/menu" },
  { label: "Order", path: "/cart" },
  { label: "My Orders", path: "/orders" },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const { user, profile, isAuthenticated, isAdmin, loginWithGoogle, logout } =
    useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName =
    profile?.full_name ||
    profile?.username ||
    user?.displayName ||
    user?.email ||
    "Account";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Flame className="w-7 h-7 text-primary transition-transform group-hover:scale-110" />
            <span className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">
              4theForkOfIt
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-body text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/cart" className="relative">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            {isAdmin && (
              <Link to="/admin">
                <Button
                  variant="outline"
                  size="sm"
                  className="font-body gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin
                </Button>
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="font-body text-xs text-muted-foreground hidden lg:block">
                  {displayName}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={loginWithGoogle}
                className="font-body bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Button>
            )}
          </div>

          {/* Mobile */}
          <div className="flex md:hidden items-center gap-3">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground">
                  {itemCount}
                </Badge>
              )}
            </Link>
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block font-body text-sm font-medium tracking-wide uppercase py-2 ${
                    location.pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block font-body text-sm font-medium tracking-wide uppercase py-2 text-muted-foreground"
                >
                  Admin Panel
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  onClick={async () => {
                    await logout();
                    setMobileOpen(false);
                  }}
                  className="block font-body text-sm font-medium tracking-wide uppercase py-2 text-muted-foreground"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={async () => {
                    await loginWithGoogle();
                    setMobileOpen(false);
                  }}
                  className="block font-body text-sm font-medium tracking-wide uppercase py-2 text-primary"
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
