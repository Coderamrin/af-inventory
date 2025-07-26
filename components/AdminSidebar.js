// components/AdminSidebar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, PenBoxIcon } from "lucide-react";
import LogoutButton from "./LogOut";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: "/admin", label: "🏠 Dashboard" },
    { href: "/admin/products", label: "📦 Products" },
    { href: "/admin/sellers", label: "🧑‍💼 Sellers" },
    { href: "/admin/assignments", label: "📊 Assignments" },
    { href: "/admin/update-password", label: " Update Password" },
  ];

  const SidebarContent = () => (
    <aside className="h-screen w-60 bg-white shadow-md p-6 flex flex-col">
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
      <div className="mt-auto">
        <LogoutButton />
      </div>
    </aside>
  );

  return (
    <div>
      {/* Mobile: Hamburger button */}
      <div className="lg:hidden p-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: Sidebar always visible */}
      <div className="hidden lg:block">
        <SidebarContent />
      </div>
    </div>
  );
}
