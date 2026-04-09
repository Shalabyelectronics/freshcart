"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  DollarSign,
  Loader2,
  Package2,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useGetUserOrdersQuery } from "@/store/apiSlice";

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center text-slate-600">
        <Loader2 className="size-7 animate-spin text-green-600" />
        <p className="text-sm font-medium">Loading your orders...</p>
      </div>
    </div>
  );
}

export default function AllOrdersPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const token =
      window.localStorage.getItem("userToken") ||
      window.localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    setIsLoggedIn(true);
    setIsMounted(true);
  }, [router]);

  const {
    data: ordersResponse,
    isLoading,
    isError,
  } = useGetUserOrdersQuery(undefined, {
    skip: !isMounted || !isLoggedIn,
  });

  if (!isMounted || !isLoggedIn || isLoading) {
    return <PageLoader />;
  }

  if (isError || !ordersResponse) {
    return (
      <main className="min-h-screen bg-[#f7f8f3] px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/products"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="size-4" />
            Back to Shopping
          </Link>

          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-full bg-red-100 p-2">
                <Package2 className="size-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                Unable to Load Orders
              </h2>
            </div>
            <p className="text-sm text-slate-600">
              We encountered an error loading your orders. Please try again
              later.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const orders = ordersResponse?.data ?? [];

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#f7f8f3] px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/products"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="size-4" />
            Back to Shopping
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <ShoppingBag className="mx-auto mb-4 size-12 text-slate-300" />
            <h2 className="text-2xl font-semibold text-slate-900">
              No Orders Yet
            </h2>
            <p className="mt-3 text-slate-600">
              You haven't placed any orders yet. Start shopping to create your
              first order!
            </p>
            <Button
              asChild
              className="mt-6 bg-green-600 text-white hover:bg-green-700"
            >
              <Link href="/products">Start Shopping</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f3] px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Your Orders
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Track and manage all your purchases
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="size-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="space-y-4">
          {orders.map((order) => {
            const orderDate = new Date(order.createdAt);
            const formattedDate = orderDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            });
            const formattedTime = orderDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            const statusColor = order.isDelivered
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : order.isPaid
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-yellow-50 border-yellow-200 text-yellow-700";

            const statusLabel = order.isDelivered
              ? "Delivered"
              : order.isPaid
                ? "Processing"
                : "Pending Payment";

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5">
                  {/* Order ID */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase">
                      Order ID
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold text-slate-900">
                      {order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase">
                      <Calendar className="size-3" />
                      Date
                    </p>
                    <p className="mt-1 text-sm text-slate-700">
                      {formattedDate}
                    </p>
                    <p className="text-xs text-slate-500">{formattedTime}</p>
                  </div>

                  {/* Total Price */}
                  <div>
                    <p className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase">
                      <DollarSign className="size-3" />
                      Total
                    </p>
                    <p className="mt-1 text-sm font-semibold text-green-700">
                      {order.totalOrderPrice.toLocaleString()} EGP
                    </p>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <p className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase">
                      <CreditCard className="size-3" />
                      Payment
                    </p>
                    <p className="mt-1 text-sm text-slate-700 capitalize">
                      {order.paymentMethodType === "cash"
                        ? "Cash on Delivery"
                        : "Card Payment"}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="flex items-center gap-1 text-xs font-semibold text-slate-500 uppercase">
                      <Truck className="size-3" />
                      Status
                    </p>
                    <div
                      className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusColor}`}
                    >
                      {statusLabel}
                    </div>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="border-t border-slate-100 px-5 py-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    Order Items ({order.cartItems.length})
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {order.cartItems.slice(0, 3).map((item, idx) => (
                      <div
                        key={item._id}
                        className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"
                      >
                        <span className="text-xs font-medium text-slate-600">
                          {idx + 1}.
                        </span>
                        <span className="text-xs text-slate-700">
                          x{item.count} @ {item.price} EGP
                        </span>
                      </div>
                    ))}
                    {order.cartItems.length > 3 && (
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2">
                        <span className="text-xs font-medium text-slate-600">
                          +{order.cartItems.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-4">
          <p className="text-sm text-emerald-700">
            ✓ Thank you for your business! If you have any questions about your
            orders, please contact our support team.
          </p>
        </div>
      </div>
    </main>
  );
}
