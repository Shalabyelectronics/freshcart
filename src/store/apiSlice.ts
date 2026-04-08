import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  AddToCartRequestBody,
  AuthSuccessResponse,
  CartMutationResponse,
  CartResponse,
  CategoriesResponse,
  ForgotPasswordRequestBody,
  ForgotPasswordResponse,
  ProductResponse,
  ProductsQueryParams,
  ProductsResponse,
  SignInRequestBody,
  SignUpRequestBody,
  UpdateCartProductQuantityRequestBody,
} from "@/types/api";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Cart"],
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
  }),
});

export const {
  useAddToCartMutation,
  useClearCartMutation,
  useForgotPasswordMutation,
  useGetCategoriesQuery,
  useGetLoggedUserCartQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useRemoveCartItemMutation,
  useSignInMutation,
  useSignUpMutation,
  useUpdateCartProductQuantityMutation,
} = apiSlice;

export const useSignupMutation = apiSlice.useSignUpMutation;
export const useSigninMutation = apiSlice.useSignInMutation;
