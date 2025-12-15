import { DefaultSession } from 'next-auth'

export interface ProductType {
  id: number
  title: string
  price: number
  image: string
  description: string
}

export interface BlogType {
  id: number
  title: string
  image: string
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
