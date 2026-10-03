import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { BlogService } from '@/features/shop/services/BlogService'
import { absoluteUrl, pageMetadata, plainText } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { children: React.ReactNode; params: Promise<{ slug: string }> }

async function getBlog(slug: string) {
  return BlogService.fetchBlogBySlug({ slug: decodeURIComponent(slug) })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog)
    return { title: 'مقاله پیدا نشد', robots: { index: false, follow: false } }

  return pageMetadata({
    title: blog.title,
    description: blog.description,
    path: `/blogs/${blog.slug}`,
    image: blog.image,
    type: 'article',
  })
}

export default async function BlogLayout({ children, params }: Props) {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) notFound()

  const url = absoluteUrl(`/blogs/${blog.slug}`)
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: blog.title,
          description: plainText(blog.description, 200),
          image: [blog.image],
          mainEntityOfPage: url,
          datePublished: blog.createdAt.toISOString(),
          dateModified: blog.updatedAt.toISOString(),
          author: { '@type': 'Person', name: blog.author },
        }}
      />
      {children}
    </>
  )
}
