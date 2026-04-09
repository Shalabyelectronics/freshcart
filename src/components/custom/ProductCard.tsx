"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, RefreshCw, Star, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  useAddToCartMutation,
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/apiSlice";
import type { Product } from "@/types/api";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const rating = product.ratingsAverage ?? 0;
  const ratingCount = product.ratingsQuantity ?? 0;
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [isWishlistPending, setIsWishlistPending] = useState(false);
  const { data: wishlistData } = useGetWishlistQuery();
  const [addToWishlist] = useAddToWishlistMutation();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  const isInWishlist = useMemo(() => {
    return Boolean(
      wishlistData?.data?.some((item) => item._id === product._id),
    );
  }, [product._id, wishlistData?.data]);

  const handleWishlistToggle = async () => {
    if (isWishlistPending) {
      return;
    }

    try {
      setIsWishlistPending(true);

      if (isInWishlist) {
        await removeFromWishlist(product._id).unwrap();
        toast.success("Removed from wishlist");
        return;
      }

      await addToWishlist({ productId: product._id }).unwrap();
      toast.success("Added to wishlist");
    } catch {
      toast.error("Wishlist action failed. Please try again.");
    } finally {
      setIsWishlistPending(false);
    }
  };

  return (
    <Link href={`/products/${product._id}`}>
      <article className="group rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-[0_3px_10px_rgba(15,23,42,0.03)] transition hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)] cursor-pointer h-full">
        <div className="relative overflow-hidden rounded-lg bg-[#F8FAFC]">
          <img
            src={product.imageCover}
            alt={product.title}
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute right-2 top-2 flex flex-col gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlistToggle();
              }}
              disabled={isWishlistPending}
              className="rounded-full bg-white/90 p-1.5 text-slate-500 hover:text-[#16A34A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isWishlistPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Heart
                  className={`size-3.5 ${
                    isInWishlist
                      ? "fill-red-500 text-red-500"
                      : "text-slate-500"
                  }`}
                />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast.info("Compare feature coming soon!");
              }}
              className="rounded-full bg-white/90 p-1.5 text-slate-500 hover:text-[#16A34A]"
            >
              <RefreshCw className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="rounded-full bg-white/90 p-1.5 text-slate-500 hover:text-[#16A34A]"
            >
              <Eye className="size-3.5" />
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          {product.category?.name ?? "General"}
        </p>
        <h3 className="mt-1 line-clamp-2 min-h-10 text-base font-semibold text-slate-800">
          {product.title}
        </h3>

        <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
          <Star className="size-3.5 fill-[#FACC15] text-[#FACC15]" />
          <span className="font-medium text-slate-700">
            {rating.toFixed(1)}
          </span>
          <span>({ratingCount})</span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-slate-900">
            {product.price} EGP
          </p>
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart({ productId: product._id })
                .unwrap()
                .then(() => {
                  toast.success("Added to Cart!");
                })
                .catch(() => {
                  toast.error("Failed to add to cart. Please try again.");
                });
            }}
            disabled={isLoading}
            className="h-8 w-8 rounded-full p-0 text-lg font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "#16A34A" }}
          >
            {isLoading ? "..." : "+"}+
          </Button>
        </div>
      </article>
    </Link>
  );
}
