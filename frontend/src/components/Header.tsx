// "use client";

// import { useEffect, useState } from "react";
// import { Search, Heart, ShoppingCart, User, Menu, LogOut } from "lucide-react";
// import { useCartStore } from "@/store/cartStore";
// import { useRouter } from "next/navigation";
// import { useAuthStore } from "@/store/authStore";
// import api from "@/lib/api";
// import Link from "next/link";

// const Header = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const router = useRouter();

//   const navLinks = ["HOME", "SHOP", "CATEGORIES", "ABOUT US"];

//   // ✅ Get the state and actions from the Zustand store
//   const { itemCount, fetchCart } = useCartStore();

//   const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

//   const { user, isLoading, fetchUser, logout } = useAuthStore();

//   const handleLogout = async () => {
//     try {
//       await api.post("/auth/logout");
//       await logout(); // Clear user state in the store
//       // Clear the cart state on the frontend
//       //clearCart();
//       // Redirect to homepage
//       router.push("/");
//       router.refresh(); // Forces a refresh to update server-side auth state
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   // ✅ Fetch the initial cart state when the header first loads
//   useEffect(() => {
//     fetchCart();
//   }, [fetchCart]);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       const dropdown = document.getElementById("user-dropdown");
//       if (dropdown && !dropdown.contains(e.target as Node)) {
//         setIsUserMenuOpen(false);
//       }
//     };

//     if (isUserMenuOpen) {
//       window.addEventListener("click", handleClickOutside);
//     }

//     return () => {
//       window.removeEventListener("click", handleClickOutside);
//     };
//   }, [isUserMenuOpen]);

//   return (
//     <header className="w-full h-[60px] bg-mint-light shadow-nav sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 flex items-center justify-center h-full relative">
//         {/* Logo */}
//         <div className="absolute left-4 flex items-center">
//           <img src="/logo/NX-Logo.svg" alt="NCX Logo" className="h-8 w-auto" />
//         </div>

//         {/* Center Nav */}
//         <nav className="hidden md:flex items-center gap-8">
//           {navLinks.map((label) => (
//             <a
//               key={label}
//               href="#"
//               className="font-ntr text-lg text-dark-gray hover:text-accent-red transition-colors"
//             >
//               {label}
//             </a>
//           ))}
//         </nav>

//         {/* Action Icons */}
//         <div className="absolute right-4 flex items-center gap-3 md:gap-4">
//           <button className="p-2 rounded-full hover:bg-gray-100 transition">
//             <Search size={20} strokeWidth={1.2} />
//           </button>
//           <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
//             <ShoppingCart size={20} strokeWidth={1.2} />
//             {itemCount > 0 && (
//               <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-red text-white text-xs">
//                 {itemCount}
//               </span>
//             )}
//           </button>

//           {/* ✅ SIMPLIFIED LOGIC: Show Login by default, then switch to Logout if user exists */}
//           {user ? (
//             <button
//               onClick={handleLogout}
//               title="Logout"
//               className="p-2 rounded-full hover:bg-gray-100 transition"
//             >
//               <LogOut size={20} className="text-red-500" strokeWidth={1.2} />
//             </button>
//           ) : (
//             <Link
//               href="/login"
//               title="Login / Register"
//               className="p-2 rounded-full hover:bg-gray-100 transition"
//             >
//               <User size={20} strokeWidth={1.2} />
//             </Link>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;

// FILE: src/components/Header.tsx
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

  // ✅ State for the new user dropdown menu
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ This hook runs once when the component loads to check for a user.
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ✅ This second hook runs whenever the 'user' object changes.
  // If the user logs in, this will trigger and fetch their cart.
  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  // ✅ Hook to close dropdown when clicking outside
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

  // ✅ Correctly call the global logout action from the store
  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  const navLinks = [
    { label: "HOME", href: "/" },
    { label: "SHOP", href: "/products" },
    { label: "CATEGORIES", href: "/categories" },
    { label: "ABOUT US", href: "/about" },
  ];

  return (
    <header className="w-full h-[60px] bg-mint-light shadow-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center h-full relative">
        {/* Logo - Unchanged */}
        <Link href="/" className="absolute left-4 flex items-center">
          <img src="/logo/NX-Logo.svg" alt="NCX Logo" className="h-8 w-auto" />
        </Link>

        {/* Center Nav - Unchanged */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-ntr text-lg text-dark-gray hover:text-accent-red transition-colors"
            >
              {label}
            </a>
          ))}
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
          {/* ✅ FINAL AUTH BLOCK: Replaces the simple Login/Logout toggle */}

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
