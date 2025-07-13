'use client';

import './globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function RootLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '🏠 Dashboard' },
    { href: '/products', label: '📦 Products' },
    { href: '/sellers', label: '🧑‍💼 Sellers' },
    { href: '/assignments', label: '📊 Assignments' },
  ];

  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-60 bg-white shadow-md p-6 flex flex-col">
          <h1 className="text-2xl font-bold mb-8">Inventory Dashboard</h1>
          <nav className="flex flex-col space-y-4 text-gray-700 font-medium">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`hover:text-blue-600 transition ${
                  pathname === href ? 'text-blue-600 font-semibold' : ''
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
