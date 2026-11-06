import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { JsonLd } from '@/components/seo/JsonLd'
import { CollectionService } from '@/features/shop/services/CollectionService'
import { absoluteUrl, pageMetadata, plainText } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = { children: React.ReactNode; params: Promise<{ slug: string }> }

async function getCollection(slug: string) {
  return CollectionService.fetchCollectionBySlug(decodeURIComponent(slug))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCollection(slug)
  if (!collection)
    return { title: 'مجموعه پیدا نشد', robots: { index: false, follow: false } }

  return pageMetadata({
    title: collection.name,
    description: collection.description,
    path: `/collections/${collection.slug}`,
    image: collection.image,
  })
}

export default async function CollectionLayout({ children, params }: Props) {
  const { slug } = await params
  const collection = await getCollection(slug)
  if (!collection) notFound()

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: collection.name,
          description: plainText(collection.description, 300),
          url: absoluteUrl(`/collections/${collection.slug}`),
          image: collection.image,
        }}
      />
      {children}
    </>
  )
}
