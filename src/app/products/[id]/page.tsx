"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Heart, Share2 } from "lucide-react";
import { toast } from "sonner";

import { useGetProductByIdQuery, useGetProductsQuery } from "@/store/apiSlice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ImageGallery from "@/components/custom/ImageGallery";
import QuantitySelector from "@/components/custom/QuantitySelector";
import TrustBadges from "@/components/custom/TrustBadges";
import ProductCard from "@/components/custom/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading product details...</p>
      </div>
    </div>
  );
}

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(id, {
    skip: !id,
  });
  const categoryId = product?.data?.category?._id;
  const currentProductId = product?.data?._id;

  const { data: relatedProductsResult, isSuccess: isRelatedProductsSuccess } =
    useGetProductsQuery(
      {
        "category[in]": categoryId,
        limit: 12,
      },
      {
        skip: !categoryId,
      },
    );

  const [quantity, setQuantity] = useState(1);

  // Filter similar products by category
  const similarProducts = useMemo(() => {
    if (
      !isRelatedProductsSuccess ||
      !relatedProductsResult?.data ||
      !currentProductId
    )
      return [];

    return relatedProductsResult?.data
      ?.filter((p) => p && p?._id !== currentProductId && Boolean(p?.title))
      .slice(0, 5);
  }, [currentProductId, isRelatedProductsSuccess, relatedProductsResult]);

  if (isLoading || !product?.data) return <LoadingSpinner />;

  const currentProduct = product?.data;

  // Calculate sale percentage
  const savePercentage = currentProduct?.price
    ? Math.round(
        ((currentProduct?.price - currentProduct?.price * 0.7) /
          currentProduct?.price) *
          100,
      )
    : 0;

  // Calculate total price
  const totalPrice = currentProduct?.price
    ? currentProduct?.price * quantity
    : 0;

  // Breadcrumbs
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: product?.data?.category?.name || "Category", href: "#" },
    {
      label:
        product?.data?.title?.split(" ").slice(0, 3).join(" ") || "Product",
      href: "#",
    },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm">
          {breadcrumbs.map((crumb, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <Link
                href={crumb.href}
                className="text-gray-600 hover:text-green-600"
              >
                {crumb.label}
              </Link>
              {idx < breadcrumbs.length - 1 && (
                <span className="text-gray-400">&gt;</span>
              )}
            </div>
          ))}
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column: Gallery */}
          <div>
            <ImageGallery
              imageCover={currentProduct?.imageCover || ""}
              images={currentProduct?.images || []}
              productName={currentProduct?.title || "Product"}
            />
          </div>

          {/* Right Column: Product Info */}
          <div>
            {/* Category & Brand */}
            <div className="flex gap-2 mb-3">
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded">
                {product?.data?.category?.name || "Category"}
              </span>
              {product?.data?.brand?.name && (
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded">
                  {product?.data?.brand?.name}
                </span>
              )}
              {product?.data?.subcategory?.[0]?.name && (
                <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded">
                  {product?.data?.subcategory?.[0]?.name}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product?.data?.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.round(product?.data?.ratingsAverage || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold">
                {(product?.data?.ratingsAverage || 0).toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">
                ({product?.data?.ratingsQuantity || 0} reviews)
              </span>
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold text-gray-900">
                {product?.data?.price} EGP
              </span>
              <span className="text-lg text-gray-500 line-through">
                {Math.round((product?.data?.price || 0) / 0.7)} EGP
              </span>
              {savePercentage > 0 && (
                <span className="text-sm font-bold text-white bg-red-500 px-2 py-1 rounded">
                  Save {savePercentage}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span className="text-green-600 font-semibold">In Stock</span>
            </div>

            {/* Description Snippet */}
            <p className="text-gray-600 text-sm mb-6 line-clamp-3">
              {product?.data?.description}
            </p>

            {/* Quantity Selector */}
            <QuantitySelector
              maxQuantity={product?.data?.quantity || 50}
              onQuantityChange={setQuantity}
            />

            {/* Total Price */}
            <div className="flex justify-between items-center py-4 border-t border-b border-gray-200 my-4">
              <span className="text-gray-700 font-medium">Total Price:</span>
              <span className="text-2xl font-bold text-green-600">
                {totalPrice.toFixed(2)} EGP
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold">
                🛒 Add to Cart
              </Button>
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg font-semibold">
                ⚡ Buy Now
              </Button>
            </div>

            {/* Wishlist & Share Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 py-6"
                onClick={() => toast.success("Added to Wishlist!")}
              >
                <Heart size={18} className="mr-2" />
                Add to Wishlist
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="py-6"
                onClick={() => toast.info("Share link copied!")}
              >
                <Share2 size={18} />
              </Button>
            </div>

            {/* Trust Badges */}
            <TrustBadges />
          </div>
        </div>

        {/* Details Tabs Section */}
        <div className="mb-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="flex gap-0 border-b-2 border-gray-200 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent px-6 py-3"
              >
                📋 Product Details
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent px-6 py-3"
              >
                ⭐ Reviews ({product?.data?.ratingsQuantity || 0})
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent px-6 py-3"
              >
                🚚 Shipping & Returns
              </TabsTrigger>
            </TabsList>

            {/* Product Details Tab */}
            <TabsContent value="details" className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">About this Product</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product?.data?.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {[
                      "Premium Quality Product",
                      "100% Authentic Guarantee",
                      "Fast & Secure Packaging",
                      "Quality Tested",
                    ].map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Product Info Table */}
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Product Information</h3>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 py-2 border-b">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold">
                      {product?.data?.category?.name}
                    </span>
                  </div>
                  {product?.data?.brand?.name && (
                    <div className="grid grid-cols-2 py-2 border-b">
                      <span className="text-gray-600">Brand</span>
                      <span className="font-semibold">
                        {product?.data?.brand?.name}
                      </span>
                    </div>
                  )}
                  {product?.data?.subcategory?.[0]?.name && (
                    <div className="grid grid-cols-2 py-2 border-b">
                      <span className="text-gray-600">Subcategory</span>
                      <span className="font-semibold">
                        {product?.data?.subcategory?.[0]?.name}
                      </span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 py-2 border-b">
                    <span className="text-gray-600">Items Sold</span>
                    <span className="font-semibold">
                      {product?.data?.sold || 0}+
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Rating Breakdown */}
                <div>
                  <h3 className="text-lg font-bold mb-4">
                    {(product?.data?.ratingsAverage || 0).toFixed(1)}
                  </h3>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < Math.round(product?.data?.ratingsAverage || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Based on {product?.data?.ratingsQuantity || 0} reviews
                  </p>

                  {/* Rating Bar Chart */}
                  <div className="mt-6 space-y-3">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm font-semibold w-12">
                          {star} star
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{
                              width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 5 : star === 2 ? 5 : 5}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 w-12 text-right">
                          {star === 5 ? 60 : star === 4 ? 25 : 5}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Write Review */}
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                      ⭐
                    </div>
                    <p className="text-gray-600 mb-4">
                      Customer reviews will be displayed here.
                    </p>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => toast.info("Review feature coming soon!")}
                    >
                      Write a Review
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Shipping & Returns Tab */}
            <TabsContent value="shipping" className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Shipping Info */}
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🚚</span>
                    </div>
                    <h4 className="text-lg font-bold">Shipping Information</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Free shipping on orders over 550</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Standard delivery: 3-5 business days</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>
                        Express delivery available (1-2 business days)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Track your order in real-time</span>
                    </li>
                  </ul>
                </div>

                {/* Returns & Refunds */}
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl">↩️</span>
                    </div>
                    <h4 className="text-lg font-bold">Returns & Refunds</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>30-day hassle-free returns</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Full refund or exchange available</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Free return shipping on defective items</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-600 font-bold text-lg">
                        ✓
                      </span>
                      <span>Easy online return process</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Buyer Protection */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    🛡️
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">
                      Buyer Protection Guarantee
                    </h4>
                    <p className="text-gray-700">
                      Get a full refund if your order doesn&apos;t arrive or
                      isn&apos;t as described. We ensure your shopping
                      experience is safe and secure.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* You May Also Like Section */}
        {isRelatedProductsSuccess &&
          relatedProductsResult?.data &&
          similarProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
              <Carousel className="w-full">
                <CarouselContent className="-ml-2 md:-ml-4">
                  {similarProducts.map((prod) => (
                    <CarouselItem
                      key={prod?._id}
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                    >
                      <ProductCard product={prod} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:flex" />
                <CarouselNext className="hidden lg:flex" />
              </Carousel>
            </div>
          )}
      </div>
    </div>
  );
}
