import { number } from 'framer-motion'
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
  product: ProductPreviewType
}

export interface OrderType {
  id: string

  user?: UserType
  userId?: string

  cart: CartType
  cartId: string
  totalPrice: number

  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELED' | 'REFUNDED'
  createdAt: string
}

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
  email: string
  phone: string
  createdAt: string
  updatedAt: string

  // aiResponses: AiResponse[]
  carts: CartType[]
  orders: OrderType[]
}

export interface ProductType {
  id: number
  title: string
  price: number
  category: CategoryType[]
  slug: string
  solution: string
  image: string
  description: string 
  categoryId: number
  icons: iconType[]
  gains: gainType[]
  faqs: faqType[]
}

export interface ProductPreviewType {
  id: number
  title: string
  price: number
  solution: string
  slug: string
  image: string
  categoryId: number
  stock?: 'In Stock' | 'Out of Stock'
}

export interface CategoryType {
  id: number
  name: string
  iconPath: string
  products: ProductType
}

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
  author: string
  authorImage: string
  description: string
  createdAt: string
  updatedAt: string
}

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
