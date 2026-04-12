"use client";

import { useState, useMemo } from "react";
import {
  ChevronDown,
  CircleUserRound,
  Headset,
  Heart,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Settings,
  User,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useGetCategoriesQuery,
  useGetLoggedUserCartQuery,
  useGetWishlistQuery,
} from "@/store/apiSlice";
import { clearAuthStorage, useAuthState } from "@/hooks/useAuthState";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const DRAWER_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/products" },
  { label: "Categories", href: "/products" },
  { label: "Brands", href: "/brands" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
];

const CATEGORY_MENU_LABELS = [
  "Electronics",
  "Women's Fashion",
  "Men's Fashion",
  "Beauty & Health",
];

export default function Navbar() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const { isLoggedIn, profile } = useAuthState();
  const { data: cartData } = useGetLoggedUserCartQuery(undefined, {
    skip: !isLoggedIn,
  });
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isLoggedIn,
  });
  const { data: categoriesData } = useGetCategoriesQuery();

  const categoriesForMenu = useMemo(() => {
    const all = categoriesData?.data ?? [];
    return CATEGORY_MENU_LABELS.map((label) => {
      const match = all.find(
        (item) => item.name.trim().toLowerCase() === label.trim().toLowerCase(),
      );

      return {
        label,
        href: match
          ? `/products?category=${encodeURIComponent(match._id)}`
          : "/products",
      };
    });
  }, [categoriesData?.data]);

  function handleSignOut() {
    clearAuthStorage();
    toast.success("Signed out successfully.");
    router.push("/login");
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const keyword = search.trim();
    const targetUrl = keyword
      ? `/products?keyword=${encodeURIComponent(keyword)}`
      : "/products";

    router.push(targetUrl);
    setSearch("");
  }

  const displayName = profile?.name?.trim() || "Mohamed Shalaby";
  const displayEmail = profile?.email?.trim() || "shalabyegypto@gmail.com";
  const guestAuthLinks = (
    <>
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 font-medium text-slate-700 transition hover:text-[#16A34A]"
      >
        <User className="size-4" />
        Sign In
      </Link>
      <Link
        href="/register"
        className="inline-flex items-center gap-1.5 font-medium text-slate-700 transition hover:text-[#16A34A]"
      >
        <UserPlus className="size-4" />
        Sign Up
      </Link>
    </>
  );

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

            {isLoggedIn ? (
              <>
                <span className="inline-flex items-center gap-2">
                  <User className="size-4" />
                  {displayName}
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
              guestAuthLinks
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

                  <div className="mt-2 rounded-lg bg-slate-50 p-2">
                    <SheetClose asChild>
                      <Link
                        href="/products"
                        className="block rounded-md px-3 py-2 text-3xl font-medium text-slate-700 hover:bg-white"
                      >
                        All Categories
                      </Link>
                    </SheetClose>
                    {categoriesForMenu.map((category) => (
                      <SheetClose asChild key={`drawer-${category.label}`}>
                        <Link
                          href={category.href}
                          className="block rounded-md px-3 py-2 text-2xl font-medium text-slate-600 hover:bg-white"
                        >
                          {category.label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </nav>

                <div className="mt-4 space-y-3 border-b border-[#E5E7EB] pb-4">
                  {isLoggedIn ? (
                    <>
                      <SheetClose asChild>
                        <Link
                          href="/account"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-800"
                        >
                          <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#F1F5F9]">
                            <CircleUserRound className="size-5 text-slate-500" />
                          </span>
                          <span className="text-4xl font-medium">
                            {displayName}
                          </span>
                        </Link>
                      </SheetClose>
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
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link
                          href="/login"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-800 hover:bg-slate-50"
                        >
                          <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#F1F5F9]">
                            <User className="size-5 text-slate-500" />
                          </span>
                          <span className="text-4xl font-medium">Sign In</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link
                          href="/register"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-800 hover:bg-slate-50"
                        >
                          <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#F1F5F9]">
                            <UserPlus className="size-5 text-slate-500" />
                          </span>
                          <span className="text-4xl font-medium">Sign Up</span>
                        </Link>
                      </SheetClose>
                    </>
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
            <Link href="/" className="transition hover:text-[#16A34A]">
              Home
            </Link>
            <Link href="/products" className="transition hover:text-[#16A34A]">
              Shop
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setIsCategoriesOpen(true)}
              onMouseLeave={() => setIsCategoriesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 transition hover:text-[#16A34A]"
              >
                Categories
                <ChevronDown className="size-4" />
              </button>

              <div className="absolute left-0 top-full h-3 w-full bg-transparent" />

              {isCategoriesOpen ? (
                <div className="absolute left-0 top-full z-50 w-[250px] pt-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-[0_20px_50px_rgba(2,6,23,0.15)]">
                    <Link
                      href="/products"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-[28px] font-medium transition hover:bg-slate-50"
                    >
                      All Categories
                    </Link>

                    {categoriesForMenu.map((category) => (
                      <Link
                        key={category.label}
                        href={category.href}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="block rounded-xl px-3 py-2.5 text-[28px] font-medium transition hover:bg-slate-50"
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <Link href="/brands" className="transition hover:text-[#16A34A]">
              Brands
            </Link>
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
              className="relative p-1 transition hover:text-[#16A34A]"
            >
              <Heart className="size-7" />
              {wishlistData?.count ? (
                <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {wishlistData.count}
                </span>
              ) : null}
            </Link>
            <Link
              href="/cart"
              className="relative p-1 transition hover:text-[#16A34A]"
            >
              <ShoppingCart className="size-7" />
              {cartData?.numOfCartItems ? (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartData.numOfCartItems}
                </span>
              ) : null}
            </Link>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full px-2 py-1 text-slate-700 transition hover:bg-slate-100 hover:text-[#16A34A] cursor-pointer"
                    aria-label="Open account menu"
                  >
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                      <CircleUserRound className="size-4" />
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-72.5 bg-white p-2"
                >
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex size-11 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                        <CircleUserRound className="size-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-2xl font-semibold text-slate-900">
                          {displayName}
                        </p>
                        <p className="truncate text-xl text-slate-500">
                          {displayEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="w-full">
                      <User className="size-4 text-slate-400" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/allorders" className="w-full">
                      <ShoppingCart className="size-4 text-slate-400" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="w-full">
                      <Heart className="size-4 text-slate-400" />
                      My Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/addresses" className="w-full">
                      <MapPin className="size-4 text-slate-400" />
                      Addresses
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/settings" className="w-full">
                      <Settings className="size-4 text-slate-400" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault();
                      handleSignOut();
                    }}
                    className="text-red-500 focus:bg-red-50 focus:text-red-600"
                  >
                    <LogOut className="size-4 text-red-500" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-[#16A34A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#15803D]"
              >
                <User className="size-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 lg:hidden">
          <Link
            href="/wishlist"
            className="relative rounded-full p-2 text-slate-600"
          >
            <Heart className="size-5" />
            {wishlistData?.count ? (
              <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {wishlistData.count}
              </span>
            ) : null}
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full p-2 text-slate-600"
          >
            <ShoppingCart className="size-5" />
            {cartData?.numOfCartItems ? (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                {cartData.numOfCartItems}
              </span>
            ) : null}
          </Link>
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-[#16A34A] hover:text-[#16A34A]"
                  aria-label="Open account menu"
                >
                  <CircleUserRound className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={12}
                className="w-[280px] p-2"
              >
                <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                      <CircleUserRound className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xl font-semibold text-slate-900">
                        {displayName}
                      </p>
                      <p className="truncate text-lg text-slate-500">
                        {displayEmail}
                      </p>
                    </div>
                  </div>
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="w-full">
                    <User className="size-4 text-slate-400" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/allorders" className="w-full">
                    <ShoppingCart className="size-4 text-slate-400" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist" className="w-full">
                    <Heart className="size-4 text-slate-400" />
                    My Wishlist
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/addresses" className="w-full">
                    <MapPin className="size-4 text-slate-400" />
                    Addresses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/settings" className="w-full">
                    <Settings className="size-4 text-slate-400" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(event) => {
                    event.preventDefault();
                    handleSignOut();
                  }}
                  className="text-red-500 focus:bg-red-50 focus:text-red-600"
                >
                  <LogOut className="size-4 text-red-500" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login" className="rounded-full p-2 text-slate-600">
              <CircleUserRound className="size-5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
