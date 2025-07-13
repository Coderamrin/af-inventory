import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Inventory Dashboard",
  description: "Admin dashboard for inventory system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-60 bg-white shadow-md p-6 flex flex-col">
          <h1 className="text-2xl font-bold mb-8">Inventory Dashboard</h1>
          <nav className="flex flex-col space-y-4 text-gray-700 font-medium">
            <Link href="/" className="hover:text-blue-600">
              🏠 Dashboard
            </Link>
            <Link href="/products" className="hover:text-blue-600">
              📦 Products
            </Link>
            <Link href="/sellers" className="hover:text-blue-600">
              🧑‍💼 Sellers
            </Link>
            <Link href="/assignments" className="hover:text-blue-600">
              📊 Assignments
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
