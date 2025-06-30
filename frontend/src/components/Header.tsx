"use client";

import { useEffect, useState, useRef } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  LogOut,
  LayoutDashboard,
  Package,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  // State and actions from our global stores
  const { itemCount, fetchCart, clearCart } = useCartStore();
  const { user, fetchUser, logout } = useAuthStore();

  //  State for the new user dropdown menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const usr = useAuthStore((state) => state.user);

  //  This hook runs once when the component loads to check for a user.
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  //  This second hook runs whenever the 'user' object changes.
  // If the user logs in, this will trigger and fetch their cart.
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  //  Hook to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      window.addEventListener("click", handleClickOutside);
    }
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [isUserMenuOpen]);

  //  Correctly call the global logout action from the store
  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (usr?.role === "admin") {
      router.push("/admin/products");
    } else {
      router.push("/");
    }
  };

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "SHOP", href: "/products" },
    // { label: "CATEGORIES", href: "/categories" },
    // { label: "ABOUT US", href: "/about" },
  ];

  return (
    <header className="w-full h-[60px] bg-mint-light shadow-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center h-full relative">
        {/* Logo - Unchanged */}
        <Link href="/" className="absolute left-4 flex items-center">
          <img src="/logo/NX-Logo.svg" alt="NCX Logo" className="h-8 w-auto" />
        </Link>

        {/* Center Nav - Unchanged */}
        <nav>
          <ul className="flex gap-4">
            {navLinks.map((link) => {
              if (link.label === "HOME") {
                return (
                  <li key={link.label}>
                    <a href="#" onClick={handleHomeClick}>
                      {link.label}
                    </a>
                  </li>
                );
              }

              return (
                <li key={link.label}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Icons - Unchanged wrapper */}
        <div className="absolute right-4 flex items-center gap-3 md:gap-4">
          <Link
            href="/cart"
            className="p-2 rounded-full hover:bg-gray-100 transition relative"
          >
            <ShoppingCart size={20} strokeWidth={1.2} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-white text-xs">
                {itemCount}
              </span>
            )}
          </Link>
          {/*  FINAL AUTH BLOCK: Replaces the simple Login/Logout toggle */}

          <div className="flex items-center gap-4">
            {user ? (
              // --- LOGGED IN VIEW ---
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm font-medium text-dark-gray">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <LogOut
                    size={20}
                    className="text-red-500"
                    strokeWidth={1.2}
                  />
                </button>
              </div>
            ) : (
              // --- LOGGED OUT VIEW ---
              <Link
                href="/login"
                title="Login / Register"
                className="p-2 rounded-full hover:bg-gray-100 transition"
              >
                <User size={20} strokeWidth={1.2} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
