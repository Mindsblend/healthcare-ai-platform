import { Prisma } from '@prisma/client'
import { DefaultSession } from 'next-auth'

// ============================================
// SESSION & AUTH TYPES
// ============================================

export interface SessionPayload {
  id: string
  email: string | null
  phone: string | null
  role: string | null
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

// ============================================
// CART TYPES
// ============================================

export interface CartType {
  id: string
  userId: string | null
  status: 'ACTIVE' | 'CHECKED_OUT' | 'ABANDONED'
  items: CartItemType[]
}

export interface CartItemType {
  id: number
  cartId: string
  quantity: number
  price: number
  product: ProductSummary
}

// ============================================
// ORDER TYPES
// ============================================

export type OrderStatus =
  | 'PENDING'
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

// ============================================
// USER TYPES
// ============================================

export interface UserType {
  id: string
  email: string | null
  phone: string | null
  createdAt: string
  updatedAt: string
  carts: CartType[]
  orders: OrderDetail[]
}

export type UserSummary = Prisma.UserGetPayload<{
  select: {
    id: true
    email: true
    phone: true
  }
}>

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

export type UserAddress = Prisma.UserGetPayload<{
  include: {
    addresses: true
  }
}>

// @deprecated - Use specific user types instead (UserSummary, UserInfo, etc.)
export type UserWithTimestampsAndRelations = Prisma.UserGetPayload<{
  select: {
    id: true
    email: true
    phone: true
    createdAt: true
    updatedAt: true
    carts: { select: Prisma.CartSelect }
    orders: { select: Prisma.OrderSelect }
  }
}>

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

// ============================================
// FEED CATEGORY TYPES
// ============================================

export type FeedCategorySummary = Prisma.FeedCategoryGetPayload<{
  select: {
    id: true
    name: true
    slug: true
    iconPath: true
    order: true
  }
}>

export type FeedCategoryWithProducts = Prisma.FeedCategoryGetPayload<{
  include: {
    products: {
      where: { isActive: true }
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
    }
  }
}>

export type FeedCategoryWithCustomProducts = Prisma.FeedCategoryGetPayload<{
  select: {
    id: true
    name: true
    slug: true
    iconPath: true
    order: true
    products: {
      select: {
        id: true
        title: true
        price: true
        solution: true
        slug: true
        image: true
        category: {
          select: {
            name: true
            iconPath: true
          }
        }
      }
    }
  }
}>

// ============================================
// BLOG TYPES
// ============================================

export interface BlogType {
  id: number
  title: string
  image: string
  slug: string
  author: string
  authorImage: string
  authorTitle: string
  description: string
  createdAt: Date
  updatedAt: Date
}

export type BlogSummary = Prisma.BlogGetPayload<{
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

// ============================================
// PRODUCT COMPONENT TYPES (Icons, Gains, FAQs)
// ============================================

export interface iconType {
  id: number
  title: string
  description: string
  iconPath: string | null
}

export interface gainType {
  id: number
  title: string
  ingredient: string
  description: string
}

export interface faqType {
  id: number
  question: string
  answer: string
}

// ============================================
// NAVIGATION TYPES
// ============================================

export interface NavItem {
  name: string
  icon: string
  path: string
  subItems?: { name: string; path: string }[]
}

// ============================================
// LOCATION TYPES
// ============================================

export interface City {
  id: number
  name: string
}

export interface Province {
  id: number
  name: string
  cities: City[]
}

// ============================================
// ADMIN DASHBOARD
// ============================================

export interface VisitMonth {
  id: string
  year: number
  month: number
  visits: number
  updatedAt: Date
}
export type SubscriptionPayload = Prisma.SubscriptionGetPayload<{
  select: {
    email: true
  }
}>
