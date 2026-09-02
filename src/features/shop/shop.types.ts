// ============================================
// BLOG TYPES
// ============================================

export type BlogPreview = {
  id: number
  title: string
  image: string
  slug: string
  author: string
  authorTitle: string
  authorImage: string
  description: string
  createdAt: Date
  updatedAt: Date
}

// جدید:
export type BlogDetail = {
  id: number
  title: string
  image: string
  author: string
  authorImage: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export type GetBlogsPreviewResponse = BlogSummary[]

// ============================================
// BLOG ACTION TYPES
// ============================================

export interface CreateBlogInput {
  title: string
  slug: string
  description: string
  image: string
  author: string
  authorImage: string
  authorTitle: string
  content: string
}

export interface CreateBlogResponse {
  id: number
  title: string
}

export interface DeleteBlogInput {
  id: number
}

export interface DeleteBlogResponse {
  success: boolean
}

export interface GetBlogBySlugInput {
  slug: string
}

export interface GetBlogBySlugResponse {
  id: number
  title: string
  description: string
  image: string
  author: string
  authorImage: string
  slug: string
  createdAt: Date
  updatedAt: Date
}

// جدید:
export type BlogSummary = {
  id: number
  title: string
  slug: string
  image: string
  author: string
  authorImage: string
  authorTitle: string
  description: string
  createdAt: Date
  updatedAt: Date
}

// ============================================
// CART TYPES
// ============================================

export interface CartItemType {
  id: number
  cartId: string
  quantity: number
  price: number
  product: ProductSummary
}

export interface CartType {
  id: string
  userId: string | null
  status: string
  items: CartItemType[]
}

// ============================================
// CART ACTION TYPES
// ============================================

export type GetCartResponse = CartType | null

export type CreateCartResponse = CartType

export interface AddItemInput {
  cartId: string
  productId: number
  quantity?: number // Optional, defaults to 1
}

export interface AddItemResponse {
  id: string
  cartId: string
  productId: number
  quantity: number
  price: number
}

export interface RemoveItemInput {
  cartItemId: number
}

export interface RemoveItemResponse {
  success: boolean
  message?: string
}

export interface UpdateItemQuantityInput {
  cartItemId: number
  quantity: number
}

export interface UpdateItemQuantityResponse {
  success: boolean
  cartItemId: number
  quantity: number
}

export interface ClearCartInput {
  cartId: string
}

// ============================================
// ORDER TYPES
// ============================================

export interface GetOrderByIdInput {
  id: string
}

export interface GetOrderByIdResponse {
  id: string
  totalPrice: number
  status: OrderStatus
  createdAt: string
  items: OrderItem[]
  shippingFirstName: string
  shippingLastName: string
  shippingEmail: string
  shippingPhone: string
  shippingCity: string
  shippingProvince: string
  shippingAddress: string
  shippingPostalCode: string
  shippingNotes?: string
}

export type CreateOrderInput = {
  userId?: string // User id is already provided in the api's route.ts
  shippingInfo: ShippingInfo
  paymentMethod: 'mellat' | 'zarinpal'
}

export type OrderDetail = {
  id: string
  totalPrice: number
  status: string
  paymentMethod: string | null
  userId: string
  cartId: string | null
  shippingFirstName: string
  shippingLastName: string
  shippingEmail: string
  shippingPhone: string
  shippingCity: string
  shippingProvince: string
  shippingAddress: string
  shippingPostalCode: string
  shippingNotes: string | null
  paymentAuthority: string | null
  paymentRefId: string | null
  paymentRequestedAt: Date | null
  paymentVerifiedAt: Date | null
  paymentErrorMessage: string | null
  createdAt: Date
  updatedAt: Date
  items: {
    id: number
    orderId: string
    productId: number
    quantity: number
    price: number
    createdAt: Date
    product: {
      id: number
      title: string
      price: number
      image: string
      slug: string
    }
  }[]
}

// جدید:
export type OrderItem = {
  id: number
  orderId: string
  productId: number
  quantity: number
  price: number
  createdAt: Date
  product: {
    id: number
    title: string
    price: number
    image: string
    slug: string
  }
}

export type OrderStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELED'
  | 'REFUNDED'
  | 'DELIVERING'
  | 'DELIVERED'

// جدید:
export type OrderSummary = {
  id: string
  totalPrice: number
  shippingFirstName: string
  shippingLastName: string
  shippingPhone: string
  createdAt: Date
  status: string
}

export type GetOrdersPreviewResponse = OrderSummary[]

export interface UpdateOrderInput {
  orderId: string
  status?: OrderStatus
  shippingNotes?: string
}

export type UpdateOrderResponse = OrderSummary

export interface FetchOrderByIdInput {
  id: string
}

// ============================================
// SHIPPING TYPES
// ============================================

export type ShippingInfo = {
  firstName: string
  lastName: string
  city: string
  province: string
  email: string
  phone: string
  address: string
  postalCode: string
  notes?: string
}

// ============================================
// PRODUCT COMPONENT TYPES (Icons, Gains, FAQs)
// ============================================

export interface IconType {
  id: number
  title: string
  description: string
  iconPath: string | null
}

export interface GainType {
  id: number
  title: string
  ingredient: string
  description: string
}

export interface FaqType {
  id: number
  question: string
  answer: string
}

export interface UpdateIconInput {
  title: string
  description: string
  iconPath?: string | null
}

export interface UpdateGainInput {
  title: string
  description: string
  ingredient?: string
}

export interface UpdateFaqInput {
  question: string
  answer: string
}

// ============================================
// PRODUCT TYPES
// ============================================

// جدید:
export type ProductSummary = {
  id: number
  title: string
  price: number
  discount?: number | null
  discountedPrice?: number | null
  solution: string
  slug: string
  image: string
  categoryId: number
  category: {
    name: string
    iconPath: string
  }
}

export type ProductDetail = {
  id: number
  title: string
  price: number
  discount?: number | null
  discountedPrice?: number | null
  solution: string
  slug: string
  image: string
  description: string
  categoryId: number
  feedCategoryId: number | null
  isActive: boolean
  category: {
    id: number
    name: string
    iconPath: string
  }
  icons: IconType[]
  gains: GainType[]
  faqs: FaqType[]
  aiResponses?: any[]
  createdAt: Date
  updatedAt: Date
}
export type GetProductsPreviewResponse = ProductSummary[]

// ============================================
// PRODUCT ACTION TYPES
// ============================================

export interface CreateProductInput {
  title: string
  price: number
  discount?: number
  slug: string
  solution: string
  image: string
  description: string
  categoryId: number
  feedCategoryId: number
  icons: IconType[]
  gains: GainType[]
  faqs: FaqType[]
}

export interface CreateProductResponse {
  id: number
  title: string
  slug: string
  success: boolean
}

export interface UpdateProductInput {
  id: number
  title?: string
  price?: number
  slug?: string
  solution?: string
  image?: string
  description?: string
  categoryId?: number
  feedCategoryId?: number
  isActive?: boolean
  icons?: UpdateIconInput[]
  gains?: UpdateGainInput[]
  faqs?: UpdateFaqInput[]
}

export interface UpdateProductResponse {
  id: number
  title: string
  slug: string
  success: boolean
}

export interface DeleteProductInput {
  id: number
}

export interface DeleteProductResponse {
  success: boolean
  message?: string
}

export interface GetProductsByCategoryInput {
  categoryId: number
}

export interface GetProductsByCategoryResponse {
  id: number
  title: string
  price: number
  discount?: number | null
  discountedPrice?: number | null
  slug: string
  image: string
  categoryId: number
  category: {
    name: string
    iconPath: string
  }
  solution: string
}

export interface GetProductBySlugInput {
  slug: string
}

export interface GetProductBySlugResponse {
  id: number
  title: string
  price: number
  discount: number | null
  discountedPrice: number | null
  slug: string
  solution: string
  image: string
  description: string
  categoryId: number
  category: {
    id: number
    name: string
    iconPath: string
  }
  feedCategoryId: number
  icons: IconType[]
  gains: GainType[]
  faqs: FaqType[]
}

// features/shop/shop.types.ts

// ============================================
// COLLECTION TYPES
// ============================================

export interface CollectionSummary {
  id: number
  name: string
  slug: string
  subtitle: string | null
  description: string | null
  image: string
  price: number
  featured: boolean
  order: number
  isActive: boolean
  createdAt: Date
  // optional filtering field
  categoryId?: number
}

export interface CollectionDetail extends CollectionSummary {
  products: {
    id: number
    collectionId: number
    productId: number
    order: number
    product: {
      id: number
      title: string
      price: number
      description: string | null
      image: string | null
      slug: string
      categoryId: number
      feedCategoryId: number | null
      category?: {
        id: number
        name: string
      } | null
      feedCategory?: {
        id: number
        name: string
      } | null
    }
  }[]
}

export interface CreateCollectionInput {
  name: string
  slug: string
  subtitle?: string
  description?: string
  image?: string
  price?: number
  featured?: boolean
  order?: number
  productIds: (string | number)[]
}

export interface UpdateCollectionInput {
  id: number
  name?: string
  slug?: string
  subtitle?: string
  description?: string
  image?: string
  price?: number
  featured?: boolean
  order?: number
  isActive?: boolean
  productIds?: (string | number)[]
}

export interface DeleteCollectionInput {
  id: number
}

export interface DeleteCollectionResponse {
  success: boolean
  message: string
}

// ============================================
// PROFILE ADDRESS TYPES
// ============================================

export interface CreateUserAddressInput {
  firstName: string
  lastName: string
  city: string
  province: string
  email: string
  phone: string
  address: string
  postalCode: string
}

export interface CreateUserAddressResponse {
  id: number
  success: boolean
  message?: string
}

// ============================================
// USER PROFILE TYPES
// ============================================

export interface UpdateUserProfileInput {
  id?: string // User id is already passed in the api's route.ts
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export interface UpdateUserProfileResponse {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
  success: boolean
}

export type Address = {
  id: string
  firstName: string
  lastName: string
  city: string
  province: string
  phone: string
  postalCode: string
  address: string
  email?: string | null
  isDefault: boolean
}

// جدید:
export type UserAddress = {
  id: string
  email: string | null
  phone: string | null
  firstName: string | null
  lastName: string | null
  role: string
  addresses: Address[]
  createdAt: Date
  updatedAt: Date
}

export type GetUserAddressResponse = UserAddress | null

// جدید:
export type UserInfo = {
  id: string
  firstName: string | null
  lastName: string | null
  email: string | null
  phone: string | null
}

// جدید:
export type UserOrder = {
  id: string
  email: string | null
  phone: string | null
  firstName: string | null
  lastName: string | null
  role: string
  createdAt: Date
  updatedAt: Date
  orders: {
    id: string
    totalPrice: number
    status: string
    createdAt: Date
    updatedAt: Date
    items: {
      id: number
      orderId: string
      productId: number
      quantity: number
      price: number
      createdAt: Date
      product: {
        id: number
        title: string
        price: number
        image: string
        slug: string
      }
    }[]
  }[]
}

export type GetUserOrderResponse = UserOrder | null

// جدید:
export type UserSummary = {
  id: string
  email: string | null
  phone: string | null
}

export type GetUserInfoResponse = UserInfo | null

// ============================================
// PROFILE ACTION TYPES
// ============================================

export interface GetUserAddressesResponse {
  id: number
  firstName: string
  lastName: string
  city: string
  province: string
  email: string
  phone: string
  address: string
  postalCode: string
  isDefault?: boolean
}
;[]

export interface DeleteUserAddressInput {
  addressId: number
}

export interface DeleteUserAddressResponse {
  success: boolean
  message?: string
}

export interface UpdateUserAddressInput {
  addressId: number
  firstName?: string
  lastName?: string
  city?: string
  province?: string
  email?: string
  phone?: string
  address?: string
  postalCode?: string
  isDefault?: boolean
}

export interface UpdateUserAddressResponse {
  id: number
  success: boolean
  message?: string
}

// ============================================
// CATEGORY TYPES
// ============================================

// جدید:
export type CategorySummary = {
  id: number
  name: string
  iconPath: string
}

// جدید:
export type CategoryWithProducts = {
  id: number
  name: string
  iconPath: string
  products: ProductDetail[]
}

export type GetCategoriesResponse = CategorySummary[]

export type GetFeedCategoriesResponse = FeedCategoryWithProducts[]

export interface FetchCategoryWithProductsInput {
  id: number
}

// ============================================
// FEED CATEGORY TYPES
// ============================================

export interface FetchFeedCategoriesInput {
  limit?: number
}

export interface FetchFeedCategoryBySlugInput {
  slug: string
}

export interface FetchFeedCategoryProductsInput {
  slug: string
  page?: number
  limit?: number
}

export interface FetchUserFeedInput {
  limitPerCategory?: number
}

export interface FeedCategoryProduct {
  id: number
  title: string
  price: number
  solution: string
  slug: string
  image: string
  description?: string
  categoryId: number
  category: {
    name: string
    iconPath: string
  }
}

export type FeedCategoryWithProducts = {
  id: number
  name: string
  slug: string
  description: string
  order: number
  products: FeedCategoryProduct[]
}

export interface FeedCategoryProductsResponse {
  category: {
    id: number
    name: string
  }
  products: FeedCategoryProduct[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type UserFeedResponse = Array<{
  category: {
    id: number
    name: string
    slug: string
  }
  products: FeedCategoryProduct[]
}>

// ============================================
// PAYMENT TYPES
// ============================================

export interface PaymentRequestInput {
  amount: number // Amount in Tomans
  description: string // Order description
  orderId: string // Your order ID
  email?: string // Optional: user email
  mobile?: string // Optional: user mobile
}

export interface PaymentRequestResponse {
  success: boolean
  authority?: string
  paymentUrl?: string
  error?: string
}

export interface PaymentVerifyInput {
  authority: string
  amount: number
}

export interface PaymentVerifyResponse {
  success: boolean
  refId?: number
  message?: string
}
