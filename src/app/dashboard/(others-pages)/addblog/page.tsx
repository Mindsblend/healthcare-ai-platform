'use client'

import { useState } from 'react'
import { useCreateBlog } from '@/features/shop/hooks/blogs/createBlog'
import { iconType } from '@/components/types/types'
import PageBreadcrumb from '@/components/domain/dashboard/common/PageBreadCrumb'

interface BlogFormState {
  title: string
  description: string
  image: string
  author: string
  authorImage: string
}

const AddBlog = () => {
  const [form, setForm] = useState<BlogFormState>({
    title: '',
    image: '',
    description: '',
    author: '',
    authorImage: '',
  })

  const { create, loading, error } = useCreateBlog()

  type AnyField = keyof BlogFormState
  type AnyArrayKey = keyof iconType

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.author || !form.description) {
      alert('Title, author, and description are required!')
      return
    }

    try {
      await create({
        title: form.title,
        image: form.image,
        description: form.description,
        author: form.author,
        authorImage: form.authorImage,
      })
      alert('Blog created!')
      setForm({
        title: '',
        image: '',
        description: '',
        author: '',
        authorImage: '',
      })
    } catch (err) {
      console.error(err)
      alert('Create failed')
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="ساخت بلاگ" />
      <div className="space-y-6">
        {/* Blog Details */}
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h1 className="text-lg font-medium text-gray-800 dark:text-white">
              توضیحات بلاگ
            </h1>
          </div>
          <div className="p-4 sm:p-6 dark:border-gray-800">
            <form className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Title */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  اسم بلاگ
                </label>
                <input
                  type="text"
                  placeholder="اسم بلاگ را وارد کنید"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>

              {/* Slug
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
              </div> */}

              {/* Short Description
              <div className="col-span-full">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  توضیح کوتاه
                </label>
                <input
                  type="text"
                  placeholder="توضیح کوتاه بلاگ را وارد کنید"
                  value={form.solution}
                  onChange={(e) => handleChange('solution', e.target.value)}
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div> */}

              {/* Author */}
              <div className="col-span-full">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  نویسنده
                </label>
                <input
                  type="text"
                  placeholder="نویسنده بلاگ را وارد کنید"
                  value={form.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>

              {/* Description */}
              <div className="col-span-full">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  توضیحات
                </label>
                <textarea
                  placeholder="توضیحات بلاگ"
                  rows={7}
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 w-full resize-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>

              {/* Category
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
              </div> */}

              {/* Image Upload */}
              <div className="col-span-full">
                <label className="shadow-theme-xs group hover:border-brand-500 block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 transition dark:border-gray-800">
                  <div className="flex justify-center p-10">
                    <div className="flex max-w-[260px] flex-col items-center gap-4">
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
                    id="Blog-image"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleChange('image', file.name)
                    }}
                  />
                </label>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Icons
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
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file)
                          handleChange('icons', file.name, idx, 'iconPath')
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-800 placeholder:text-gray-400">
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
      </div> */}

      <button
        className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 mt-3 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
        onClick={handleSubmit}
      >
        انتشار بلاگ
      </button>
    </div>
  )
}

export default AddBlog
