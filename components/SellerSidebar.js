// components/SellerSidebar.tsx
import Link from "next/link";
import LogoutButton from "./LogOut";
export default function SellerSidebar({ pathname }) {
  const navItems = [
    { href: "/seller", label: "🏠 Seller Home" },
    { href: "/seller/payment", label: "📦 My Products" },
  ];

  return (
    <aside className="w-60 bg-white shadow-md p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8">Seller Dashboard</h1>
      <nav className="flex flex-col space-y-4 text-gray-700 font-medium">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`hover:text-blue-600 transition ${
              pathname === href ? "text-blue-600 font-semibold" : ""
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <LogoutButton />
    </aside>
  );
}
