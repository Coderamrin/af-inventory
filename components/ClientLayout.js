"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import AdminSidebar from "@/components/AdminSidebar";
import SellerSidebar from "@/components/SellerSidebar";
import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const role = session?.user?.role;

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-100">
        {status === "authenticated" && (
          <>
            {role === "ADMIN" && <AdminSidebar pathname={pathname} />}
            {role === "SELLER" && <SellerSidebar pathname={pathname} />}
          </>
        )}
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
