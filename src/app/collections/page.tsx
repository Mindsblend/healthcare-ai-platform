import { CollectionService } from '@/features/shop/services/CollectionService'
import CollectionCard from '@/components/layout/CollectionCard'

export const dynamic = 'force-dynamic'

export default async function CollectionsPage() {
  const collections = await CollectionService.fetchAllCollections()

  return (
    <main className="container py-12 sm:py-20">
      <h1 className="font-aria text-3xl font-extrabold text-black sm:text-5xl">
        مجموعه‌های پیشنهادی سلامت
      </h1>
      <p className="font-ray mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
        مجموعه‌هایی از محصولات منتخب که انتخاب و خرید را ساده‌تر می‌کنند.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </main>
  )
}
