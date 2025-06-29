import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/brands", label: "Brands" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/orders", label: "Orders" },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

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
