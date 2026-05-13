import { Prisma } from '@prisma/client'
import { DefaultSession } from 'next-auth'

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

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELED'
  | 'REFUNDED'
  | 'DELIVERING'
  | 'DELIVERED'

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

export interface UserType {
  id: string
  email: string | null
  phone: string | null
  createdAt: string
  updatedAt: string

  // aiResponses: AiResponse[]
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

// Add FeedCategory types
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

// Or if you want more control over the product fields
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

export type UserWithTimestampsAndRelations = Prisma.UserGetPayload<{
  select: {
    id: true
    email: true
    phone: true
    createdAt: true
    updatedAt: true
    carts: { select: Prisma.CartSelect }
    orders: { select: Prisma.OrderSelect }
    // aiResponses: { select: Prisma.AiResponseSelect };
  }
}>

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

export type CategorySummary = Prisma.CategoryGetPayload<{
  select: {
    id: true
    name: true
    iconPath: true
  }
}>

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

export type BlogDetail = Prisma.BlogGetPayload<{
  // where: { slug: true } // The payload will change to this after we add a new row for the blog content. Blog content will be included here
  // include: {
  //   content: true
  // }
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

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

export interface SessionPayload {
  id: string
  email: string | null
  phone: string | null
  role: string | null
}

export interface VisitMonth {
  id: string
  year: number
  month: number
  visits: number
  updatedAt: Date
}

export interface NavItem {
  name: string
  icon: string
  path: string
  subItems?: { name: string; path: string }[]
}

// lib/types/location.types.ts
export interface City {
  id: number
  name: string
}

export interface Province {
  id: number
  name: string
  cities: City[]
}
