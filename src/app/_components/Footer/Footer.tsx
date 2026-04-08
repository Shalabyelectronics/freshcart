import {
  Globe,
  Mail,
  MessageCircle,
  MapPin,
  Play,
  Phone,
  Camera,
  CreditCard,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headset
} from "lucide-react";
import Link from "next/link";

const SHOP_LINKS = [
  "All Products",
  "Categories",
  "Brands",
  "Electronics",
  "Men's Fashion",
  "Women's Fashion",
];
const ACCOUNT_LINKS = [
  "My Account",
  "Order History",
  "Wishlist",
  "Shopping Cart",
  "Sign In",
  "Create Account",
];
const SUPPORT_LINKS = [
  "Contact Us",
  "Help Center",
  "Shipping Info",
  "Returns & Refunds",
  "Track Order",
];
const sectionServices = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over 500 EGP",
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    description: "100% secure transactions",
    color: "#16A34A",
    bg: "#ECFDF5",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "14-day return policy",
    color: "#F97316",
    bg: "#FFF7ED",
  },
  {
    icon: Headset,
    title: "24/7 Support",
    description: "Dedicated support team",
    color: "#A855F7",
    bg: "#FAF5FF",
  },
];
const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

export default function Footer() {
  return (
    <footer className="mt-10" >
        <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
            <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {sectionServices.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-full"
                    style={{ color: item.color, backgroundColor: item.bg }}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {item.title}
                    </h3>
                    <p className="text-base text-slate-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
        </div>
        <div className="inner-footer  bg-linear-to-r from-[#0B1227] to-[#0F172A] text-slate-300">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-6">
          <section className="space-y-4 xl:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-2xl font-bold text-slate-800">
              <span className="text-[#16A34A]">🛒</span>
              FreshCart
            </div>

            <p className="max-w-md text-md leading-9 text-slate-400">
              FreshCart is your one-stop destination for quality products. From
              fashion to electronics, we bring you the best brands at
              competitive prices with a seamless shopping experience.
            </p>

            <div className="space-y-3 text-md">
              <p className="inline-flex items-center gap-3">
                <Phone className="size-5 text-[#22C55E]" />
                +1 (800) 123-4567
              </p>
              <p className="inline-flex items-center gap-3">
                <Mail className="size-5 text-[#22C55E]" />
                support@freshcart.com
              </p>
              <p className="inline-flex items-center gap-3">
                <MapPin className="size-5 text-[#22C55E]" />
                123 Commerce Street, New York, NY 10001
              </p>
            </div>

            <div className="flex items-center gap-3">
              {[Globe, MessageCircle, Camera, Play].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="inline-flex size-12 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-white">Shop</h3>
            <ul className="mt-4 space-y-3 text-md text-slate-400">
              {SHOP_LINKS.map((item) => (
                <li key={item}>
                  <Link href="#" className="transition hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-white">Account</h3>
            <ul className="mt-4 space-y-3 text-md text-slate-400">
              {ACCOUNT_LINKS.map((item) => (
                <li key={item}>
                  <Link href="#" className="transition hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-3 text-md text-slate-400">
              {SUPPORT_LINKS.map((item) => (
                <li key={item}>
                  <Link href="#" className="transition hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-2xl font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-3 text-md text-slate-400">
              {LEGAL_LINKS.map((item) => (
                <li key={item}>
                  <Link href="#" className="transition hover:text-white">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-sm text-slate-400 md:flex-row md:px-6">
          <p>© 2026 FreshCart. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {["Visa", "Mastercard", "PayPal"].map((payment) => (
              <span key={payment} className="inline-flex items-center gap-2">
                <CreditCard className="size-5" />
                {payment}
              </span>
            ))}
          </div>
        </div>
      </div>
      </div>
    </footer>
  );
}
