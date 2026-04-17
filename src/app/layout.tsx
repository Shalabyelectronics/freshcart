import type { Metadata } from "next";
import { Exo, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar/Navbar";
import Footer from "./_components/Footer/Footer";
import StoreProvider from "@/store/provider";
import { Toaster } from "@/components/ui/sonner";

const exo = Exo({
  variable: "--font-exo",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://freshcart.vercel.app"),
  title: {
    default: "FreshCart | Best Online Grocery Store",
    template: "%s | FreshCart",
  },
  description:
    "Shop for fresh groceries, electronics, and fashion at FreshCart. Enjoy the best prices and fast delivery in Egypt.",
  openGraph: {
    title: "FreshCart | Best Online Grocery Store",
    description:
      "Shop for fresh groceries, electronics, and fashion at FreshCart. Enjoy the best prices and fast delivery in Egypt.",
    url: "https://freshcart.vercel.app",
    siteName: "FreshCart",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FreshCart | Best Online Grocery Store",
    description:
      "Shop for fresh groceries, electronics, and fashion at FreshCart. Enjoy the best prices and fast delivery in Egypt.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${exo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors position="top-center" />
        </StoreProvider>
      </body>
    </html>
  );
}
