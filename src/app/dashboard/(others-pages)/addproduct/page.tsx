'use client'

import { useState, useEffect } from 'react'
import { useCreateProduct } from '@/features/shop/hooks/products/createProduct'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import {
  CreateProductInput,
  IconType,
  GainType,
  FaqType,
} from '@/features/shop/shop.types'
import PageBreadcrumb from '@/components/domain/dashboard/common/PageBreadCrumb'
import LoadingBar from '@/components/layout/LoadingBar'
import InformPopup from '@/components/layout/InformPopup'
import { useFeedCategories } from '@/features/shop/hooks/feed/useFeedCategories'
import { ImageUploader } from '@/components/domain/dashboard/form/ImageUpload'

const AddProduct = () => {
  const [form, setForm] = useState<CreateProductInput>({
    title: '',
    price: 0,
    discount: 0,
    slug: '',
    solution: '',
    description: '',
    image: '',
    categoryId: 0,
    feedCategoryId: 0,
    icons: [
      { id: 1, title: '', description: '', iconPath: '' },
      { id: 2, title: '', description: '', iconPath: '' },
      { id: 3, title: '', description: '', iconPath: '' },
    ],
    gains: [
      { id: 1, title: '', ingredient: '', description: '' },
      { id: 2, title: '', ingredient: '', description: '' },
      { id: 3, title: '', ingredient: '', description: '' },
    ],
    faqs: [
      { id: 1, question: '', answer: '' },
      { id: 2, question: '', answer: '' },
      { id: 3, question: '', answer: '' },
      { id: 4, question: '', answer: '' },
      { id: 5, question: '', answer: '' },
      { id: 6, question: '', answer: '' },
    ],
  })

  const { create, loading, error } = useCreateProduct()
  const { categories } = useCategories()
  const { feedCategories } = useFeedCategories()

  const [errorMessage, setErrorMessage] = useState<string | null>()
  const [discountedPrice, setDiscountedPrice] = useState<number | null>(null)

  // Auto-calculate discounted price when price or discount changes
  useEffect(() => {
    const priceNum = Number(form.price)
    const discountNum = Number(form.discount)

    if (
      !isNaN(priceNum) &&
      priceNum > 0 &&
      !isNaN(discountNum) &&
      discountNum > 0
    ) {
      const calculated = priceNum - (priceNum * discountNum) / 100
      setDiscountedPrice(Math.round(calculated))
    } else {
      setDiscountedPrice(null)
    }
  }, [form.price, form.discount])

  type AnyField = keyof CreateProductInput
  type AnyArrayKey = keyof IconType | keyof GainType | keyof FaqType

  const handleChange = (
    field: AnyField,
    value?: any, // for normal fields / image
    index?: number, // for arrays
    key?: AnyArrayKey, // for array elements
  ) => {
    if (index !== undefined && key) {
      const arr = [...(form[field] as any)]
      arr[index] = { ...arr[index], [key]: value }
      setForm((prev) => ({ ...prev, [field]: arr }))
      return
    }
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleIconUpload = async (index: number, url: string) => {
    const updatedIcons = [...form.icons]
    updatedIcons[index] = { ...updatedIcons[index], iconPath: url }
    setForm((prev) => ({ ...prev, icons: updatedIcons }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.categoryId) {
      setErrorMessage('Title, price, and category are required!')
      return
    }

    try {
      await create({
        title: form.title,
        price: Number(form.price),
        discount: Number(form.discount) || 0,
        slug: form.slug,
        solution: form.solution,
        image: form.image,
        description: form.description,
        categoryId: Number(form.categoryId),
        feedCategoryId: Number(form.feedCategoryId),
        icons: form.icons,
        gains: form.gains,
        faqs: form.faqs,
      })
      setErrorMessage('Product created!')
      setForm({
        title: '',
        price: 0,
        discount: 0,
        slug: '',
        solution: '',
        description: '',
        image: '',
        categoryId: 0,
        feedCategoryId: 0,
        icons: [],
        gains: [],
        faqs: [],
      })
      setDiscountedPrice(null)
    } catch (err) {
      console.error(err)
      setErrorMessage('Create failed')
    }
  }

  return (
    <LoadingBar
      loading={loading}
      loadingText="در حال بارگذاری صفحه ساخت محصول..."
    >
      <div>
        <PageBreadcrumb pageTitle="ساخت محصول" />
        <div className="space-y-6">
          {/* Product Details */}
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
              <h1 className="text-lg font-medium text-gray-800 dark:text-white">
                توضیحات محصولات
              </h1>
            </div>
            <div className="p-4 sm:p-6 dark:border-gray-800">
              <form className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    اسم محصول
                  </label>
                  <input
                    type="text"
                    placeholder="اسم محصول را وارد کنید"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    اسلاگ
                  </label>
                  <input
                    type="text"
                    placeholder="unique-slug"
                    value={form.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  />
                </div>

                {/* Solution */}
                <div className="col-span-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    راه حل
                  </label>
                  <input
                    type="text"
                    placeholder="راه حل محصول را وارد کنید"
                    value={form.solution}
                    onChange={(e) => handleChange('solution', e.target.value)}
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  />
                </div>

                {/* Description */}
                <div className="col-span-full">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    توضیحات
                  </label>
                  <textarea
                    placeholder="توضیحات محصول"
                    rows={7}
                    value={form.description}
                    onChange={(e) =>
                      handleChange('description', e.target.value)
                    }
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    دسته بندی
                  </label>
                  <select
                    value={form.categoryId}
                    onChange={(e) => handleChange('categoryId', e.target.value)}
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value={0}>انتخاب دسته بندی</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Feed Category */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    دسته‌بندی فید
                  </label>
                  <select
                    value={form.feedCategoryId}
                    onChange={(e) =>
                      handleChange('feedCategoryId', e.target.value)
                    }
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value={0}>انتخاب دسته بندی فید</option>
                    {feedCategories.map((feedCategory) => (
                      <option key={feedCategory.id} value={feedCategory.id}>
                        {feedCategory.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price and Discount Row */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    قیمت (تومان)
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 120000"
                    value={form.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    تخفیف (درصد)
                  </label>
                  <input
                    type="number"
                    placeholder="مثال: 15"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={(e) => handleChange('discount', e.target.value)}
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    قیمت پس از تخفیف به‌طور خودکار محاسبه می‌شود
                  </p>
                </div>

                {/* Discounted Price Preview */}
                {discountedPrice !== null && (
                  <div className="col-span-full rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <span className="font-semibold">قیمت پس از تخفیف:</span>{' '}
                      {discountedPrice.toLocaleString('fa-IR')} تومان
                    </p>
                  </div>
                )}

                {/* Product Image Upload - Using reusable ImageUploader */}
                <ImageUploader
                  label="عکس محصول"
                  images={form.image ? [form.image] : []}
                  onImagesChange={(urls) =>
                    setForm((prev) => ({
                      ...prev,
                      image: urls[0] || '',
                    }))
                  }
                  maxImages={1}
                  id="product-image-upload"
                  setErrorMessage={setErrorMessage}
                />
              </form>
            </div>
          </div>
        </div>

        {/* Icons */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h1 className="text-lg font-medium text-gray-800 dark:text-white">
              آیکن ها
            </h1>
          </div>
          <div className="p-4 sm:p-6 dark:border-gray-800">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {form.icons.map((icon, idx) => (
                <div key={idx} className="space-y-4">
                  {/* Icon Upload */}
                  <ImageUploader
                    label="عکس محصول"
                    images={form.image ? [form.image] : []}
                    onImagesChange={(urls) =>
                      setForm((prev) => ({
                        ...prev,
                        image: urls[0] || '',
                      }))
                    }
                    maxImages={1}
                    id="product-image-upload"
                    setErrorMessage={setErrorMessage}
                  />
                  {/* Icon Title */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      عنوان
                    </label>
                    <input
                      type="text"
                      placeholder="عنوان آیکن"
                      value={icon.title}
                      onChange={(e) =>
                        handleChange('icons', e.target.value, idx, 'title')
                      }
                      className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Icon Description */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      توضیح
                    </label>
                    <input
                      type="text"
                      placeholder="مناسب برای استفاده روزانه"
                      value={icon.description}
                      onChange={(e) =>
                        handleChange(
                          'icons',
                          e.target.value,
                          idx,
                          'description',
                        )
                      }
                      className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gains */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h1 className="text-lg font-medium text-gray-800 dark:text-white">
              مزایا
            </h1>
          </div>
          <div className="p-4 sm:p-6 dark:border-gray-800">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {form.gains.map((gain, idx) => (
                <div key={idx} className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      عنوان مزیت
                    </label>
                    <input
                      type="text"
                      placeholder="عنوان مزیت"
                      value={gain.title}
                      onChange={(e) =>
                        handleChange('gains', e.target.value, idx, 'title')
                      }
                      className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      ماده فعال
                    </label>
                    <input
                      type="text"
                      placeholder="ماده فعال"
                      value={gain.ingredient}
                      onChange={(e) =>
                        handleChange('gains', e.target.value, idx, 'ingredient')
                      }
                      className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      توضیح
                    </label>
                    <input
                      type="text"
                      placeholder="توضیح"
                      value={gain.description}
                      onChange={(e) =>
                        handleChange(
                          'gains',
                          e.target.value,
                          idx,
                          'description',
                        )
                      }
                      className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h1 className="text-lg font-medium text-gray-800 dark:text-white">
              سوالات متداول
            </h1>
          </div>
          <div className="p-4 sm:p-6 dark:border-gray-800">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {form.faqs.map((faq, idx) => (
                <div key={idx} className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      سوال
                    </label>
                    <input
                      type="text"
                      placeholder="این محصول دقیقاً چگونه عمل می‌کند؟"
                      value={faq.question}
                      onChange={(e) =>
                        handleChange('faqs', e.target.value, idx, 'question')
                      }
                      className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      جواب
                    </label>
                    <input
                      type="text"
                      placeholder="حفظ رطوبت پوست: اسید هیالورونیک — قادر به حفظ رطوبت پوست"
                      value={faq.answer}
                      onChange={(e) =>
                        handleChange('faqs', e.target.value, idx, 'answer')
                      }
                      className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 mt-3 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
          onClick={handleSubmit}
        >
          انتشار محصول
        </button>
      </div>
      <InformPopup message={errorMessage} />
    </LoadingBar>
  )
}

export default AddProduct
