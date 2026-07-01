// app/[locale]/dashboard/(others-pages)/collections/page.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useDeleteCollection } from '@/features/shop/hooks/collections/useDeleteCollection'
import { useUpdateCollection } from '@/features/shop/hooks/collections/useUpdateCollection'
import { useCollections } from '@/features/shop/hooks/collections/useCollections'
import { useProductsPreview } from '@/features/shop/hooks/products/useProductsPreview'
import PageBreadcrumb from '@/components/domain/dashboard/common/PageBreadCrumb'
import Image from 'next/image'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import Pagination from '@/components/domain/dashboard/tables/Pagination'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CollectionDetail, CollectionSummary } from '@/features/shop/shop.types'
import ConfirmPopup from '@/components/layout/ConfirmPopup'
import { useCollectionBySlug } from '@/features/shop/hooks/collections/useCollectionBySlug'

const Collections = () => {
  const router = useRouter()
  const { collections, loading, error } = useCollections()
  const { productsPreview, loading: productsLoading } = useProductsPreview()
  const { deleteCollection } = useDeleteCollection()
  const { updateCollection, loading: updating } = useUpdateCollection()

  const [selectedCollection, setSelectedCollection] =
    useState<CollectionDetail | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isFetchingCollection, setIsFetchingCollection] =
    useState<boolean>(false)

  // New state to drive the useCollectionBySlug hook
  const [fetchSlug, setFetchSlug] = useState<string>('')

  // Use the hook instead of direct fetch
  const {
    collection: fullCollection,
    loading: fetchingSlug,
    error: fetchError,
  } = useCollectionBySlug(fetchSlug || '')

  // Sync hook loading state with local isFetchingCollection
  useEffect(() => {
    setIsFetchingCollection(fetchingSlug)
  }, [fetchingSlug])

  // Set selectedCollection when data arrives
  useEffect(() => {
    if (fullCollection && !fetchingSlug) {
      setSelectedCollection(fullCollection)
    }
  }, [fullCollection, fetchingSlug])

  // Handle fetch errors
  useEffect(() => {
    if (fetchError) {
      console.error('Failed to fetch collection details:', fetchError)
    }
  }, [fetchError])

  // Form state for editing collection
  const [collectionId, setCollectionId] = useState<number>(0)
  const [name, setName] = useState<string>('')
  const [slug, setSlug] = useState<string>('')
  const [subtitle, setSubtitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [featured, setFeatured] = useState<boolean>(false)
  const [order, setOrder] = useState<number>(0)
  const [productIds, setProductIds] = useState<number[]>([])

  const [openIndex, setOpenIndex] = useState(false)
  const [collectionToDelete, setCollectionToDelete] = useState<{
    id: number
    name: string
  }>({ id: 0, name: '' })

  // Search and pagination state
  const [searchValue, setSearchValue] = useState<string>('')
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  // Ref for debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate total price based on selected products
  const calculateTotalPrice = useCallback(() => {
    const selectedProducts = productsPreview.filter((product) =>
      productIds.includes(product.id),
    )

    // Use discountedPrice if available, otherwise use regular price
    const total = selectedProducts.reduce((sum, product) => {
      const productPrice = product.discountedPrice || product.price
      return sum + productPrice
    }, 0)

    return total
  }, [productIds, productsPreview])

  // Auto-update price when product selection changes
  useEffect(() => {
    const total = calculateTotalPrice()
    setPrice(total.toString())
  }, [productIds, productsPreview, calculateTotalPrice])

  // Effect to update form when selectedCollection changes
  useEffect(() => {
    if (selectedCollection && !isFetchingCollection) {
      setCollectionId(selectedCollection.id)
      setName(selectedCollection.name || '')
      setSlug(selectedCollection.slug || '')
      setSubtitle(selectedCollection.subtitle || '')
      setDescription(selectedCollection.description || '')
      setPrice(selectedCollection.price?.toString() || '0')
      setImage(selectedCollection.image || '')
      setFeatured(selectedCollection.featured || false)
      setOrder(selectedCollection.order || 0)
      setProductIds(selectedCollection.products?.map((p) => p.product.id) || [])
    }
  }, [selectedCollection, isFetchingCollection])

  // Debounce search input
  const handleSearchChange = useCallback((value: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchValue(value)
      setPage(1)
    }, 500)
  }, [])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
    handleSearchChange(value)
  }

  // Clear search
  const clearSearch = () => {
    setSearchValue('')
    setDebouncedSearchValue('')
    setPage(1)
  }

  // Filter collections based on debounced search value
  const filteredCollections = collections.filter(
    (collection: CollectionSummary) => {
      if (!debouncedSearchValue.trim()) return true

      const searchTerm = debouncedSearchValue.toLowerCase().trim()

      return (
        collection.id?.toString().includes(searchTerm) ||
        collection.name?.toLowerCase().includes(searchTerm) ||
        collection.slug?.toLowerCase().includes(searchTerm) ||
        collection.description?.toLowerCase().includes(searchTerm)
      )
    },
  )

  const itemsPerPage = 7
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage)
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages)
  const startIndex = (safePage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredCollections.slice(startIndex, endIndex)

  const showEmptyState =
    !loading && !error && !collections.length && !debouncedSearchValue

  const handleDelete = async (id: number) => {
    await deleteCollection({ id })
    router.refresh()
  }

  // Simplified handler: just set the slug to trigger the hook
  const handleViewCollection = (collection: CollectionSummary) => {
    setFetchSlug(collection.slug)
    setIsModalOpen(true)
  }

  const handleApplyChanges = async () => {
    if (!selectedCollection) return

    const updateData = {
      id: collectionId,
      name,
      slug,
      subtitle,
      description,
      price: parseInt(price),
      image,
      featured,
      order,
      productIds,
    }

    try {
      await updateCollection(updateData)
      setIsModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to update collection:', error)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  const handleProductSelect = (productId: number, checked: boolean) => {
    if (checked) {
      setProductIds((prev) => [...prev, productId])
    } else {
      setProductIds((prev) => prev.filter((id) => id !== productId))
    }
  }

  // Get selected products for display
  const selectedProducts = productsPreview.filter((product) =>
    productIds.includes(product.id),
  )

  return (
    <div>
      <div>
        <PageBreadcrumb pageTitle="مجموعه‌ها" />

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white pt-4 pb-3 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                مجموعه‌ها
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تمامی مجموعه‌های سایت
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex gap-2">
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2">
                    <svg
                      className="fill-gray-500 dark:fill-gray-400"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                        fill=""
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={searchValue}
                    onChange={handleSearchInput}
                    placeholder="جست و جو کنید..."
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pr-4 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[430px] dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
                  />
                </div>

                {searchValue && (
                  <button
                    onClick={clearSearch}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                    aria-label="پاک کردن جستجو"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <Link
                href={'/dashboard/addcollection'}
                className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
              >
                ساخت مجموعه
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M5 10.0002H15.0006M10.0002 5V15.0006"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-gray-800">
                <TableRow>
                  <TableCell
                    isHeader
                    className="text-theme-xs py-3 pr-4 text-start font-medium text-gray-500 sm:pr-6 dark:text-gray-400"
                  >
                    شماره
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    مجموعه
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs py-3 font-medium text-gray-500 dark:text-gray-400"
                  >
                    مشاهده جزئیات
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    قیمت
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    ویژه
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    مدیریت
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                {showEmptyState ? (
                  <TableRow>
                    <td colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 text-gray-400">
                          <svg
                            width="48"
                            height="48"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path d="M4 4h16v16H4z" />
                            <path d="M8 8h8v2H8zM8 12h6v2H8z" />
                          </svg>
                        </div>
                        <h3 className="text-color-title-on-light mb-2 text-lg font-semibold">
                          مجموعه‌ای وجود ندارد
                        </h3>
                        <p className="text-sm text-gray-500">
                          هنوز هیچ مجموعه‌ای ثبت نشده است.
                        </p>
                      </div>
                    </td>
                  </TableRow>
                ) : currentData.length === 0 && debouncedSearchValue ? (
                  <TableRow>
                    <td colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 text-gray-400">
                          <svg
                            width="48"
                            height="48"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363Z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-color-title-on-light mb-2 text-lg font-semibold">
                          نتیجه‌ای یافت نشد
                        </h3>
                        <p className="text-sm text-gray-500">
                          مجموعه‌ای با "{debouncedSearchValue}" پیدا نشد.
                        </p>
                        <button
                          onClick={clearSearch}
                          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          پاک کردن جستجو
                        </button>
                      </div>
                    </td>
                  </TableRow>
                ) : (
                  currentData.map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell className="text-theme-sm py-3 pr-4 font-medium text-gray-800 sm:pr-6 dark:text-white/90">
                        {collection.id}
                      </TableCell>

                      <TableCell className="py-3 text-gray-800">
                        <div className="flex items-center gap-3">
                          {collection.image &&
                          collection.image.trim() !== '' ? (
                            <Image
                              src={collection.image}
                              alt={collection.name}
                              width={80}
                              height={80}
                              className="h-20 w-20 rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
                              <span className="text-xs text-gray-400">
                                بدون تصویر
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-gray-800 dark:text-white/90">
                            {collection.name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-theme-sm py-3 text-center font-medium text-gray-800 dark:text-white/90">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleViewCollection(collection)}
                            className="transition-opacity hover:opacity-80"
                          >
                            <Image
                              src="/images/eye.svg"
                              alt="مشاهده جزئیات"
                              width={24}
                              height={24}
                              className="opacity-70 transition-opacity hover:opacity-100"
                            />
                          </button>
                        </div>
                      </TableCell>

                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        {collection.price.toLocaleString('fa-IR')} تومان
                      </TableCell>

                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        {collection.featured ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                            ویژه
                          </span>
                        ) : (
                          '—'
                        )}
                      </TableCell>

                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setCollectionToDelete({
                                id: collection.id,
                                name: collection.name,
                              })
                              setOpenIndex(true)
                            }}
                            className="text-gray-500 transition-colors"
                            aria-label="حذف مجموعه"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-5 w-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredCollections.length > 0 && (
            <>
              <hr className="my-2" />
              <div className="pt-3">
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Popup for Editing Collection */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-100000 bg-black/50"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="relative w-full max-w-2xl rounded-lg bg-white dark:bg-gray-900"
            style={{
              maxHeight: 'calc(100vh - 2rem)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {isFetchingCollection
                  ? 'در حال بارگذاری...'
                  : `ویرایش مجموعه - ${selectedCollection?.name}`}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                  setFetchSlug('') // Reset slug to stop any pending fetch
                }}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div
              className="flex-1 overflow-y-auto p-4"
              style={{
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch',
              }}
              onWheel={(e) => {
                e.stopPropagation()
                // Allow scrolling within the modal
                const target = e.currentTarget
                const isAtTop = target.scrollTop === 0 && e.deltaY < 0
                const isAtBottom =
                  target.scrollHeight -
                    target.scrollTop -
                    target.clientHeight <=
                    1 && e.deltaY > 0

                if (!isAtTop && !isAtBottom) {
                  e.stopPropagation()
                }
              }}
              onTouchMove={(e) => {
                const target = e.currentTarget
                const isAtTop =
                  target.scrollTop === 0 &&
                  (e.target as HTMLElement).scrollTop === 0
                const isAtBottom =
                  target.scrollHeight -
                    target.scrollTop -
                    target.clientHeight <=
                  1

                if (!isAtTop && !isAtBottom) {
                  e.stopPropagation()
                }
              }}
            >
              {isFetchingCollection ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                      در حال بارگذاری اطلاعات مجموعه...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Collection Image Preview */}
                  <div className="flex justify-center">
                    <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700">
                      <Image
                        src={
                          image && image.startsWith('http')
                            ? image
                            : '/images/placeholder.png'
                        }
                        alt={name || 'Collection image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      نام مجموعه
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      dir="rtl"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      اسلاگ (slug)
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2.5 font-mono text-sm text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      dir="ltr"
                    />
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      زیر عنوان
                    </label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      dir="rtl"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      توضیحات
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      dir="rtl"
                    />
                  </div>

                  {/* Price Display - Read Only */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      قیمت کل مجموعه (تومان)
                    </label>
                    <div className="w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90">
                      {parseInt(price).toLocaleString('fa-IR')} تومان
                    </div>
                    <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                      قیمت به‌طور خودکار از مجموع قیمت محصولات انتخاب شده محاسبه
                      می‌شود
                    </p>
                  </div>

                  {/* Order and Featured */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        ترتیب نمایش
                      </label>
                      <input
                        type="number"
                        value={order}
                        onChange={(e) =>
                          setOrder(parseInt(e.target.value) || 0)
                        }
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          مجموعه ویژه
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Products Selection */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      محصولات مجموعه
                    </label>
                    <p className="mb-2 text-xs text-gray-500">
                      {selectedProducts.length} محصول انتخاب شده | مجموع قیمت:{' '}
                      {parseInt(price).toLocaleString('fa-IR')} تومان
                    </p>
                    <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-300 p-2">
                      {productsPreview.map((product) => {
                        const productPrice =
                          product.discountedPrice || product.price
                        return (
                          <label
                            key={product.id}
                            className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <input
                              type="checkbox"
                              checked={productIds.includes(product.id)}
                              onChange={(e) =>
                                handleProductSelect(
                                  product.id,
                                  e.target.checked,
                                )
                              }
                              className="h-4 w-4 rounded border-gray-300"
                            />
                            <div className="relative h-10 w-10 overflow-hidden rounded-md bg-gray-100">
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
                                {product.title}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {product.discount ? (
                                  <>
                                    <span className="line-through">
                                      {product.price.toLocaleString('fa-IR')}{' '}
                                      تومان
                                    </span>{' '}
                                    <span className="font-semibold text-green-600">
                                      {productPrice.toLocaleString('fa-IR')}{' '}
                                      تومان
                                    </span>
                                    <span className="text-red-500">
                                      {' '}
                                      (-{product.discount}%)
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    {product.price.toLocaleString('fa-IR')}{' '}
                                    تومان
                                  </>
                                )}
                              </p>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      تصویر مجموعه
                    </label>

                    {image && (
                      <div className="mb-3">
                        <p className="mb-2 text-sm text-gray-500">
                          تصویر فعلی:
                        </p>
                        <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          <Image
                            src={
                              image.startsWith('http')
                                ? image
                                : `/uploads/${image}`
                            }
                            alt="Collection image"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return

                        const formData = new FormData()
                        formData.append('file', file)
                        formData.append('folder', 'collections')

                        try {
                          const response = await fetch('/api/upload', {
                            method: 'POST',
                            body: formData,
                          })
                          const data = await response.json()
                          if (data.url) {
                            setImage(data.url)
                          }
                        } catch (error) {
                          console.error('Upload failed:', error)
                        }
                      }}
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t p-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-white/90 dark:hover:bg-gray-800"
              >
                انصراف
              </button>
              <button
                onClick={handleApplyChanges}
                disabled={updating}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating ? 'در حال ذخیره...' : 'اعمال تغییرات'}
              </button>
            </div>
          </div>
        </div>
      )}
      <ConfirmPopup
        isOpen={openIndex}
        onClose={() => setOpenIndex(false)}
        onConfirm={async () => {
          await handleDelete(collectionToDelete.id)
          setOpenIndex(false)
        }}
        popupTitle={`آیا از حذف "${collectionToDelete.name}" مطمئن هستید؟`}
        descriptionText={
          'در صورت حذف این مجموعه، تمام اطلاعات مربوط به آن به‌طور دائمی پاک می‌شود.'
        }
        confirmButtonText={'حذف'}
        cancelButtonText={'انصراف'}
      />
    </div>
  )
}

export default Collections
