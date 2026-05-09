'use client'

import { useState, useEffect } from 'react'
import { useDeleteProduct } from '@/features/shop/hooks/products/deleteProduct'
import { useUpdateProduct } from '@/features/shop/hooks/products/updateProduct'
import { useProductsPreview } from '@/features/shop/hooks/products/useProductsPreview'
import { useProductBySlug } from '@/features/shop/hooks/products/useProductBySlug' // Add this
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
import { ProductDetail, ProductSummary } from '@/components/types/types'

const Products = () => {
  const router = useRouter()
  const { productsPreview, loading, error } = useProductsPreview()
  const { deleteProduct } = useDeleteProduct()
  const { updateProduct, loading: updating } = useUpdateProduct()

  // Hook to fetch full product details when needed
  const {
    product: fetchedProduct,
    loading: productLoading,
    getProductBySlug,
  } = useProductBySlug('') // TODO: implement product slug in admin dashboard and use this method in that page.tsx. we are using the action method in this hook temporary

  const [selectedProduct, setSelectedProduct] = useState<ProductDetail | null>(
    null,
  )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFetchingProduct, setIsFetchingProduct] = useState(false)

  // Form state for editing product
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [slug, setSlug] = useState('')
  const [solution, setSolution] = useState('')
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)

  const handleDelete = async (id: number, title: string) => {
    const ok = window.confirm(`آیا از حذف "${title}" مطمئن هستید؟`)
    if (!ok) return

    await deleteProduct(id)
    router.refresh()
  }

  const handleViewProduct = async (product: ProductSummary) => {
    setIsFetchingProduct(true)
    setIsModalOpen(true)

    try {
      const fullProduct = await getProductBySlug(product.slug)

      setSelectedProduct(fullProduct)
      setTitle(fullProduct.title)
      setPrice(fullProduct.price.toString())
      setSlug(fullProduct.slug)
      setSolution(fullProduct.solution)
      setImage(fullProduct.image)
      setDescription(fullProduct.description || '')
      setCategoryId(fullProduct.categoryId)
    } catch (error) {
      console.error('Failed to fetch product details:', error)
    } finally {
      setIsFetchingProduct(false)
    }
  }

  const handleApplyChanges = async () => {
    if (!selectedProduct) return

    try {
      await updateProduct(selectedProduct.id, {
        title,
        price: parseInt(price),
        slug,
        solution,
        image,
        description,
        categoryId: categoryId!,
      })
      setIsModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to update product:', error)
    }
  }

  const [page, setPage] = useState(1)

  const itemsPerPage = 7
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = productsPreview.slice(startIndex, endIndex)

  if (loading) return <div>در حال بارگذاری محصولات...</div>

  if (error) return <div>خطا در بارگذاری محصولات: {error}</div>

  if (!productsPreview.length) {
    return (
      <div>
        <PageBreadcrumb pageTitle="محصولات" />

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white pt-4 pb-3 dark:border-gray-800 dark:bg-white/3">
          <div className="mb-4 flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                محصولات
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تمامی محصولات سایت
              </p>
            </div>

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
                placeholder="جست و جو کنید..."
                className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pr-4 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[430px] dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
              />
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

                      <h3 className="mb-2 text-lg font-semibold">
                        محصولی وجود ندارد
                      </h3>

                      <p className="text-sm text-gray-500">
                        هنوز هیچ محصولی ثبت نشده است.
                      </p>
                    </div>
                  </td>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <hr />
        </div>
      </div>
    )
  }

  return (
    <>
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

            <div className="flex items-center justify-center gap-3">
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
                  placeholder="جست و جو کنید..."
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pr-4 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[430px] dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
                />
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
                {currentData.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="text-theme-sm py-3 pr-4 font-medium text-gray-800 sm:pr-6 dark:text-white/90">
                      {product.id}
                    </TableCell>

                    <TableCell className="py-3 text-gray-800">
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            product.image && product.image.startsWith('http')
                              ? product.image
                              : '/images/placeholder.png'
                          }
                          alt="products image"
                          width={48}
                          height={48}
                          className="cursor-pointer rounded"
                          onClick={() => handleViewProduct(product)}
                        />
                        {product.title}
                      </div>
                    </TableCell>

                    <TableCell className="text-theme-sm py-3 text-center font-medium text-gray-800 dark:text-white/90">
                      <div className="flex items-center justify-center">
                        <button onClick={() => handleViewProduct(product)}>
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
                      {product.category.name}
                    </TableCell>

                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      {product.price.toLocaleString('fa-IR')} تومان
                    </TableCell>

                    <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={async () => {
                            await handleDelete(product.id, product.title)
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-5 text-[#687287]"
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
                ))}
              </TableBody>
            </Table>
          </div>
          <hr />
          <div className="pt-3">
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(productsPreview.length / itemsPerPage)}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </div>
      </div>

      {/* Modal Popup for Editing Product */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {isFetchingProduct
                  ? 'در حال بارگذاری...'
                  : `ویرایش محصول - ${selectedProduct?.title}`}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            {isFetchingProduct ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
                  <p className="mt-4 text-gray-600">
                    در حال بارگذاری اطلاعات محصول...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-6 p-4">
                  {/* Product Image Preview */}
                  <div className="flex justify-center">
                    <Image
                      src={
                        image && image.startsWith('http')
                          ? image
                          : '/images/placeholder.png'
                      }
                      alt={title}
                      width={120}
                      height={120}
                      className="rounded-lg object-cover"
                    />
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
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 dark:border-gray-700 dark:text-white/90"
                      dir="rtl"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      قیمت (تومان)
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 dark:border-gray-700 dark:text-white/90"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      اسلاگ
                    </label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 dark:border-gray-700 dark:text-white/90"
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
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 dark:border-gray-700 dark:text-white/90"
                      dir="rtl"
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      آدرس تصویر
                    </label>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 dark:border-gray-700 dark:text-white/90"
                      dir="ltr"
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
                      className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 dark:border-gray-700 dark:text-white/90"
                      dir="rtl"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t p-4">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-white/90 dark:hover:bg-gray-800"
                  >
                    انصراف
                  </button>
                  <button
                    onClick={handleApplyChanges}
                    disabled={updating}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updating ? 'در حال ذخیره...' : 'اعمال تغییرات'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Products
