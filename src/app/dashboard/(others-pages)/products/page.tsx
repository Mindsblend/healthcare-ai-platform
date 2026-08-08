'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useDeleteProduct } from '@/features/shop/hooks/products/deleteProduct'
import { useUpdateProduct } from '@/features/shop/hooks/products/updateProduct'
import { useProductsPreview } from '@/features/shop/hooks/products/useProductsPreview'
import { getProductBySlug } from '@/features/shop/actions/products/getProductBySlugAction'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import { useFeedCategories } from '@/features/shop/hooks/feed/useFeedCategories'
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
import {
  GetProductBySlugResponse,
  GetProductsByCategoryResponse,
  ProductSummary,
} from '@/features/shop/shop.types'
import LoadingBar from '@/components/layout/LoadingBar'
import ConfirmPopup from '@/components/layout/ConfirmPopup'

const Products = () => {
  const router = useRouter()
  const { productsPreview, loading, error } = useProductsPreview()
  const { categories } = useCategories()
  const { feedCategories } = useFeedCategories()
  const { deleteProduct } = useDeleteProduct()
  const { updateProduct, loading: updating } = useUpdateProduct()

  const [selectedProduct, setSelectedProduct] = useState<
    GetProductBySlugResponse | null | undefined
  >(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isFetchingProduct, setIsFetchingProduct] = useState<boolean>(false)

  // Form state for editing product
  const [productId, setProductId] = useState<number>(0)
  const [title, setTitle] = useState<string>('')
  const [price, setPrice] = useState<string>('')
  const [discount, setDiscount] = useState<string>('')
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null)
  const [slug, setSlug] = useState<string>('')
  const [solution, setSolution] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [feedCategoryId, setFeedCategoryId] = useState<number | undefined>(
    undefined,
  )

  const [openIndex, setOpenIndex] = useState(false)

  // Search and pagination state
  const [searchValue, setSearchValue] = useState<string>('')
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  // Ref for debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-calculate discounted price when price or discount changes
  useEffect(() => {
    const priceNum = parseInt(price)
    const discountNum = parseInt(discount)

    if (!isNaN(priceNum) && !isNaN(discountNum) && discountNum > 0) {
      const calculated = priceNum - (priceNum * discountNum) / 100
      setDiscountedPrice(Math.round(calculated))
    } else {
      setDiscountedPrice(null)
    }
  }, [price, discount])

  // Effect to update form when selectedProduct changes
  useEffect(() => {
    if (selectedProduct && !isFetchingProduct) {
      setProductId(selectedProduct.id)
      setTitle(selectedProduct.title)
      setPrice(selectedProduct.price.toString())
      setDiscount(selectedProduct.discount?.toString() || '')
      setDiscountedPrice(selectedProduct.discountedPrice || null)
      setSlug(selectedProduct.slug)
      setSolution(selectedProduct.solution)
      setImage(selectedProduct.image)
      setDescription(selectedProduct.description || '')
      setCategoryId(selectedProduct.categoryId)
      setFeedCategoryId(selectedProduct.feedCategoryId || undefined)
    }
  }, [selectedProduct, isFetchingProduct])

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

  // Filter products based on debounced search value
  const filteredProducts = productsPreview.filter(
    (product: GetProductsByCategoryResponse) => {
      if (!debouncedSearchValue.trim()) return true

      const searchTerm = debouncedSearchValue.toLowerCase().trim()

      return (
        product.id?.toString().includes(searchTerm) ||
        product.title?.toLowerCase().includes(searchTerm) ||
        product.slug?.toLowerCase().includes(searchTerm) ||
        product.price?.toString().includes(searchTerm) ||
        product.category?.name?.toLowerCase().includes(searchTerm)
      )
    },
  )

  const itemsPerPage = 7
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  // Safe page calculation
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages)

  const startIndex = (safePage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredProducts.slice(startIndex, endIndex)

  const showEmptyState =
    !loading && !error && !productsPreview.length && !debouncedSearchValue

  const handleDelete = async (id: number) => {
    console.log('🟢 handleDelete called with id:', id, 'type:', typeof id)
    await deleteProduct({ id })
    router.refresh()
  }

  const handleViewProduct = async (product: ProductSummary) => {
    setIsFetchingProduct(true)
    setIsModalOpen(true)

    try {
      const fullProduct = await getProductBySlug({ slug: product.slug })
      setSelectedProduct(fullProduct)
      setTitle(fullProduct.title)
      setPrice(fullProduct.price.toString())
      setDiscount(fullProduct.discount?.toString() || '')
      setDiscountedPrice(fullProduct.discountedPrice || null)
      setSlug(fullProduct.slug)
      setSolution(fullProduct.solution)
      setImage(fullProduct.image)
      setDescription(fullProduct.description || '')
      setCategoryId(fullProduct.categoryId)
      setFeedCategoryId(fullProduct.feedCategoryId || undefined)
    } catch (error) {
      console.error('Failed to fetch product details:', error)
    } finally {
      setIsFetchingProduct(false)
    }
  }

  const handleApplyChanges = async () => {
    if (!selectedProduct) return

    // Parse price - must be a valid number
    const parsedPrice = parseInt(price)
    if (isNaN(parsedPrice)) {
      console.error('Invalid price')
      return
    }

    // Parse discount - ALWAYS send a number (0 if empty or invalid)
    let parsedDiscount = 0
    if (discount !== null && discount !== undefined && discount !== '') {
      const discountValue = parseInt(discount)
      if (!isNaN(discountValue)) {
        parsedDiscount = discountValue
      }
    }

    const updateData = {
      id: selectedProduct.id,
      title,
      price: parsedPrice,
      discount: parsedDiscount,
      slug,
      solution,
      image,
      description,
      categoryId: categoryId!,
      feedCategoryId: feedCategoryId,
    }

    try {
      await updateProduct(updateData)
      setIsModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }

  return (
    <LoadingBar loading={loading} error={error}>
      <div>
        <PageBreadcrumb pageTitle="محصولات" />

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white pt-4 pb-3 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                محصولات
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تمامی محصولات سایت
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
                href="/dashboard/addproduct"
                className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
              >
                ساخت محصول
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
                  ></path>
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
                    محصولات
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
                    دسته بندی
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
                            <path d="M3 7l9-4 9 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                            <path d="M3 7l9 6 9-6" />
                          </svg>
                        </div>

                        <h3 className="text-color-title-on-light mb-2 text-lg font-semibold">
                          محصولی وجود ندارد
                        </h3>

                        <p className="text-sm text-gray-500">
                          هنوز هیچ محصولی ثبت نشده است.
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
                          محصولی با "{debouncedSearchValue}" پیدا نشد.
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
                  currentData.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="text-theme-sm py-3 pr-4 font-medium text-gray-800 sm:pr-6 dark:text-white/90">
                        {product.id}
                      </TableCell>

                      <TableCell className="py-3 text-gray-800">
                        <div className="flex items-center gap-3">
                          {product.image && product.image.trim() !== '' ? (
                            <Image
                              src={product.image}
                              alt="product image"
                              width={60}
                              height={60}
                              className="rounded-2xl object-cover"
                            />
                          ) : (
                            <div className="flex h-15 w-15 items-center justify-center rounded-2xl bg-gray-100">
                              <span className="text-xs text-gray-400">
                                بدون تصویر
                              </span>
                            </div>
                          )}
                          <span className="font-medium text-gray-800 dark:text-white/90">
                            {product.title}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="text-theme-sm py-3 text-center font-medium text-gray-800 dark:text-white/90">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleViewProduct(product)}
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
                        {product.category?.name || 'دسته‌بندی نشده'}
                      </TableCell>

                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        {product.price.toLocaleString('fa-IR')} تومان
                      </TableCell>

                      <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setProductId(product.id)
                              setOpenIndex(true)
                            }}
                            className="text-gray-500 transition-colors"
                            aria-label="حذف محصول"
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

          {filteredProducts.length > 0 && (
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

      {/* Modal Popup for Editing Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center bg-black/50 p-4">
          <div className="mx-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between border-b bg-white p-4 dark:bg-gray-900">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {isFetchingProduct
                  ? 'در حال بارگذاری...'
                  : `ویرایش محصول - ${selectedProduct?.title}`}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            {isFetchingProduct ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900 dark:border-white"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    در حال بارگذاری اطلاعات محصول...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-6 p-4">
                  {/* Product Image Preview */}
                  <div className="flex justify-center">
                    <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700">
                      <Image
                        src={
                          image && image.startsWith('http')
                            ? image
                            : '/images/placeholder.png'
                        }
                        alt={title || 'Product image'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      عنوان محصول
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      dir="rtl"
                    />
                  </div>

                  {/* Price and Discount Row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        قیمت (تومان)
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        تخفیف (درصد)
                      </label>
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="مثال: 15"
                        min="0"
                        max="100"
                        className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      />
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        قیمت پس از تخفیف به‌طور خودکار محاسبه می‌شود
                      </p>
                    </div>
                  </div>

                  {/* Discounted Price Preview */}
                  {discountedPrice && (
                    <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        <span className="font-semibold">قیمت پس از تخفیف:</span>{' '}
                        {discountedPrice.toLocaleString('fa-IR')} تومان
                      </p>
                    </div>
                  )}

                  {/* Product Category Dropdown */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      دسته‌بندی محصول
                    </label>
                    <select
                      value={categoryId || ''}
                      onChange={(e) =>
                        setCategoryId(
                          e.target.value ? Number(e.target.value) : null,
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                    >
                      <option value="">انتخاب دسته‌بندی</option>
                      {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Feed Category Dropdown */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      دسته‌بندی فید
                    </label>
                    <select
                      value={feedCategoryId || ''}
                      onChange={(e) =>
                        setFeedCategoryId(
                          e.target.value ? Number(e.target.value) : undefined,
                        )
                      }
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                    >
                      <option value="">انتخاب دسته‌بندی فید</option>
                      {feedCategories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
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

                  {/* Solution */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      راهکار محصول
                    </label>
                    <textarea
                      value={solution}
                      onChange={(e) => setSolution(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 p-2.5 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:text-white/90"
                      dir="rtl"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      تصویر محصول
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
                            alt="Product image"
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
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 flex justify-end gap-3 border-t bg-white p-4 dark:bg-gray-900">
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
              </>
            )}
          </div>
        </div>
      )}
      <ConfirmPopup
        isOpen={openIndex}
        onClose={() => setOpenIndex(false)}
        onConfirm={async () => {
          await handleDelete(productId)
          setOpenIndex(false)
        }}
        popupTitle={`آیا از حذف "${title}" مطمئن هستید؟`}
        descriptionText={
          'در صورت حذف این محصول، تمام اطلاعات مربوط به آن به‌طور دائمی پاک می‌شود.'
        }
        confirmButtonText={'حذف'}
        cancelButtonText={'انصراف'}
      />
    </LoadingBar>
  )
}

export default Products
