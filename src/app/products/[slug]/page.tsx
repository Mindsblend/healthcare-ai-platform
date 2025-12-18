import {
  fetchAllProducts,
  fetchProductBySlug,
} from '@/features/shop/services/fetchProducts'

export async function generateStaticParams() {
  const products = await fetchAllProducts()

  return products
    .filter((product) => product.slug)
    .map((product) => ({
      slug: product.slug!,
    }))
}

export default async function ProductPage(props: { params: any }) {
  // unwrap the promise
  const { slug: rawSlug } = await props.params
  const slug = decodeURIComponent(rawSlug)

  if (!slug) return <div>محصول پیدا نشد</div>

  let product
  try {
    product = await fetchProductBySlug(slug)
  } catch (e) {
    return <div>محصول پیدا نشد</div>
  }

  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <p>{product.price}</p>
    </div>
  )
}
