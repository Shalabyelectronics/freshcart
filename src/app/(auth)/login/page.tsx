"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSignInMutation } from "@/store/apiSlice";
import { notifyAuthStateChanged } from "@/hooks/useAuthState";
import { LoginSchema, type LoginFormValues } from "@/types/schemas";

const BRAND_GREEN = "#16A34A";

function getApiErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Something went wrong. Please try again.";
  }

  const maybeData = (error as { data?: { message?: string } }).data;
  if (maybeData?.message) {
    return maybeData.message;
  }

  const maybeError = (error as { error?: string }).error;
  if (maybeError) {
    return maybeError;
  }

  return "Something went wrong. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();
  const [signin, { isLoading }] = useSignInMutation();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  function handleSocialLoginClick() {
    toast.info("Social Login will be available soon!");
  }

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await signin(values).unwrap();

      if (typeof window !== "undefined") {
        window.localStorage.setItem("userToken", response.token);
        window.localStorage.setItem("token", response.token);
        window.localStorage.setItem("userName", response.user.name);
        window.localStorage.setItem("userEmail", response.user.email);
        window.localStorage.setItem("userData", JSON.stringify(response.user));
      }

      notifyAuthStateChanged();

      toast.success("Signed in successfully.");
      router.push("/");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-7xl items-center px-4 py-6 md:px-6 md:py-8">
      <section className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <aside className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm md:p-5">
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-[#F8FAFC] via-white to-[#ECFDF5] p-5 md:p-7">
            <div className="absolute right-6 top-6 h-28 w-28 rounded-full bg-[#DCFCE7] blur-2xl" />
            <div className="absolute bottom-6 left-8 h-20 w-20 rounded-full bg-[#BBF7D0] blur-2xl" />

            <div className="relative flex min-h-92 items-center justify-center">
              <div className="relative h-72 w-full max-w-104 rounded-[2rem] border border-white/70 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
                <div className="absolute inset-x-6 top-6 h-40 rounded-[1.75rem] bg-linear-to-br from-[#F0FDF4] to-[#DCFCE7]" />
                <div className="absolute left-1/2 top-18 h-44 w-44 -translate-x-1/2 rounded-full bg-[#BBF7D0] opacity-40 blur-2xl" />
                <div className="absolute left-1/2 top-[5.2rem] -translate-x-1/2 text-[#16A34A]">
                  <ShoppingBag className="size-24 drop-shadow-sm" />
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                      <ShieldCheck className="size-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-700">
                        Secure Checkout
                      </p>
                      <p className="text-xs text-slate-500">
                        Protected by FreshCart
                      </p>
                    </div>
                  </div>
                  <Sparkles className="size-5 text-[#16A34A]" />
                </div>
              </div>
            </div>
          </div>

          <div className="px-1 pt-5 text-center lg:text-left">
            <h1 className="text-3xl leading-tight font-bold text-slate-800 md:text-4xl">
              FreshCart - Your One-Stop Shop for Fresh Products
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600 md:text-lg lg:mx-0">
              Join thousands of happy customers who trust FreshCart for their
              daily grocery needs
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-600 lg:justify-start">
              <span className="inline-flex items-center gap-2">
                <Truck className="size-4 text-[#16A34A]" />
                Free Delivery
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-[#16A34A]" />
                Secure Payment
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkles className="size-4 text-[#16A34A]" />
                24/7 Support
              </span>
            </div>
          </div>
        </aside>

        <section className="rounded-2xl border border-[#E2E8F0] bg-white px-5 py-6 shadow-sm md:px-8 md:py-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#16A34A]">FreshCart</h2>
            <h3 className="mt-2 text-2xl font-bold text-slate-800">
              Welcome Back!
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Sign in to continue your fresh shopping experience
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full justify-center gap-2 rounded-xl border-[#D9DEE7] text-slate-700"
              onClick={handleSocialLoginClick}
            >
              <span className="text-[#EA4335]">G</span>
              Continue with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full justify-center gap-2 rounded-xl border-[#D9DEE7] text-slate-700"
              onClick={handleSocialLoginClick}
            >
              <Share2 className="size-4 text-[#1877F2]" />
              Continue with Facebook
            </Button>
          </div>

          <div className="my-5 flex items-center gap-3 text-center text-xs uppercase tracking-[0.18em] text-slate-400">
            <div className="h-px flex-1 bg-[#E2E8F0]" />
            <span>OR CONTINUE WITH EMAIL</span>
            <div className="h-px flex-1 bg-[#E2E8F0]" />
          </div>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-slate-700">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          className="h-12 rounded-xl border-[#D9DEE7] pl-10 text-sm"
                          placeholder="Enter your email"
                          type="email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between gap-4">
                      <FormLabel className="text-sm font-semibold text-slate-700">
                        Password
                      </FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-[#16A34A] hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          className="h-12 rounded-xl border-[#D9DEE7] pl-10 pr-10 text-sm"
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <button
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  className="size-4 rounded border-[#CBD5E1] text-[#16A34A] focus:ring-[#16A34A]"
                  type="checkbox"
                />
                Keep me signed in
              </label>

              <Button
                className="h-12 w-full rounded-xl text-base font-semibold text-white shadow-[0_10px_24px_rgba(22,163,74,0.22)]"
                disabled={isLoading}
                style={{ backgroundColor: BRAND_GREEN }}
                type="submit"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>

          <div className="my-6 border-t border-[#E2E8F0] pt-5 text-center">
            <p className="text-sm text-slate-600">
              New to FreshCart?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#16A34A] hover:underline"
              >
                Create an account
              </Link>
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="size-3.5" />
                SSL Secured
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ShoppingBag className="size-3.5" />
                50K+ Users
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                4.9 Rating
              </span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
