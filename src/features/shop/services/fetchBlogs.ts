import { prisma } from '@/lib/prisma'
import { BlogType } from '@/components/types/types'

export async function fetchBlogs(): Promise<BlogType[]> {
  return prisma.blog.findMany()
}
