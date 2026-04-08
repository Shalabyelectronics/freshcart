"use client";

import { useState, useEffect } from "react";
import {
  CircleUserRound,
  Headset,
  Heart,
  LogOut,
  Mail,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/" },
  { label: "Categories", href: "/categories" },
  { label: "Brands", href: "/brands" },
];

const DRAWER_ITEMS = [
  ...NAV_ITEMS,
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
];

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Only read localStorage after component mounts on client
  useEffect(() => {
    let isLogged = false;
    if (typeof window !== "undefined") {
      const token =
        window.localStorage.getItem("userToken") ||
        window.localStorage.getItem("token");
      isLogged = Boolean(token);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(isLogged);
    setIsMounted(true);
  }, []);

  function handleSignOut() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("userToken");
      window.localStorage.removeItem("token");
    }

    setIsLoggedIn(false);
    toast.success("Signed out successfully.");
    router.push("/login");
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    toast.info(`Search for \"${search || "products"}\" coming soon.`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E7EB] bg-white">
      <div className="hidden border-b border-[#E5E7EB] bg-[#F8F9FA] lg:block">
        <div className="mx-auto flex h-11 w-full max-w-[1280px] items-center justify-between px-4 text-sm text-slate-600 md:px-6">
          <div className="flex items-center gap-8">
            <p className="inline-flex items-center gap-2">
              <ShoppingCart className="size-4 text-[#16A34A]" />
              Free Shipping on Orders{" "}
              <span className="font-semibold text-[#16A34A]">500 EGP</span>
            </p>
            <p className="inline-flex items-center gap-2">
              <Heart className="size-4 text-[#16A34A]" />
              New Arrivals Daily
            </p>
          </div>

          <div className="flex items-center gap-5">
            <p className="inline-flex items-center gap-2">
              <Phone className="size-4" />
              +1 (800) 123-4567
            </p>
            <p className="inline-flex items-center gap-2 border-x border-[#D7DCE2] px-5">
              <Mail className="size-4" />
              support@freshcart.com
            </p>

            {isMounted ? (
              isLoggedIn ? (
                <>
                  <span className="inline-flex items-center gap-2">
                    <User className="size-4" />
                    Mohamed Shalaby
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="inline-flex items-center gap-2 font-medium text-slate-700 transition hover:text-red-600"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="font-medium text-slate-700 transition hover:text-[#16A34A]"
                >
                  Sign In
                </Link>
              )
            ) : (
              <Link
                href="/login"
                className="font-medium text-slate-700 transition hover:text-[#16A34A]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-10 w-10 p-0 lg:hidden">
                <Menu className="size-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>

            <SheetContent className="p-0">
              <SheetHeader className="border-b border-[#E5E7EB] p-4 pr-12">
                <SheetTitle className="flex items-center gap-2 text-4xl font-bold text-slate-800">
                  <span className="text-[#16A34A]">🛒</span>
                  FreshCart
                </SheetTitle>
              </SheetHeader>

              <div className="flex h-[calc(100vh-70px)] flex-col overflow-y-auto p-4">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="h-11 rounded-2xl border-[#D5DBE3] pr-12 text-base"
                    placeholder="Search products..."
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-[#16A34A] text-white"
                  >
                    <Search className="size-4" />
                  </button>
                </form>

                <nav className="mt-5 space-y-1 border-y border-[#E5E7EB] py-4">
                  {DRAWER_ITEMS.map((item) => (
                    <SheetClose asChild key={item.label}>
                      <Link
                        href={item.href}
                        className="block rounded-lg px-3 py-3 text-4xl font-medium text-slate-800 hover:bg-slate-50"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="mt-4 space-y-3 border-b border-[#E5E7EB] pb-4">
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-800">
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#F1F5F9]">
                      <CircleUserRound className="size-5 text-slate-500" />
                    </span>
                    <span className="text-4xl font-medium">
                      {isMounted &&
                        (isLoggedIn ? "Mohamed Shalaby" : "Sign In")}
                    </span>
                  </div>

                  {isMounted && isLoggedIn && (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-4xl font-medium text-red-500 hover:bg-red-50"
                    >
                      <span className="inline-flex size-11 items-center justify-center rounded-full bg-red-50">
                        <LogOut className="size-5" />
                      </span>
                      Sign Out
                    </button>
                  )}
                </div>

                <div className="mt-auto rounded-2xl border border-[#D1FAE5] bg-[#F0FDF4] p-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-12 items-center justify-center rounded-full bg-[#D1FAE5] text-[#16A34A]">
                      <Headset className="size-6" />
                    </span>
                    <div>
                      <p className="text-2xl font-semibold text-slate-800">
                        Need Help?
                      </p>
                      <a
                        href="#"
                        className="text-xl font-medium text-[#16A34A]"
                      >
                        Contact Support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link
            href="/"
            className="flex items-center gap-2 text-2xl font-bold text-slate-800"
          >
            <span className="text-[#16A34A]">🛒</span>
            FreshCart
          </Link>
        </div>

        <form onSubmit={handleSearchSubmit} className="hidden flex-1 lg:block">
          <div className="relative">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-13 rounded-full border-[#D5DBE3] pr-16 text-2xl"
              placeholder="Search for products, brands and more..."
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-[#16A34A] text-white"
            >
              <Search className="size-5" />
            </button>
          </div>
        </form>

        <div className="ml-auto hidden items-center gap-5 lg:flex">
          <nav className="flex items-center gap-8 text-xl font-medium text-slate-800">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="transition hover:text-[#16A34A]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 border-l border-[#D7DCE2] pl-4 text-slate-500">
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#ECFDF5] text-[#16A34A]">
              <Headset className="size-5" />
            </span>
            <p className="leading-tight">
              <span className="text-sm text-slate-400">Support</span>
              <br />
              <span className="font-semibold text-slate-700">24/7 Help</span>
            </p>
            <Link
              href="/wishlist"
              className="p-1 transition hover:text-[#16A34A]"
            >
              <Heart className="size-7" />
            </Link>
            <Link href="/cart" className="p-1 transition hover:text-[#16A34A]">
              <ShoppingCart className="size-7" />
            </Link>
            <Link href="/login" className="p-1 transition hover:text-[#16A34A]">
              <User className="size-7" />
            </Link>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Link href="/wishlist" className="rounded-full p-2 text-slate-600">
            <Heart className="size-5" />
          </Link>
          <Link href="/cart" className="rounded-full p-2 text-slate-600">
            <ShoppingCart className="size-5" />
          </Link>
          <Link href="/login" className="rounded-full p-2 text-slate-600">
            <User className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
