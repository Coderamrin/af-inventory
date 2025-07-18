// components/AdminSidebar.tsx
import Link from "next/link";
import LogoutButton from "./LogOut";

export default function AdminSidebar({ pathname }) {
  const navItems = [
    { href: "/", label: "🏠 Dashboard" },
    { href: "/admin/products", label: "📦 Products" },
    { href: "/admin/sellers", label: "🧑‍💼 Sellers" },
    { href: "/admin/assignments", label: "📊 Assignments" },
  ];

  return (
    <aside className="w-60 bg-white shadow-md p-6 flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
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
