"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Grid3X3, List, Search, SlidersHorizontal } from "lucide-react";

import ProductCard from "@/components/custom/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  useGetBrandsQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetSpecificBrandQuery,
} from "@/store/apiSlice";

type ViewMode = "grid" | "list";

const QUICK_MAX_PRICE_OPTIONS = [
  { label: "Under 500", value: 500 },
  { label: "Under 1K", value: 1000 },
  { label: "Under 5K", value: 5000 },
  { label: "Under 10K", value: 10000 },
];

const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Price: Low to High", value: "price" },
  { label: "Price: High to Low", value: "-price" },
  { label: "Top Rated", value: "-ratingsAverage" },
  { label: "Newest", value: "-createdAt" },
];

function ProductCardSkeleton() {
  return (
    <div className="h-85 animate-pulse rounded-xl border border-slate-200 bg-white p-3">
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

function ProductsPageLoadingFallback() {
  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <section className="border-b border-slate-200 bg-white py-6">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="mb-4 flex items-center gap-2 text-base text-slate-500">
            <span>Home</span>
            <span>/</span>
            <span className="font-semibold text-slate-700">Search Results</span>
          </div>
          <div className="max-w-3xl">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                disabled
                className="h-13 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4"
              />
            </div>
            <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
              Search Results
            </h1>
            <p className="mt-2 text-xl text-slate-500">
              We found products for you
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-5">
            <div className="space-y-3">
              <div className="h-5 w-32 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-10 w-44 animate-pulse rounded-xl bg-slate-100" />
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageLoadingFallback />}>
      <ProductsPageContent />
    </Suspense>
  );
}

function FiltersPanel({
  categories,
  brands,
  selectedCategoryId,
  selectedBrandId,
  minPriceParam,
  maxPriceParam,
  setCategory,
  setBrand,
  setMinPrice,
  setMaxPrice,
  clearAllFilters,
}: {
  categories: Array<{ _id: string; name: string }>;
  brands: Array<{ _id: string; name: string }>;
  selectedCategoryId?: string;
  selectedBrandId?: string;
  minPriceParam?: string;
  maxPriceParam?: string;
  setCategory: (value?: string) => void;
  setBrand: (value?: string) => void;
  setMinPrice: (value?: string) => void;
  setMaxPrice: (value?: string) => void;
  clearAllFilters: () => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_6px_24px_rgba(15,23,42,0.04)]">
      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Categories</h3>
        <div className="mt-4 max-h-55 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar]:w-1">
          {categories.map((category) => (
            <label
              key={category._id}
              className="flex cursor-pointer items-center gap-3 text-lg text-slate-600"
            >
              <input
                type="checkbox"
                checked={selectedCategoryId === category._id}
                onChange={() =>
                  setCategory(
                    selectedCategoryId === category._id
                      ? undefined
                      : category._id,
                  )
                }
                className="size-5 rounded border-slate-300 text-[#16A34A] focus:ring-[#16A34A]"
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="my-5 border-t border-slate-200" />

      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Price Range</h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-slate-500">Min (EGP)</label>
            <input
              value={minPriceParam ?? ""}
              onChange={(event) => {
                const value = event.target.value.replace(/[^\d]/g, "");
                setMinPrice(value || undefined);
              }}
              placeholder="0"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-[#16A34A]"
            />
          </div>
          <div>
            <label className="text-sm text-slate-500">Max (EGP)</label>
            <input
              value={maxPriceParam ?? ""}
              onChange={(event) => {
                const value = event.target.value.replace(/[^\d]/g, "");
                setMaxPrice(value || undefined);
              }}
              placeholder="No limit"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 px-3 text-base outline-none focus:border-[#16A34A]"
            />
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {QUICK_MAX_PRICE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMaxPrice(String(option.value))}
              className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="my-5 border-t border-slate-200" />

      <div>
        <h3 className="text-2xl font-semibold text-slate-900">Brands</h3>
        <div className="mt-4 max-h-55 space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar]:w-1">
          {brands.map((brand) => (
            <label
              key={brand._id}
              className="flex cursor-pointer items-center gap-3 text-lg text-slate-600"
            >
              <input
                type="checkbox"
                checked={selectedBrandId === brand._id}
                onChange={() =>
                  setBrand(
                    selectedBrandId === brand._id ? undefined : brand._id,
                  )
                }
                className="size-5 rounded border-slate-300 text-[#16A34A] focus:ring-[#16A34A]"
              />
              <span>{brand.name}</span>
            </label>
          ))}
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={clearAllFilters}
        className="mt-6 h-11 w-full rounded-xl border-slate-200 text-base font-semibold text-slate-700"
      >
        Clear All
      </Button>
    </div>
  );
}

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const keyword = searchParams.get("keyword")?.trim() || undefined;
  const selectedBrandId = searchParams.get("brand") ?? undefined;
  const selectedCategoryId = searchParams.get("category") ?? undefined;
  const sort = searchParams.get("sort") ?? undefined;
  const minPriceParam = searchParams.get("minPrice") ?? undefined;
  const maxPriceParam = searchParams.get("maxPrice") ?? undefined;

  const parsedMinPrice = minPriceParam ? Number(minPriceParam) : undefined;
  const parsedMaxPrice = maxPriceParam ? Number(maxPriceParam) : undefined;

  const minPrice =
    typeof parsedMinPrice === "number" && !Number.isNaN(parsedMinPrice)
      ? parsedMinPrice
      : undefined;
  const maxPrice =
    typeof parsedMaxPrice === "number" && !Number.isNaN(parsedMaxPrice)
      ? parsedMaxPrice
      : undefined;

  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();
  const { data: selectedBrandData } = useGetSpecificBrandQuery(
    selectedBrandId ?? "",
    {
      skip: !selectedBrandId,
    },
  );

  const categoryName = useMemo(() => {
    if (!selectedCategoryId) {
      return undefined;
    }

    return categoriesData?.data?.find((item) => item._id === selectedCategoryId)
      ?.name;
  }, [categoriesData?.data, selectedCategoryId]);

  const brandName = selectedBrandData?.data?.name;

  const [keywordInput, setKeywordInput] = useState(keyword ?? "");

  useEffect(() => {
    setKeywordInput(keyword ?? "");
  }, [keyword]);

  const updateSearchParams = (updates: Record<string, string | undefined>) => {
    const nextParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value) {
        nextParams.delete(key);
        return;
      }

      nextParams.set(key, value);
    });

    const query = nextParams.toString();
    router.push(query ? `/products?${query}` : "/products");
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateSearchParams({ keyword: keywordInput.trim() || undefined });
  };

  const clearAllFilters = () => {
    router.push("/products");
  };

  const queryParams = useMemo(() => {
    const hasAnyFilter = Boolean(
      keyword ||
      selectedCategoryId ||
      selectedBrandId ||
      sort ||
      minPrice !== undefined ||
      maxPrice !== undefined,
    );

    if (!hasAnyFilter) {
      return undefined;
    }

    return {
      keyword,
      category: selectedCategoryId,
      brand: selectedBrandId,
      minPrice,
      maxPrice,
      sort,
    };
  }, [keyword, selectedCategoryId, selectedBrandId, minPrice, maxPrice, sort]);

  const { data, isLoading, isFetching, isError } =
    useGetProductsQuery(queryParams);

  const products = data?.data ?? [];
  const productsCount = data?.results ?? products.length;

  const headingTitle = keyword
    ? `Search Results for "${keyword}"`
    : selectedBrandId
      ? brandName
        ? `${brandName} Products`
        : "Brand Results"
      : selectedCategoryId
        ? categoryName
          ? `${categoryName} Products`
          : "Category Results"
        : "Search Results";

  const headingSubtitle = keyword
    ? `We found ${productsCount} product${productsCount === 1 ? "" : "s"} for you`
    : selectedBrandId
      ? `We found ${productsCount} product${productsCount === 1 ? "" : "s"} for ${brandName ?? "this brand"}`
      : selectedCategoryId
        ? `We found ${productsCount} product${productsCount === 1 ? "" : "s"} in ${categoryName ?? "this category"}`
        : `We found ${productsCount} product${productsCount === 1 ? "" : "s"} for you`;

  const activeFilters: Array<{ key: string; label: string }> = [
    ...(keyword ? [{ key: "keyword", label: `"${keyword}"` }] : []),
    ...(selectedCategoryId
      ? [{ key: "category", label: categoryName ?? "Category" }]
      : []),
    ...(selectedBrandId ? [{ key: "brand", label: brandName ?? "Brand" }] : []),
    ...(minPrice !== undefined
      ? [{ key: "minPrice", label: `Min ${minPrice}` }]
      : []),
    ...(maxPrice !== undefined
      ? [{ key: "maxPrice", label: `Max ${maxPrice}` }]
      : []),
  ];

  return (
    <main className="min-h-screen bg-[#F8F9FB]">
      <section className="border-b border-slate-200 bg-white py-6">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="mb-4 flex items-center gap-2 text-base text-slate-500">
            <Link href="/" className="hover:text-slate-700">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700">Search Results</span>
          </div>

          <div className="max-w-3xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400" />
              <input
                value={keywordInput}
                onChange={(event) => setKeywordInput(event.target.value)}
                placeholder="Search products..."
                className="h-13 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-lg outline-none focus:border-[#16A34A]"
              />
            </form>

            <h1 className="mt-4 text-5xl font-bold tracking-tight text-slate-900">
              {headingTitle}
            </h1>
            <p className="mt-2 text-xl text-slate-500">{headingSubtitle}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="grid gap-6 lg:grid-cols-[25%_1fr] lg:items-start">
          <aside className="hidden lg:sticky lg:top-30 lg:block">
            <FiltersPanel
              categories={categoriesData?.data ?? []}
              brands={brandsData?.data ?? []}
              selectedCategoryId={selectedCategoryId}
              selectedBrandId={selectedBrandId}
              minPriceParam={minPriceParam}
              maxPriceParam={maxPriceParam}
              setCategory={(value) => updateSearchParams({ category: value })}
              setBrand={(value) => updateSearchParams({ brand: value })}
              setMinPrice={(value) => updateSearchParams({ minPrice: value })}
              setMaxPrice={(value) => updateSearchParams({ maxPrice: value })}
              clearAllFilters={clearAllFilters}
            />
          </aside>

          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10 rounded-xl border-slate-200 px-4"
                  >
                    <SlidersHorizontal className="size-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader className="mb-4">
                    <SheetTitle className="text-xl">Filters</SheetTitle>
                  </SheetHeader>
                  <FiltersPanel
                    categories={categoriesData?.data ?? []}
                    brands={brandsData?.data ?? []}
                    selectedCategoryId={selectedCategoryId}
                    selectedBrandId={selectedBrandId}
                    minPriceParam={minPriceParam}
                    maxPriceParam={maxPriceParam}
                    setCategory={(value) =>
                      updateSearchParams({ category: value })
                    }
                    setBrand={(value) => updateSearchParams({ brand: value })}
                    setMinPrice={(value) =>
                      updateSearchParams({ minPrice: value })
                    }
                    setMaxPrice={(value) =>
                      updateSearchParams({ maxPrice: value })
                    }
                    clearAllFilters={clearAllFilters}
                  />
                </SheetContent>
              </Sheet>

              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex size-9 items-center justify-center rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-[#16A34A] text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Grid3X3 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`inline-flex size-9 items-center justify-center rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-[#16A34A] text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <List className="size-4" />
                </button>
              </div>

              <div className="ml-auto flex items-center gap-2 text-slate-500">
                <span className="text-sm font-medium">Sort by:</span>
                <select
                  value={sort ?? ""}
                  onChange={(event) =>
                    updateSearchParams({
                      sort: event.target.value || undefined,
                    })
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#16A34A]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option
                      key={option.value || "relevance"}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4 hidden items-center justify-between lg:flex">
              <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex size-9 items-center justify-center rounded-lg transition ${
                    viewMode === "grid"
                      ? "bg-[#16A34A] text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Grid3X3 className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`inline-flex size-9 items-center justify-center rounded-lg transition ${
                    viewMode === "list"
                      ? "bg-[#16A34A] text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <List className="size-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-500">
                <span className="text-sm font-medium">Sort by:</span>
                <select
                  value={sort ?? ""}
                  onChange={(event) =>
                    updateSearchParams({
                      sort: event.target.value || undefined,
                    })
                  }
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#16A34A]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option
                      key={option.value || "relevance"}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeFilters.length > 0 ? (
              <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-600">
                  <Filter className="size-4" />
                  Active:
                </span>
                {activeFilters.map((filterItem) => (
                  <span
                    key={filterItem.key}
                    className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600"
                  >
                    {filterItem.label}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="text-slate-500 underline underline-offset-2 hover:text-[#16A34A]"
                >
                  Clear all
                </button>
              </div>
            ) : null}

            {isLoading || isFetching ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
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
            ) : products.length === 0 ? (
              <div className="flex min-h-[52vh] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="text-center">
                  <div className="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Search className="size-10" />
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900">
                    No Products Found
                  </h2>
                  <p className="mt-3 text-xl text-slate-500">
                    Try adjusting your search or filters to find what you're
                    looking for.
                  </p>
                  <Button
                    type="button"
                    onClick={clearAllFilters}
                    className="mt-6 h-12 rounded-xl bg-[#16A34A] px-8 text-base font-semibold text-white hover:bg-[#15803D]"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={`grid gap-4 ${
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1 md:grid-cols-2"
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
