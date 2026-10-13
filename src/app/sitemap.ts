// src/app/sitemap.ts

import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
).replace(/\/$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /**
   * -----------------------------------------
   * Static public pages
   * -----------------------------------------
   */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: 'weekly',
      priority: 1,
    },

    {
      url: `${SITE_URL}/products`,
      changeFrequency: 'daily',
      priority: 0.9,
    },

    {
      url: `${SITE_URL}/blogs`,
      changeFrequency: 'daily',
      priority: 0.9,
    },

    {
      url: `${SITE_URL}/collections`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${SITE_URL}/ai`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },

    {
      url: `${SITE_URL}/legal/privacy-policy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/legal/return-policy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/legal/medical-disclaimer`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/legal/ai-transparency`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },

    {
      url: `${SITE_URL}/legal/platform-rules`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  /**
   * -----------------------------------------
   * Products
   * -----------------------------------------
   *
   */
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      slug: {
        not: '',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${encodeURIComponent(product.slug)}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  /**
   * -----------------------------------------
   * Blogs
   * -----------------------------------------
   *
   */
  const blogs = await prisma.blog.findMany({
    where: {
      slug: {
        not: '',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${SITE_URL}/blogs/${encodeURIComponent(blog.slug)}`,
    lastModified: blog.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  /**
   * -----------------------------------------
   * Collections
   * -----------------------------------------
   *
   */
  const collections = await prisma.collection.findMany({
    where: {
      isActive: true,
      slug: {
        not: '',
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  const collectionPages: MetadataRoute.Sitemap = collections.map(
    (collection) => ({
      url: `${SITE_URL}/collections/${encodeURIComponent(collection.slug)}`,
      lastModified: collection.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }),
  )

  /**
   * -----------------------------------------
   * Final sitemap
   * -----------------------------------------
   */
  return [...staticPages, ...productPages, ...blogPages, ...collectionPages]
}
