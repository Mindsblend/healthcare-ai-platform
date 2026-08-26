import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/JsonLd'
import { ProductService } from '@/features/shop/services/ProductService'
import { absoluteUrl, plainText } from '@/lib/seo'

export const dynamic = 'force-dynamic'

type Props = {
  children: React.ReactNode
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string) {
  return ProductService.fetchProductBySlug({
    slug: decodeURIComponent(slug).trim(),
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const product = await getProduct(slug)

  if (!product) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = `قیمت و خرید ${product.title}`

  const description =
    product.description || product.solution || `قیمت و خرید ${product.title}`

  const url = absoluteUrl(`/products/${product.slug}`)

  return {
    title,

    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      type: 'website',

      images: product.image
        ? [
            {
              url: absoluteUrl(product.image),
              alt: product.title,
            },
          ]
        : [],
    },

    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function ProductLayout({ children, params }: Props) {
  const { slug } = await params

  const product = await getProduct(slug)

  return (
    <>
      {product && (
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Product',

              name: product.title,

              description: plainText(
                product.description || product.solution || '',
                500,
              ),

              image: product.image ? [absoluteUrl(product.image)] : [],

              url: absoluteUrl(`/products/${product.slug}`),

              offers: {
                '@type': 'Offer',

                url: absoluteUrl(`/products/${product.slug}`),

                priceCurrency: 'IRR',

                price: String((product.discountedPrice ?? product.price) * 10),

                availability: 'https://schema.org/InStock',
              },
            },

            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',

              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'خانه',
                  item: absoluteUrl('/'),
                },

                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'محصولات',
                  item: absoluteUrl('/products'),
                },

                {
                  '@type': 'ListItem',
                  position: 3,
                  name: product.title,
                  item: absoluteUrl(`/products/${product.slug}`),
                },
              ],
            },

            ...(product.faqs?.length
              ? [
                  {
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',

                    mainEntity: product.faqs.map((faq) => ({
                      '@type': 'Question',

                      name: faq.question,

                      acceptedAnswer: {
                        '@type': 'Answer',
                        text: plainText(faq.answer || ''),
                      },
                    })),
                  },
                ]
              : []),
          ]}
        />
      )}
      {children}
    </>
  )
}
