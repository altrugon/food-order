import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Food Order App",
  description: "Next.js food delivery demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-200 text-gray-900 min-h-screen">
        <header className="bg-white shadow p-4 font-bold text-lg">
          <Link href="/">🍕 Food Delivery</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
