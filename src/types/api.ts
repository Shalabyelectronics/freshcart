export interface ApiError {
  value: string;
  msg: string;
  param: string;
  location: string;
}

export interface ApiErrorResponse {
  statusMsg?: string;
  message: string;
  errors?: ApiError[];
}

export interface ApiPaginationMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
  prevPage?: number;
}

export interface UserPayload {
  name: string;
  email: string;
  role: string;
}

export interface AuthUserPayload extends UserPayload {
  _id: string;
}

export interface SignUpRequestBody {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface SignInRequestBody {
  email: string;
  password: string;
}

export interface ForgotPasswordRequestBody {
  email: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: AuthUserPayload;
  token: string;
}

export interface ForgotPasswordResponse {
  statusMsg: string;
  message: string;
}

export interface CategorySummary {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface BrandSummary {
  _id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
}

export interface SubcategorySummary {
  _id?: string;
  name: string;
  slug?: string;
  category?: string;
}

export interface Product {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  imageCover: string;
  images: string[];
  quantity?: number;
  price: number;
  sold?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  category: CategorySummary;
  brand?: BrandSummary;
  subcategory?: SubcategorySummary[];
}

export interface ProductsResponse {
  results: number;
  metadata: ApiPaginationMetadata;
  data: Product[];
}

export interface ProductsQueryParams {
  "category[in]"?: string;
  "brand[in]"?: string;
  limit?: number;
}

export interface ProductResponse {
  data: Product;
}

export interface CategoriesResponse {
  results: number;
  metadata?: ApiPaginationMetadata;
  data: CategorySummary[];
}

export interface BrandsResponse {
  results: number;
  data: Brand[];
}

export interface SingleBrandResponse {
  data: Brand;
}

export interface CartProduct {
  _id: string;
  title: string;
  imageCover: string;
  category: CategorySummary;
  brand?: BrandSummary;
  price: number;
  id?: string;
}

export interface CartProductLine {
  _id: string;
  count: number;
  price: number;
  product: CartProduct;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartProductLine[];
  totalCartPrice: number;
}

export interface CartResponse {
  status: string;
  numOfCartItems: number;
  data: CartData;
  message?: string;
}

export interface AddToCartRequestBody {
  productId: string;
}

export interface UpdateCartProductQuantityRequestBody {
  count: number;
}

export interface CartMutationResponse {
  status: string;
  message?: string;
  numOfCartItems?: number;
  data?: CartData | null;
}

export interface WishlistResponse {
  status: string;
  count: number;
  data: Product[];
}

export interface WishlistMutationResponse {
  status: string;
  message: string;
  data?: string[];
}

export interface CreateCashOrderResponse {
  status: string;
  message?: string;
  data?: {
    _id: string;
    user: string;
    cartItems: Array<{
      product: string;
      count: number;
      price: number;
      _id: string;
    }>;
    totalOrderPrice: number;
    paymentMethodType: "cash";
    isPaid: boolean;
    isDelivered: boolean;
    createdAt: string;
  };
}

export interface CreateOnlineOrderSessionResponse {
  status: string;
  session: {
    url: string;
    id: string;
  };
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export type OrderResponse =
  | CreateCashOrderResponse
  | CreateOnlineOrderSessionResponse;

export interface OrderItem {
  _id: string;
  product: string;
  count: number;
  price: number;
}

export interface Order {
  _id: string;
  user: string;
  cartItems: OrderItem[];
  totalOrderPrice: number;
  shippingAddress: ShippingAddress;
  paymentMethodType: "cash" | "card";
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

export interface UserOrdersResponse {
  status: string;
  results: number;
  data: Order[];
}
