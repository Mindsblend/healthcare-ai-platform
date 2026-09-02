'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface CollectionCardProps {
  collection: {
    id: number
    name: string
    subtitle: string | null
    description: string | null
    image: string
    price: number
    slug: string
  }
  hasDiscount?: boolean
}

const CollectionCard = ({
  collection,
  hasDiscount = false,
}: CollectionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group w-full cursor-pointer"
    >
      <Link href={`/collections/${collection.slug}`} className="block">
        <div className="overflow-hidden rounded-3xl border border-black/25 p-3 sm:p-4 md:p-5">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute right-0 bottom-0 left-0 mb-3 p-4 sm:p-5">
              <h3 className="font-aria text-[20px] font-bold text-white sm:text-[24px]">
                {collection.name}
              </h3>
              <p className="font-ray mt-1 line-clamp-2 text-sm text-white/80 sm:max-w-[300px] md:max-w-[320px] lg:max-w-[349px]">
                {collection.description || ''}
              </p>
            </div>

            {hasDiscount && (
              <div className="absolute top-4 left-4 z-10">
                <span className="flex items-center rounded-full bg-black/80 px-3 py-1 text-xs font-medium text-white">
                  <Image
                    src="/images/discount.svg"
                    alt=""
                    width={14}
                    height={14}
                    className="mr-1.5 invert"
                  />
                  تخفیف ویژه
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 px-1 sm:mt-4 md:mt-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-aria text-sm font-semibold text-gray-600">
                    ارزش بازار:
                  </span>
                  <span className="font-aria text-base font-extrabold text-black">
                    {collection.price?.toLocaleString('fa-IR')} تومان
                  </span>
                </div>
                {collection.subtitle && (
                  <p className="font-ray mt-1 text-xs text-gray-500">
                    {collection.subtitle}
                  </p>
                )}
              </div>

              <div
                className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#F2F2F2] px-4 text-sm font-medium text-black transition hover:bg-gray-200 sm:w-auto sm:px-6"
              >
                مشاهده مجموعه
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
                  <Image
                    src="/images/arrow.svg"
                    alt="arrow"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default CollectionCard
