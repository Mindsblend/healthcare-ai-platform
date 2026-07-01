// app/[locale]/dashboard/(others-pages)/addcollection/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useCreateCollection } from '@/features/shop/hooks/collections/useCreateCollection'
import { useProductsPreview } from '@/features/shop/hooks/products/useProductsPreview'
import PageBreadcrumb from '@/components/domain/dashboard/common/PageBreadCrumb'
import LoadingBar from '@/components/layout/LoadingBar'
import InformPopup from '@/components/layout/InformPopup'
import { ImageUploader } from '@/components/domain/dashboard/form/ImageUpload'
import Image from 'next/image'

const AddCollection = () => {
  const [form, setForm] = useState({
    name: '',
    slug: '',
    subtitle: '',
    description: '',
    image: '',
    featured: false,
    order: 0,
    productIds: [] as number[],
  })

  const { createCollection, loading, error } = useCreateCollection()
  const { productsPreview, loading: productsLoading } = useProductsPreview()

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0)

  // Calculate total price based on selected products
  useEffect(() => {
    const selectedProducts = productsPreview.filter((product) =>
      form.productIds.includes(product.id),
    )

    const total = selectedProducts.reduce((sum, product) => {
      const productPrice = product.discountedPrice || product.price
      return sum + productPrice
    }, 0)

    setCalculatedPrice(total)
  }, [form.productIds, productsPreview])

  const handleChange = (
    field: keyof typeof form,
    value: string | boolean | number | number[],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleProductSelect = (productId: number, checked: boolean) => {
    if (checked) {
      setForm((prev) => ({
        ...prev,
        productIds: [...prev.productIds, productId],
      }))
    } else {
      setForm((prev) => ({
        ...prev,
        productIds: prev.productIds.filter((id) => id !== productId),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !form.name ||
      !form.image ||
      !form.description ||
      form.productIds.length === 0
    ) {
      setErrorMessage('نام مجموعه، توضیحات، تصویر و حداقل یک محصول الزامی است!')
      return
    }

    if (calculatedPrice === 0) {
      setErrorMessage('حداقل یک محصول با قیمت معتبر انتخاب کنید!')
      return
    }

    try {
      await createCollection({
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/ /g, '-'),
        subtitle: form.subtitle,
        description: form.description,
        price: calculatedPrice,
        image: form.image,
        featured: form.featured,
        order: form.order,
        productIds: form.productIds,
      })

      setErrorMessage('مجموعه با موفقیت ساخته شد!')

      // Reset form
      setForm({
        name: '',
        slug: '',
        subtitle: '',
        description: '',
        image: '',
        featured: false,
        order: 0,
        productIds: [],
      })
      setCalculatedPrice(0)
    } catch (err) {
      console.error(err)
      setErrorMessage('ساخت مجموعه با خطا مواجه شد')
    }
  }

  // Get selected products for display
  const selectedProducts = productsPreview.filter((product) =>
    form.productIds.includes(product.id),
  )

  return (
    <LoadingBar
      loading={loading || productsLoading}
      loadingText="در حال بارگذاری صفحه ساخت مجموعه..."
    >
      <div>
        <PageBreadcrumb pageTitle="ساخت مجموعه" />
        <div className="space-y-6">
          {/* Collection Details */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h1 className="text-lg font-medium text-gray-800 dark:text-white">
                اطلاعات مجموعه
              </h1>
            </div>
            <div className="p-4 sm:p-6">
              <form className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Name */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    نام مجموعه *
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: مجموعه سلامت بانوان"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  />
                </div>

                {/* Slug */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    اسلاگ
                  </label>
                  <input
                    type="text"
                    placeholder="salamat-banovan-collection"
                    value={form.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    در صورت خالی بودن، به صورت خودکار از نام مجموعه ساخته می‌شود
                  </p>
                </div>

                {/* Subtitle */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    زیر عنوان
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: ترکیبی هوشمند برای سلامت روزانه"
                    value={form.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    توضیحات *
                  </label>
                  <textarea
                    placeholder="توضیحات کامل مجموعه سلامت..."
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      handleChange('description', e.target.value)
                    }
                    className="w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  />
                </div>

                {/* Price Display - Read Only */}
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    قیمت کل مجموعه (تومان)
                  </label>
                  <div className="h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90">
                    {calculatedPrice.toLocaleString('fa-IR')} تومان
                  </div>
                  <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                    قیمت به‌طور خودکار از مجموع قیمت محصولات انتخاب شده محاسبه
                    می‌شود
                  </p>
                </div>

                {/* Order and Featured */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    ترتیب نمایش
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 1"
                    value={form.order}
                    onChange={(e) =>
                      handleChange('order', parseInt(e.target.value) || 0)
                    }
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-black focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) =>
                        handleChange('featured', e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-400">
                      مجموعه ویژه (نمایش در صفحه اصلی)
                    </span>
                  </label>
                </div>

                {/* Collection Image - using existing ImageUploader with maxImages=1 */}
                <div className="md:col-span-2">
                  <ImageUploader
                    label="عکس مجموعه *"
                    images={form.image ? [form.image] : []}
                    onImagesChange={(urls) =>
                      handleChange('image', urls[0] || '')
                    }
                    maxImages={1}
                    id="collection-image-upload"
                    setErrorMessage={setErrorMessage}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Products Selection */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h1 className="text-lg font-medium text-gray-800 dark:text-white">
                انتخاب محصولات مجموعه *
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {form.productIds.length} محصول انتخاب شده | مجموع قیمت:{' '}
                {calculatedPrice.toLocaleString('fa-IR')} تومان
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div
                className="grid max-h-96 gap-3 overflow-y-auto"
                style={{
                  overscrollBehavior: 'contain',
                  WebkitOverflowScrolling: 'touch',
                }}
                onWheel={(e) => {
                  e.stopPropagation()
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
                {productsPreview.map((product) => {
                  const productPrice = product.discountedPrice || product.price
                  return (
                    <label
                      key={product.id}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-200 p-3 transition hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    >
                      <input
                        type="checkbox"
                        checked={form.productIds.includes(product.id)}
                        onChange={(e) =>
                          handleProductSelect(product.id, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-gray-100">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-200">
                            <span className="text-xs text-gray-400">
                              بدون عکس
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
                          {product.title}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {product.discount ? (
                            <>
                              <span className="line-through">
                                {product.price.toLocaleString('fa-IR')} تومان
                              </span>{' '}
                              <span className="font-semibold text-green-600">
                                {productPrice.toLocaleString('fa-IR')} تومان
                              </span>
                              <span className="text-red-500">
                                {' '}
                                (-{product.discount}%)
                              </span>
                            </>
                          ) : (
                            <>{product.price.toLocaleString('fa-IR')} تومان</>
                          )}
                        </p>
                      </div>
                    </label>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 md:w-auto"
        >
          انتشار مجموعه
        </button>
      </div>
      <InformPopup message={errorMessage} />
    </LoadingBar>
  )
}

export default AddCollection
