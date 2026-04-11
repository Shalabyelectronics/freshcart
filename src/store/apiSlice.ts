import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  AddToCartRequestBody,
  AuthSuccessResponse,
  CartMutationResponse,
  CartResponse,
  BrandsResponse,
  CategoriesResponse,
  CreateCashOrderResponse,
  CreateOnlineOrderSessionResponse,
  ForgotPasswordRequestBody,
  ForgotPasswordResponse,
  ProductResponse,
  ProductsQueryParams,
  ProductsResponse,
  ShippingAddress,
  SignInRequestBody,
  SignUpRequestBody,
  SingleBrandResponse,
  UpdateCartProductQuantityRequestBody,
  UserOrdersResponse,
  WishlistMutationResponse,
  WishlistResponse,
} from "@/types/api";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Cart", "Wishlist", "Brands"],
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ecommerce.routemisr.com/api/v1",
    prepareHeaders: (headers, { getState }) => {
      let token: string | undefined;

      const state = getState() as { auth?: { token?: string } };
      token = state.auth?.token;

      if (!token && typeof window !== "undefined") {
        token = window.localStorage.getItem("token") ?? undefined;
      }

      if (token) {
        headers.set("token", token);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthSuccessResponse, SignUpRequestBody>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
    }),
    signIn: builder.mutation<AuthSuccessResponse, SignInRequestBody>({
      query: (body) => ({
        url: "/auth/signin",
        method: "POST",
        body,
      }),
    }),
    forgotPassword: builder.mutation<
      ForgotPasswordResponse,
      ForgotPasswordRequestBody
    >({
      query: (body) => ({
        url: "/auth/forgotPasswords",
        method: "POST",
        body,
      }),
    }),
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => ({
        url: "/categories",
      }),
    }),
    getBrands: builder.query<BrandsResponse, void>({
      query: () => ({
        url: "/brands",
      }),
      providesTags: ["Brands"],
    }),
    getSpecificBrand: builder.query<SingleBrandResponse, string>({
      query: (brandId) => ({
        url: `/brands/${brandId}`,
      }),
    }),
    getProducts: builder.query<ProductsResponse, ProductsQueryParams | void>({
      query: (params) => {
        const queryObj: { url: string; params?: ProductsQueryParams } = {
          url: "/products",
        };
        if (params) {
          queryObj.params = params;
        }
        return queryObj;
      },
    }),
    getProductById: builder.query<ProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}`,
      }),
    }),
    addToCart: builder.mutation<CartMutationResponse, AddToCartRequestBody>({
      query: (body) => ({
        url: "/cart",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    getLoggedUserCart: builder.query<CartResponse, void>({
      query: () => ({
        url: "/cart",
        method: "GET",
      }),
      providesTags: ["Cart"],
    }),
    updateCartProductQuantity: builder.mutation<
      CartMutationResponse,
      { productId: string; body: UpdateCartProductQuantityRequestBody }
    >({
      query: ({ productId, body }) => ({
        url: `/cart/${productId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<CartMutationResponse, string>({
      query: (productId) => ({
        url: `/cart/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation<CartMutationResponse, void>({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    createCashOrder: builder.mutation<
      CreateCashOrderResponse,
      { cartId: string; shippingAddress: ShippingAddress }
    >({
      query: ({ cartId, shippingAddress }) => ({
        url: `https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
        method: "POST",
        body: { shippingAddress },
      }),
      invalidatesTags: ["Cart"],
    }),
    createOnlineOrder: builder.mutation<
      CreateOnlineOrderSessionResponse,
      { cartId: string; shippingAddress: ShippingAddress }
    >({
      query: ({ cartId, shippingAddress }) => {
        const origin =
          typeof window !== "undefined" ? window.location.origin : "";
        return {
          url: `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${origin}`,
          method: "POST",
          body: { shippingAddress },
        };
      },
      invalidatesTags: ["Cart"],
    }),
    getUserOrders: builder.query<UserOrdersResponse, void>({
      query: () => ({
        url: "/orders",
        method: "GET",
      }),
    }),
    getWishlist: builder.query<WishlistResponse, void>({
      query: () => ({
        url: "/wishlist",
        method: "GET",
      }),
      providesTags: ["Wishlist"],
    }),
    addToWishlist: builder.mutation<
      WishlistMutationResponse,
      AddToCartRequestBody
    >({
      query: (body) => ({
        url: "/wishlist",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    removeFromWishlist: builder.mutation<WishlistMutationResponse, string>({
      query: (productId) => ({
        url: `/wishlist/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useClearCartMutation,
  useCreateCashOrderMutation,
  useCreateOnlineOrderMutation,
  useForgotPasswordMutation,
  useGetCategoriesQuery,
  useGetBrandsQuery,
  useGetLoggedUserCartQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useGetSpecificBrandQuery,
  useGetUserOrdersQuery,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveCartItemMutation,
  useRemoveFromWishlistMutation,
  useSignInMutation,
  useSignUpMutation,
  useUpdateCartProductQuantityMutation,
} = apiSlice;

export const useSignupMutation = apiSlice.useSignUpMutation;
export const useSigninMutation = apiSlice.useSignInMutation;
