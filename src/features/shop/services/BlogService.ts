import { prisma } from '@/lib/prisma'
import { BlogType } from '@/components/types/types'

export interface CreateBlogDTO {
  title: string
  image: string
  description: string
  author: string
  authorImage: string
}

export class BlogService {
  static async fetchBlogs(): Promise<BlogType[]> {
    return prisma.blog.findMany()
  }

  static async createBlog(data: CreateBlogDTO) {
    return prisma.blog.create({
      data: {
        title: data.title,
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
