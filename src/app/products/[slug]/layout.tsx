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

  // Product not found
  if (!product) {
    return {
      title: 'محصول پیدا نشد',

      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = `قیمت و خرید ${product.title}`

  const description =
    plainText(product.description || product.solution || '', 160) ||
    `قیمت و خرید ${product.title} از ${'دیجی سلامت'}`

  const url = absoluteUrl(`/products/${product.slug}`)

  const image = product.image?.trim() ? absoluteUrl(product.image) : undefined

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url,
      type: 'website',
      locale: 'fa_IR',
      images: image
        ? [
            {
              url: image,
              width: 1200,
              height: 630,
              alt: product.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function ProductLayout({ children, params }: Props) {
  const { slug } = await params

  const product = await getProduct(slug)

  if (!product) {
    return <>{children}</>
  }

  const productUrl = absoluteUrl(`/products/${product.slug}`)

  const productDescription = plainText(
    product.description || product.solution || '',
    500,
  )

  const productImage = product.image?.trim()
    ? [absoluteUrl(product.image)]
    : undefined

  const price = product.discountedPrice ?? product.price

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',

            name: product.title,

            description: productDescription,

            image: productImage,

            url: productUrl,

            offers: {
              '@type': 'Offer',

              url: productUrl,

              priceCurrency: 'IRR',

              price: String((product.discountedPrice ?? product.price) * 10),

              availability: 'https://schema.org/InStock',

              seller: {
                '@type': 'Organization',
                name: 'دیجی سلامت',
              },
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
                item: productUrl,
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

                    name: plainText(faq.question, 300),

                    acceptedAnswer: {
                      '@type': 'Answer',
                      text: plainText(faq.answer || '', 1000),
                    },
                  })),
                },
              ]
            : []),
        ]}
      />

      {children}
    </>
  )
}
