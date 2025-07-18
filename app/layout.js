// app/layout.tsx
import SessionWrapper from "@/utils/SessionWrapper";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <ClientLayout>{children}</ClientLayout>
        </SessionWrapper>
      </body>
    </html>
  );
}
