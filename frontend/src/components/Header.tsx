"use client";

import { useState } from "react";
import { Search, Heart, ShoppingCart, User, Menu } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = ["HOME", "SHOP", "CATEGORIES", "ABOUT US"];

  return (
    <header className="w-full h-[60px] bg-mint-light shadow-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        {/* Logo */}
        <h1 className="font-quicksand font-bold text-2xl tracking-brand">
          <span className="text-dark-gray">NCX</span>
          <span className="text-accent-red">.</span>
        </h1>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((label) => (
            <a
              key={label}
              href="#"
              className="font-ntr text-lg text-dark-gray hover:text-accent-red transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-3 md:gap-4">
          {[Search, Heart, ShoppingCart, User].map((Icon, i) => (
            <button
              key={i}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <Icon className="w-5 h-5 text-dark-gray" strokeWidth={1.2} />
            </button>
          ))}
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <Menu className="w-5 h-5 text-dark-gray" strokeWidth={1.2} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-mint-light border-t border-light-green">
          <nav className="px-6 py-4 space-y-3">
            {navLinks.map((label) => (
              <a
                key={label}
                href="#"
                className="block font-ntr text-lg text-dark-gray hover:text-accent-red transition"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
