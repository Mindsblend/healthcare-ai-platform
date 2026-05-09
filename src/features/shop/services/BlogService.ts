import { prisma } from '@/lib/prisma'
import { BlogDetail, BlogSummary, BlogType } from '@/components/types/types'

export interface CreateBlogDTO {
  title: string
  slug: string
  image: string
  description: string
  author: string
  authorImage: string
}

export class BlogService {
  static async fetchBlogsPreview(): Promise<BlogSummary[]> {
    return prisma.blog.findMany()
  }

  static async fetchBlogBySlug(slug: string): Promise<BlogDetail | null> {
    return prisma.blog.findUnique({
      where: { slug },
    })
  }

  static async createBlog(data: CreateBlogDTO) {
    return prisma.blog.create({
      data: {
        title: data.title,
        slug: data.slug,
        image: data.image,
        description: data.description,
        author: data.author,
        authorImage: data.authorImage,
      },
    })
  }

  static async deleteBlog(id: number) {
    return prisma.blog.delete({
      where: { id },
    })
  }
}
