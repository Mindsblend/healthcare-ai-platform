'use client'

import { useState } from 'react'
import { useCreateBlog } from '@/features/shop/hooks/blogs/createBlog'
import { IconType } from '@/features/shop/shop.types'
import PageBreadcrumb from '@/components/domain/dashboard/common/PageBreadCrumb'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import InformPopup from '@/components/layout/InformPopup'
import { ImageUploader } from '@/components/domain/dashboard/form/ImageUpload'
import '../../../../../styles/dashboard.css'
import '../../../../../styles/_variables.scss'

interface BlogFormState {
  title: string
  description: string
  image: string
  slug: string
  content: string
  author: string
  authorImage: string
  authorTitle: string
}

const AddBlog = () => {
  const [form, setForm] = useState<BlogFormState>({
    title: '',
    image: '',
    description: '',
    slug: '',
    content: '',
    author: '',
    authorImage: '',
    authorTitle: '',
  })

  const { create, loading, error } = useCreateBlog()

  const [errorMessage, setErrorMessage] = useState<string | null>()

  type AnyField = keyof BlogFormState
  type AnyArrayKey = keyof IconType

  const handleChange = (
    field: AnyField,
    value?: any,
    index?: number,
    key?: AnyArrayKey,
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
      setErrorMessage('Title, author, and description are required!')
    }

    try {
      await create({
        title: form.title,
        image: form.image,
        description: form.description,
        slug: form.slug,
        content: form.content,
        author: form.author,
        authorImage: form.authorImage,
        authorTitle: form.authorTitle,
      })
      setErrorMessage('Blog created!')
      setForm({
        title: '',
        image: '',
        description: '',
        slug: '',
        content: '',
        author: '',
        authorImage: '',
        authorTitle: '',
      })
    } catch (err) {
      console.error(err)
      setErrorMessage('Create failed')
    }
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="ساخت بلاگ" />
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
          <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
            <h1 className="text-lg font-medium text-gray-800 dark:text-white">
              توضیحات بلاگ
            </h1>
          </div>
          <div className="p-4 sm:p-6 dark:border-gray-800">
            <form className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Title */}
              <div className="col-span-full md:col-span-2">
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

              {/* Slug */}
              <div className="col-span-full md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  اسلاگ
                </label>
                <input
                  type="text"
                  placeholder="اسم اسلاگ را وارد کنید"
                  value={form.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>

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

              {/* Author Title */}
              <div className="col-span-full">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  عنوان نویسنده
                </label>
                <input
                  type="text"
                  placeholder="عنوان نویسنده بلاگ را وارد کنید"
                  value={form.authorTitle}
                  onChange={(e) => handleChange('authorTitle', e.target.value)}
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>

              {/* Description */}
              <div className="col-span-full md:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  توضیحات
                </label>
                <input
                  type="text"
                  placeholder="توضیحات را وارد کنید"
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30"
                />
              </div>

              {/* Content */}
              <div className="col-span-full">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  محتوا
                </label>
                <div>
                  <SimpleEditor
                    value={form.content}
                    onChange={(content) => handleChange('content', content)}
                  />
                </div>
              </div>

              {/* Blog Image Uploader */}
              <ImageUploader
                label="عکس بلاگ"
                images={form.image ? [form.image] : []}
                onImagesChange={(urls) =>
                  setForm((prev) => ({
                    ...prev,
                    image: urls[0] || '',
                  }))
                }
                maxImages={1}
                id="blog-image-upload"
                setErrorMessage={setErrorMessage}
              />

              {/* Author Image Uploader */}
              <ImageUploader
                label="عکس نویسنده"
                images={form.authorImage ? [form.authorImage] : []}
                onImagesChange={(urls) =>
                  setForm((prev) => ({
                    ...prev,
                    authorImage: urls[0] || '',
                  }))
                }
                maxImages={1}
                id="author-image-upload"
                setErrorMessage={setErrorMessage}
              />
            </form>
          </div>
        </div>
      </div>

      {/* Submit Button with loading state */}
      <button
        className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 mt-3 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            در حال انتشار...
          </>
        ) : (
          'انتشار بلاگ'
        )}
      </button>
      <InformPopup message={errorMessage} />
    </div>
  )
}

export default AddBlog
