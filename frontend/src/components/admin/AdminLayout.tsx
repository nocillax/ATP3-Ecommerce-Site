import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const links = [
  { href: "/admin/hero-images", label: "Hero Images" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  // const { user, isLoading } = useAuth();

  const { user, isLoading, fetchUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // We still fetch the user to get their details like name and role
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    // This effect runs whenever the loading status or user changes.
    // It acts as our client-side gatekeeper.
    if (!isLoading) {
      if (!user || user.role !== "admin") {
        console.log("CLIENT-SIDE GUARD: User is not an admin. Redirecting.");
        router.push("/login");
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex bg-[#f6fef9]">
      {/* Sidebar */}
      <aside className="w-[220px] hidden md:flex flex-col border-r border-light-green bg-mint-light p-4">
        <h2 className="text-xl font-playfair font-bold text-dark-gray mb-6">
          Admin
        </h2>
        <nav className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded font-reem-kufi text-sm font-bold transition ${
                pathname === link.href
                  ? "bg-dark-gray text-mint-light"
                  : "text-dark-gray hover:bg-dark-gray hover:text-mint-light"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
};

export default AdminLayout;
