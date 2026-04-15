"use client";

import { useMemo } from "react";
import { ArrowRight, BadgeCheck, Truck, Mail, Tag } from "lucide-react";
import Link from "next/link";

import ProductCard from "@/components/custom/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselIndicators,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { useGetCategoriesQuery, useGetProductsQuery } from "@/store/apiSlice";

const sliderItems = [
  {
    image: "/assets/images/slidebar_1.jpg",
    title: "Fresh Products Delivered to your Door",
    subtitle: "Get 20% off your first order",
  },
  {
    image: "/assets/images/slidebar_2.jpg",
    title: "Seasonal Picks for Your Kitchen",
    subtitle: "Handpicked weekly deals for your family",
  },
  {
    image: "/assets/images/slidebar_3.jpg",
    title: "Everyday Essentials, Better Prices",
    subtitle: "Save more with fresh quality groceries",
  },
];

const categoryOrder = [
  "Music",
  "Men's Fashion",
  "Women's Fashion",
  "SuperMarket",
  "Baby & Toys",
  "Home",
  "Books",
  "Beauty & Health",
  "Mobiles",
  "Electronics",
];

export default function Home() {
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: productsData } = useGetProductsQuery();

  const filteredCategories = useMemo(() => {
    if (!categoriesData?.data) {
      return [];
    }

    const lookup = new Map(
      categoriesData.data.map((category) => [
        category.name.toLowerCase(),
        category,
      ]),
    );

    return categoryOrder
      .map((name) => lookup.get(name.toLowerCase()))
      .filter((item): item is NonNullable<typeof item> => Boolean(item));
  }, [categoriesData]);

  const featuredProducts = useMemo(() => {
    return productsData?.data?.slice(0, 12) ?? [];
  }, [productsData]);

  return (
    <main className="bg-[#F9FAFB] pb-12">
      <section className="w-full">
        <Carousel
          opts={{ loop: true, watchDrag: true }}
          draggable
          className="overflow-hidden"
        >
          <CarouselContent>
            {sliderItems.map((slide) => (
              <CarouselItem key={slide.image}>
                <div className="relative h-77.5 w-full overflow-hidden rounded-none md:h-107.5">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#16A34A]/70" />

                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center pb-12">
                    <div className="w-full px-6 text-white md:px-10">
                      <div className="pointer-events-auto max-w-md">
                        <h1 className="text-type-max font-bold">
                          {slide.title}
                        </h1>
                        <p className="mt-3 text-type-md-lg text-white/95">
                          {slide.subtitle}
                        </p>
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                          <Button
                            className="text-type-base h-11 rounded-xl px-6  font-semibold"
                            style={{
                              backgroundColor: "#ffffff",
                              color: "#16A34A",
                            }}
                          >
                            Shop Now
                          </Button>
                          <Button
                            variant="outline"
                            className="text-type-base h-11 rounded-xl border-white/75 bg-transparent px-6 text-white hover:bg-white/10"
                          >
                            View Deals
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="left-3 hidden h-11 w-11 cursor-pointer border-0 md:flex" />
          <CarouselNext className="right-3 hidden h-11 w-11 cursor-pointer border-0 md:flex" />
          <CarouselIndicators className="bottom-6 md:bottom-6" />
        </Carousel>
      </section>
      <div className="mx-auto w-full max-w-[1280px] space-y-8 px-4 pt-4 md:px-6 md:pt-6 lg:space-y-10">
        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-type-max flex items-center gap-3 font-bold text-slate-900">
              <span
                className="h-10 w-1.5 rounded-full"
                style={{ backgroundColor: "#16A34A" }}
              />
              Shop By <span style={{ color: "#16A34A" }}>Category</span>
            </h2>
            <Link
              href="/categories"
              className="text-type-md-lg inline-flex items-center gap-2 font-medium text-[#16A34A]"
            >
              View All Categories
              <ArrowRight className="size-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
            {filteredCategories.map((category) => (
              <Link
                key={category._id}
                href={`/products?category=${encodeURIComponent(category._id)}`}
                className="block rounded-xl border border-[#E5E7EB] bg-white p-3 text-center shadow-[0_2px_8px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#BBF7D0] hover:shadow-[0_6px_16px_rgba(22,163,74,0.10)]"
              >
                <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-[#ECFDF5]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-type-md mt-3 font-medium text-slate-800">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#059669] to-[#16A34A] p-6 text-white md:p-8">
            <span className="text-type-sm inline-flex rounded-full bg-white/20 px-3 py-1">
              Deal of the Day
            </span>
            <h3 className="text-type-lg mt-3 font-bold">
              Fresh Organic Fruits
            </h3>
            <p className="text-type-md mt-2 text-white/90">
              Get up to 40% off on selected organic fruits
            </p>
            <p className="text-type-max mt-4 font-black">40% OFF</p>
            <p className="text-type-sm mt-1">Use code: ORGANIC40</p>
            <Button className="mt-5 rounded-full bg-white px-5 font-semibold text-[#16A34A] hover:bg-white/90">
              Shop Now
              <ArrowRight className="size-4" />
            </Button>
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
          </article>

          <article className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#F97316] via-[#FB7185] to-[#F43F5E] p-6 text-white md:p-8">
            <span className="text-type-sm inline-flex rounded-full bg-white/20 px-3 py-1">
              New Arrivals
            </span>
            <h3 className="text-type-lg mt-3 font-bold">Exotic Vegetables</h3>
            <p className="text-type-md mt-2 text-white/90">
              Discover our latest collection of premium vegetables
            </p>
            <p className="text-type-max mt-4 font-black">25% OFF</p>
            <p className="text-type-sm mt-1">Use code: FRESH25</p>
            <Button className="mt-5 rounded-full bg-white px-5 font-semibold text-[#F97316] hover:bg-white/90">
              Explore Now
              <ArrowRight className="size-4" />
            </Button>
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
          </article>
        </section>

        <section className="space-y-5">
          <h2 className="text-type-max flex items-center gap-3 font-bold text-slate-900">
            <span
              className="h-10 w-1.5 rounded-full"
              style={{ backgroundColor: "#16A34A" }}
            />
            Featured <span style={{ color: "#16A34A" }}>Products</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 rounded-3xl border border-[#D1FAE5] bg-gradient-to-r from-[#F0FDF4] via-[#F8FAFC] to-[#ECFEFF] p-5 md:p-8 xl:grid-cols-[1.45fr_1fr]">
          <article>
            <div className="inline-flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-[#14B8A6] text-white">
                <Mail className="size-5" />
              </span>
              <div>
                <p className="text-type-sm font-semibold tracking-wide text-[#16A34A] uppercase">
                  Newsletter
                </p>
                <p className="text-type-md-lg text-slate-500">
                  50,000+ subscribers
                </p>
              </div>
            </div>

            <h3 className="text-type-max mt-5 font-bold text-slate-900">
              Get the Freshest Updates{" "}
              <span style={{ color: "#16A34A" }}>Delivered Free</span>
            </h3>
            <p className="text-type-md-lg mt-3 text-slate-500">
              Weekly recipes, seasonal offers & exclusive member perks.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="text-type-md inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-white px-4 py-2 text-slate-700">
                <BadgeCheck className="size-4 text-[#16A34A]" />
                Fresh Picks Weekly
              </span>
              <span className="text-type-md inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-white px-4 py-2 text-slate-700">
                <Truck className="size-4 text-[#16A34A]" />
                Free Delivery Codes
              </span>
              <span className="text-type-md inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-white px-4 py-2 text-slate-700">
                <Tag className="size-4 text-[#16A34A]" />
                Members-Only Deals
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <Input
                className="text-type-base h-14 flex-1 rounded-2xl border-[#D1D5DB] bg-white px-5"
                placeholder="you@example.com"
              />
              <Button
                className="text-type-md-lg h-14 rounded-2xl px-8 font-semibold text-white"
                style={{ backgroundColor: "#16A34A" }}
              >
                Subscribe
                <ArrowRight className="size-5" />
              </Button>
            </div>
            <p className="text-type-sm mt-3 text-slate-500">
              Unsubscribe anytime. No spam, ever.
            </p>
          </article>

          <article className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#112A4B] to-[#1E293B] p-6 text-white">
            <span className="text-type-sm inline-flex rounded-full border border-[#14B8A6]/40 bg-[#0F766E]/35 px-3 py-1 font-semibold text-[#2DD4BF] uppercase">
              Mobile App
            </span>
            <h3 className="text-type-max mt-4 font-bold">
              Shop Faster on Our App
            </h3>
            <p className="text-type-md-lg mt-3 text-slate-300">
              Get app-exclusive deals & 15% off your first order.
            </p>

            <button
              type="button"
              className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-left"
            >
              <span className="text-2xl"></span>
              <span>
                <p className="text-type-min tracking-wide text-slate-300 uppercase">
                  Download on
                </p>
                <p className="text-type-lg font-semibold">App Store</p>
              </span>
            </button>
            <button
              type="button"
              className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-left"
            >
              <span className="text-2xl">▶</span>
              <span>
                <p className="text-type-min tracking-wide text-slate-300 uppercase">
                  Get it on
                </p>
                <p className="text-type-lg font-semibold">Google Play</p>
              </span>
            </button>

            <p className="text-type-md-lg mt-5 text-slate-300">
              ★★★★★ 4.9 · 100K+ downloads
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
