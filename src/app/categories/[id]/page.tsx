"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, FolderOpen } from "lucide-react";

import {
  useGetSpecificCategoryQuery,
  useGetSubCategoriesOnCategoryQuery,
} from "@/store/apiSlice";

export default function CategorySubCategoriesPage() {
  const params = useParams();
  const categoryId = params?.id as string;

  const { data: categoryResponse } = useGetSpecificCategoryQuery(categoryId, {
    skip: !categoryId,
  });

  const {
    data: subCategoriesResponse,
    isLoading,
    isError,
  } = useGetSubCategoriesOnCategoryQuery(categoryId, {
    skip: !categoryId,
  });

  const categoryName = categoryResponse?.data?.name ?? "Category";
  const subCategories = subCategoriesResponse?.data ?? [];

  return (
    <main className="min-h-screen bg-[#F8F9FB] py-8">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-base font-medium text-slate-600 hover:text-[#16A34A]"
        >
          <ArrowLeft className="size-4" />
          Back to Categories
        </Link>

        <section className="mt-5 rounded-3xl bg-linear-to-r from-[#16A34A] to-[#2CCB65] px-6 py-8 text-white">
          <h1 className="text-4xl font-bold tracking-tight">{categoryName}</h1>
          <p className="mt-2 text-xl text-green-100">
            {subCategories.length} Subcategories in {categoryName}
          </p>
        </section>

        <section className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-34 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-white p-6 text-center text-slate-600">
              Unable to load subcategories. Please try again.
            </div>
          ) : subCategories.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <FolderOpen className="mx-auto size-10 text-slate-300" />
              <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                No Subcategories Found
              </h2>
              <p className="mt-2 text-slate-500">
                This category does not have any subcategories yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {subCategories.map((subCategory) => (
                <article
                  key={subCategory._id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_6px_18px_rgba(15,23,42,0.05)]"
                >
                  <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#E8F7EE] text-[#16A34A]">
                    <FolderOpen className="size-6" />
                  </div>
                  <h3 className="text-3xl font-semibold text-slate-900">
                    {subCategory.name}
                  </h3>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
