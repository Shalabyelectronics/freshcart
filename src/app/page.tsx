"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
Truck,
  Mail,

  Tag,
 
} from "lucide-react";
import Link from "next/link";

import ProductCard from "@/components/custom/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
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
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

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

  useEffect(() => {
    if (!carouselApi) {
      return;
    }

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };

    onSelect();
    carouselApi.on("select", onSelect);

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  return (
    <main className="bg-[#F9FAFB] pb-12">
      <div className="mx-auto w-full max-w-[1280px] space-y-8 px-4 pt-4 md:px-6 md:pt-6 lg:space-y-10">
        <section>
          <Carousel
            opts={{ loop: true }}
            setApi={setCarouselApi}
            className="overflow-hidden rounded-none md:rounded-2xl"
          >
            <CarouselContent>
              {sliderItems.map((slide) => (
                <CarouselItem key={slide.image}>
                  <div className="relative h-[310px] w-full overflow-hidden rounded-none md:h-[430px] md:rounded-2xl">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#16A34A]/70" />

                    <div className="absolute left-6 top-8 z-10 max-w-md text-white md:left-10 md:top-12">
                      <h1 className="text-4xl leading-tight font-bold md:text-6xl">
                        {slide.title}
                      </h1>
                      <p className="mt-3 text-xl text-white/95 md:text-3xl">
                        {slide.subtitle}
                      </p>
                      <div className="mt-5 flex items-center gap-3">
                        <Button
                          className="h-11 rounded-xl px-6 text-base font-semibold"
                          style={{
                            backgroundColor: "#ffffff",
                            color: "#16A34A",
                          }}
                        >
                          Shop Now
                        </Button>
                        <Button
                          variant="outline"
                          className="h-11 rounded-xl border-white/75 bg-transparent px-6 text-base text-white hover:bg-white/10"
                        >
                          View Deals
                        </Button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-3 h-11 w-11 border-0" />
            <CarouselNext className="right-3 h-11 w-11 border-0" />

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
              {sliderItems.map((_, index) => (
                <button
                  key={`dot-${index}`}
                  type="button"
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`h-3 rounded-full transition-all ${
                    currentSlide === index ? "w-9 bg-white" : "w-3 bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </Carousel>
        </section>

 

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-3 text-4xl font-bold text-slate-900 md:text-[42px]">
              <span
                className="h-10 w-1.5 rounded-full"
                style={{ backgroundColor: "#16A34A" }}
              />
              Shop By <span style={{ color: "#16A34A" }}>Category</span>
            </h2>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-xl font-medium text-[#16A34A]"
            >
              View All Categories
              <ArrowRight className="size-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
            {filteredCategories.map((category) => (
              <article
                key={category._id}
                className="rounded-xl border border-[#E5E7EB] bg-white p-3 text-center shadow-[0_2px_8px_rgba(15,23,42,0.03)]"
              >
                <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-[#ECFDF5]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="mt-3 text-lg font-medium text-slate-800">
                  {category.name}
                </h3>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#059669] to-[#16A34A] p-6 text-white md:p-8">
            <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm">
              Deal of the Day
            </span>
            <h3 className="mt-3 text-4xl font-bold">Fresh Organic Fruits</h3>
            <p className="mt-2 text-lg text-white/90">
              Get up to 40% off on selected organic fruits
            </p>
            <p className="mt-4 text-5xl font-black">40% OFF</p>
            <p className="mt-1 text-sm">Use code: ORGANIC40</p>
            <Button className="mt-5 rounded-full bg-white px-5 font-semibold text-[#16A34A] hover:bg-white/90">
              Shop Now
              <ArrowRight className="size-4" />
            </Button>
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
          </article>

          <article className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#F97316] via-[#FB7185] to-[#F43F5E] p-6 text-white md:p-8">
            <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-sm">
              New Arrivals
            </span>
            <h3 className="mt-3 text-4xl font-bold">Exotic Vegetables</h3>
            <p className="mt-2 text-lg text-white/90">
              Discover our latest collection of premium vegetables
            </p>
            <p className="mt-4 text-5xl font-black">25% OFF</p>
            <p className="mt-1 text-sm">Use code: FRESH25</p>
            <Button className="mt-5 rounded-full bg-white px-5 font-semibold text-[#F97316] hover:bg-white/90">
              Explore Now
              <ArrowRight className="size-4" />
            </Button>
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
          </article>
        </section>

        <section className="space-y-5">
          <h2 className="flex items-center gap-3 text-4xl font-bold text-slate-900 md:text-[42px]">
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
                <p className="text-sm font-semibold tracking-wide text-[#16A34A] uppercase">
                  Newsletter
                </p>
                <p className="text-xl text-slate-500">50,000+ subscribers</p>
              </div>
            </div>

            <h3 className="mt-5 text-4xl leading-tight font-bold text-slate-900 md:text-6xl">
              Get the Freshest Updates{" "}
              <span style={{ color: "#16A34A" }}>Delivered Free</span>
            </h3>
            <p className="mt-3 text-2xl text-slate-500">
              Weekly recipes, seasonal offers & exclusive member perks.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-white px-4 py-2 text-lg text-slate-700">
                <BadgeCheck className="size-4 text-[#16A34A]" />
                Fresh Picks Weekly
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-white px-4 py-2 text-lg text-slate-700">
                <Truck className="size-4 text-[#16A34A]" />
                Free Delivery Codes
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-white px-4 py-2 text-lg text-slate-700">
                <Tag className="size-4 text-[#16A34A]" />
                Members-Only Deals
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <Input
                className="h-14 flex-1 rounded-2xl border-[#D1D5DB] bg-white px-5 text-lg"
                placeholder="you@example.com"
              />
              <Button
                className="h-14 rounded-2xl px-8 text-xl font-semibold text-white"
                style={{ backgroundColor: "#16A34A" }}
              >
                Subscribe
                <ArrowRight className="size-5" />
              </Button>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Unsubscribe anytime. No spam, ever.
            </p>
          </article>

          <article className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#112A4B] to-[#1E293B] p-6 text-white">
            <span className="inline-flex rounded-full border border-[#14B8A6]/40 bg-[#0F766E]/35 px-3 py-1 text-sm font-semibold text-[#2DD4BF] uppercase">
              Mobile App
            </span>
            <h3 className="mt-4 text-5xl font-bold">Shop Faster on Our App</h3>
            <p className="mt-3 text-2xl text-slate-300">
              Get app-exclusive deals & 15% off your first order.
            </p>

            <button
              type="button"
              className="mt-6 flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-left"
            >
              <span className="text-2xl"></span>
              <span>
                <p className="text-xs tracking-wide text-slate-300 uppercase">
                  Download on
                </p>
                <p className="text-3xl font-semibold">App Store</p>
              </span>
            </button>
            <button
              type="button"
              className="mt-4 flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 text-left"
            >
              <span className="text-2xl">▶</span>
              <span>
                <p className="text-xs tracking-wide text-slate-300 uppercase">
                  Get it on
                </p>
                <p className="text-3xl font-semibold">Google Play</p>
              </span>
            </button>

            <p className="mt-5 text-xl text-slate-300">
              ★★★★★ 4.9 · 100K+ downloads
            </p>
          </article>
        </section>

      
      </div>
    </main>
  );
}
