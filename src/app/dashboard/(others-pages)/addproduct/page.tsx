'use client'

import { useState } from 'react'
import { useCreateProduct } from '@/features/shop/hooks/products/createProduct'
import { useCategories } from '@/features/shop/hooks/categories/useCategories'
import { iconType, gainType, faqType } from '@/components/types/types'
import PageBreadcrumb from '@/components/domain/dashboard/common/PageBreadCrumb'

interface ProductFormState {
  title: string
  price: string
  slug: string
  solution: string
  description: string
  image: string
  categoryId: string
  icons: iconType[]
  gains: gainType[]
  faqs: faqType[]
}

const AddProduct = () => {
  const [form, setForm] = useState<ProductFormState>({
    title: '',
    price: '',
    slug: '',
    solution: '',
    description: '',
    image: '',
    categoryId: '',
    icons: [
      { title: '', description: '', iconPath: '' },
      { title: '', description: '', iconPath: '' },
      { title: '', description: '', iconPath: '' },
    ],
    gains: [
      { title: '', ingredient: '', description: '' },
      { title: '', ingredient: '', description: '' },
      { title: '', ingredient: '', description: '' },
    ],
    faqs: [
      { question: '', answer: '' },
      { question: '', answer: '' },
      { question: '', answer: '' },
      { question: '', answer: '' },
      { question: '', answer: '' },
      { question: '', answer: '' },
    ],
  })

  const { create, loading, error } = useCreateProduct()
  const { categories } = useCategories()

  type AnyField = keyof ProductFormState
  type AnyArrayKey = keyof iconType | keyof gainType | keyof faqType

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

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()

    if (data.url) {
      setForm((prev) => ({
        ...prev,
        image: data.url,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.categoryId) {
      alert('Title, price, and category are required!')
      return
    }

    try {
      await create({
        title: form.title,
        price: Number(form.price),
        slug: form.slug,
        solution: form.solution,
        image: form.image,
        description: form.description,
        categoryId: Number(form.categoryId),
        icons: form.icons,
        gains: form.gains,
        faqs: form.faqs,
      })
      alert('Product created!')
      setForm({
        title: '',
        price: '',
        slug: '',
        solution: '',
        description: '',
        image: '',
        categoryId: '',
        icons: [],
        gains: [],
        faqs: [],
      })
    } catch (err) {
      console.error(err)
      alert('Create failed')
    }
  }

  return (
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
                  onChange={(e) => handleChange('description', e.target.value)}
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
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  قیمت
                </label>
                <input
                  type="number"
                  placeholder="مثال: 120000"
                  value={form.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              {/* Image Upload */}
              <div className="col-span-full">
                <label className="shadow-theme-xs group hover:border-brand-500 block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 transition dark:border-gray-800">
                  <div className="flex justify-center p-10">
                    <div className="flex max-w-65 flex-col items-center gap-4">
                      <div className="inline-flex h-13 w-13 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition dark:border-gray-800 dark:text-gray-400">
                        {/* Upload icon SVG */}
                      </div>
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-800 dark:text-white/90">
                          برای بارگذاری کلیک کنید
                        </span>{' '}
                        یا بگیرید و بکشید SVG, PNG, JPG یا GIF
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    id="product-image"
                    className="hidden"
                    onChange={handleImage}
                  />
                </label>
              </div>
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
          <form className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {form.icons.map((icon, idx) => (
              <div key={idx}>
                {/* Icon Upload */}
                <div className="col-span-6">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                    آیکن
                  </label>
                  <label className="group hover:border-brand-500 flex cursor-pointer items-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-4 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900/30 dark:hover:bg-gray-900/50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <span className="text-lg">⬆</span>
                    </div>
                    <div className="flex flex-col text-sm">
                      <span className="font-medium text-gray-800 dark:text-white">
                        آپلود آیکن
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        SVG یا PNG
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/svg+xml,image/png"
                      className="hidden"
                      onChange={handleImage}
                    />
                  </label>
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
                      handleChange('icons', e.target.value, idx, 'description')
                    }
                    className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
                  />
                </div>
              </div>
            ))}
          </form>
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
          <form className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {form.gains.map((gain, idx) => (
              <div key={idx}>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  مزایا
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
                <input
                  type="text"
                  placeholder="ماده فعال"
                  value={gain.ingredient}
                  onChange={(e) =>
                    handleChange('gains', e.target.value, idx, 'ingredient')
                  }
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
                />
                <input
                  type="text"
                  placeholder="توضیح"
                  value={gain.description}
                  onChange={(e) =>
                    handleChange('gains', e.target.value, idx, 'description')
                  }
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400"
                />
              </div>
            ))}
          </form>
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
          <form className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {form.faqs.map((faq, idx) => (
              <div key={idx}>
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
            ))}
          </form>
        </div>
      </div>

      <button
        className="bg-brand-500 mt-3 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
        onClick={handleSubmit}
      >
        انتشار محصول
      </button>
    </div>
  )
}

export default AddProduct
