import { prisma } from '@/lib/prisma'
import { BlogType } from '@/components/types/types'

export class BlogService {
  static async fetchBlogs(): Promise<BlogType[]> {
    return prisma.blog.findMany()
  }
}
