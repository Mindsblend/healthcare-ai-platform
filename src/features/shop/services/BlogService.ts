// features/shop/blogs/services/blogService.ts

import { prisma } from '@/lib/prisma'
import {
  CreateBlogInput,
  DeleteBlogInput,
  GetBlogBySlugInput,
  GetBlogBySlugResponse,
  BlogSummary,
} from '../shop.types'

export class BlogService {
  static async fetchBlogsPreview(): Promise<BlogSummary[]> {
    return prisma.blog.findMany()
  }

  static async fetchBlogBySlug(
    input: GetBlogBySlugInput,
  ): Promise<GetBlogBySlugResponse | null> {
    const { slug } = input
    return prisma.blog.findUnique({
      where: { slug },
    })
  }

  static async createBlog(input: CreateBlogInput) {
    const {
      title,
      slug,
      description,
      image,
      author,
      authorImage,
      content,
      authorTitle,
    } = input
    return prisma.blog.create({
      data: {
        title,
        slug,
        description,
        image,
        author,
        authorImage,
        content,
        authorTitle,
      },
    })
  }

  static async deleteBlog(input: DeleteBlogInput) {
    const { id } = input
    return prisma.blog.delete({
      where: { id },
    })
  }
}
