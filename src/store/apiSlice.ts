import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  AuthSuccessResponse,
  CategoriesResponse,
  ForgotPasswordRequestBody,
  ForgotPasswordResponse,
  ProductResponse,
  ProductsQueryParams,
  ProductsResponse,
  SignInRequestBody,
  SignUpRequestBody,
} from "@/types/api";

export const apiSlice = createApi({
  reducerPath: "api",
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
      query: (params) => ({
        url: "/products",
        params: params ?? undefined,
      }),
    }),
    getProductById: builder.query<ProductResponse, string>({
      query: (id) => ({
        url: `/products/${id}`,
      }),
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSignInMutation,
  useSignUpMutation,
} = apiSlice;

export const useSignupMutation = apiSlice.useSignUpMutation;
export const useSigninMutation = apiSlice.useSignInMutation;
