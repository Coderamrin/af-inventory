// components/SellerSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import LogoutButton from "./LogOut";

export default function SellerSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/seller", label: "🏠 Seller Home" },
    { href: "/seller/payment", label: "📦 My Products" },
  ];

  return (
    <div className="flex">
      {/* Mobile sidebar button */}
      <div className="lg:hidden p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-6">
            <h1 className="text-xl font-bold mb-6">Seller Dashboard</h1>
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
              <LogoutButton />
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-60 bg-white shadow-md p-6 flex-col">
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
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>
    </div>
  );
}
