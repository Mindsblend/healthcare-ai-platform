import { Prisma } from '@prisma/client'

// ============================================
// BLOG TYPES
// ============================================

export type BlogPreview = Prisma.BlogGetPayload<{
  select: {
    id: true
    title: true
    image: true
    slug: true
    author: true
    authorTitle: true
    authorImage: true
    description: true
    createdAt: true
    updatedAt: true
  }
}>

// @todo - Add blog content when schema is updated
export type BlogDetail = Prisma.BlogGetPayload<{
  select: {
    id: true
    title: true
    image: true
    author: true
    authorImage: true
    description: true
    createdAt: true
    updatedAt: true
  }
}>

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

export type BlogSummary = Prisma.BlogGetPayload<{
  select: {
    id: true
    title: true
    slug: true
    image: true
    author: true
    authorImage: true
    authorTitle: true
    description: true
    createdAt: true
    updatedAt: true
  }
}>

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

export type OrderDetail = Prisma.OrderGetPayload<{
  include: {
    items: {
      include: {
        product: {
          select: {
            id: true
            title: true
            price: true
            image: true
            slug: true
          }
        }
      }
    }
  }
}>

export type OrderItem = Prisma.OrderItemGetPayload<{
  select: {
    id: true
    orderId: true
    productId: true
    quantity: true
    price: true
    createdAt: true
    product: {
      select: {
        id: true
        title: true
        price: true
        image: true
        slug: true
      }
    }
  }
}>

export type OrderStatus =
  | 'PENDING'
  | 'PREPARING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELED'
  | 'REFUNDED'
  | 'DELIVERING'
  | 'DELIVERED'

export type OrderSummary = Prisma.OrderGetPayload<{
  select: {
    id: true
    totalPrice: true
    shippingFirstName: true
    shippingLastName: true
    shippingPhone: true
    createdAt: true
    status: true
  }
}>

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

export type ProductSummary = Prisma.ProductGetPayload<{
  select: {
    id: true
    title: true
    price: true
    solution: true
    slug: true
    image: true
    categoryId: true
    category: {
      select: {
        name: true
        iconPath: true
      }
    }
  }
}>

export type ProductDetail = Prisma.ProductGetPayload<{
  where: { slug: true; isActive: true }
  include: {
    icons: true
    gains: true
    faqs: true
    aiResponses: true
    category: true
    feedCategoryId: true
  }
}>

export type GetProductsPreviewResponse = ProductSummary[]

// ============================================
// PRODUCT ACTION TYPES
// ============================================

export interface CreateProductInput {
  title: string
  price: number
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

export type UserAddress = Prisma.UserGetPayload<{
  include: {
    addresses: true
  }
}> & {
  addresses: Address[]
}

export type GetUserAddressResponse = UserAddress | null

export type UserInfo = Prisma.UserGetPayload<{
  select: {
    id: true
    firstName: true
    lastName: true
    email: true
    phone: true
  }
}>

export type UserOrder = Prisma.UserGetPayload<{
  include: {
    orders: {
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true
                title: true
                price: true
                image: true
                slug: true
              }
            }
          }
        }
      }
    }
  }
}>

export type GetUserOrderResponse = UserOrder | null

export type UserSummary = Prisma.UserGetPayload<{
  select: {
    id: true
    email: true
    phone: true
  }
}>

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

export type CategorySummary = Prisma.CategoryGetPayload<{
  select: {
    id: true
    name: true
    iconPath: true
  }
}>

export type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: {
    products: {
      include: {
        category: true
        icons: true
        gains: true
        faqs: true
      }
    }
  }
}>

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
  amount: number // Amount in Rials (Toman × 10)
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
