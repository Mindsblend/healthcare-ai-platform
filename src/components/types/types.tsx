import { DefaultSession } from 'next-auth'

export interface ProductType {
  id: number
  title: string
  price: number
  category: string
  slug: string
  solution: string
  image: string
  description: string
  icons: iconType[]
  gains: gainType[]
  faqs: faqType[]
}

export interface iconType {
  id: number
  title: string
  iconPath: string
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
  identifier: string
}
