"use client";

import Link from "next/link";
import { Package } from "lucide-react";

import ProductCard from "@/components/custom/ProductCard";
import { useGetProductsQuery } from "@/store/apiSlice";

function ProductCardSkeleton() {
  return (
    <div className="h-[340px] animate-pulse rounded-xl border border-slate-200 bg-white p-3">
      <div className="h-44 rounded-lg bg-slate-100" />
      <div className="mt-3 h-3 w-20 rounded bg-slate-100" />
      <div className="mt-2 h-5 w-3/4 rounded bg-slate-100" />
      <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
      <div className="mt-4 flex items-center justify-between">
        <div className="h-6 w-20 rounded bg-slate-100" />
        <div className="h-8 w-8 rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { data, isLoading, isError } = useGetProductsQuery();

  const products = data?.data ?? [];
  const productsCount = data?.results ?? products.length;

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <section className="bg-gradient-to-r from-[#16A34A] to-[#2CCB65] py-8 sm:py-10">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="mb-6 flex items-center gap-2 text-base text-green-50/90">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-white">All Products</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
              <Package className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-white">
                All Products
              </h1>
              <p className="mt-1 text-3xl text-green-100">
                Explore our complete product collection
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6">
        <p className="mb-6 text-3xl font-medium text-slate-500">
          Showing {productsCount} products
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Unable to load products
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Please refresh the page and try again.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
