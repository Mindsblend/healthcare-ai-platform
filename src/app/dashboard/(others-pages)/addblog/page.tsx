'use client'

import { useState } from 'react'
import { useCreateBlog } from '@/features/shop/hooks/blogs/createBlog'
import { iconType } from '@/components/types/types'
import PageBreadcrumb from '@/components/domain/dashboard/common/PageBreadCrumb'
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor'
import '../../../../../styles/dashboard.css'
import '../../../../../styles/_variables.scss'

interface BlogFormState {
  title: string
  description: string
  image: string
  author: string
  authorImage: string
}

// کامپوننت آپلود تصویر با لودر
interface ImageUploaderProps {
  label: string
  imageUrl: string
  onUpload: (url: string) => void
  onClear: () => void
  id: string
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  imageUrl,
  onUpload,
  onClear,
  id,
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // اعتبارسنجی نوع فایل
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/svg+xml',
    ]
    if (!validTypes.includes(file.type)) {
      setUploadError(
        'فرمت فایل پشتیبانی نمی‌شود. لطفاً از فرمت‌های JPG، PNG، GIF یا SVG استفاده کنید.',
      )
      return
    }

    // اعتبارسنجی حجم فایل (حداکثر 5 مگابایت)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('حجم فایل نباید بیشتر از 5 مگابایت باشد.')
      return
    }

    setUploadError(null)
    setIsUploading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('خطا در آپلود فایل')
      }

      const data = await res.json()

      if (data.url) {
        onUpload(data.url)
      } else {
        throw new Error('آدرس تصویر دریافت نشد')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadError('خطا در آپلود تصویر. لطفاً دوباره تلاش کنید.')
    } finally {
      setIsUploading(false)
      // پاک کردن مقدار input برای امکان آپلود مجدد همان فایل
      e.target.value = ''
    }
  }

  return (
    <div className="col-span-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label}
      </label>

      {imageUrl ? (
        // نمایش پیش‌نمایش تصویر
        <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <img
            src={imageUrl}
            alt={label}
            className="h-48 w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            <label
              htmlFor={id}
              className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-lg hover:bg-gray-100"
            >
              تغییر تصویر
            </label>
            <button
              type="button"
              onClick={onClear}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-red-600"
            >
              حذف تصویر
            </button>
          </div>
          <input
            type="file"
            id={id}
            accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
      ) : (
        // حالت آپلود
        <div>
          <label
            htmlFor={id}
            className={`shadow-theme-xs group block cursor-pointer rounded-lg border-2 border-dashed transition ${
              isUploading
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                : 'hover:border-brand-500 border-gray-300 dark:border-gray-800'
            }`}
          >
            <div className="flex justify-center p-10">
              <div className="flex max-w-65 flex-col items-center gap-4">
                {isUploading ? (
                  // لودر در حال آپلود
                  <>
                    <div className="inline-flex h-13 w-13 items-center justify-center">
                      <svg
                        className="text-brand-500 h-10 w-10 animate-spin"
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
                    </div>
                    <p className="text-brand-600 dark:text-brand-400 text-center text-sm font-medium">
                      در حال آپلود تصویر...
                    </p>
                    <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="bg-brand-500 h-full w-2/3 animate-pulse rounded-full"></div>
                    </div>
                  </>
                ) : (
                  // حالت عادی آپلود
                  <>
                    <div className="inline-flex h-13 w-13 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition dark:border-gray-800 dark:text-gray-400">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        برای بارگذاری کلیک کنید
                      </span>{' '}
                      یا بگیرید و بکشید SVG, PNG, JPG یا GIF
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      حداکثر حجم: ۵ مگابایت
                    </p>
                  </>
                )}
              </div>
            </div>
            <input
              type="file"
              id={id}
              accept="image/jpeg,image/jpg,image/png,image/gif,image/svg+xml"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>

          {/* نمایش خطا */}
          {uploadError && (
            <p className="mt-2 text-sm text-red-500 dark:text-red-400">
              {uploadError}
            </p>
          )}
        </div>
      )}
    </div>
  )
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
                <div>
                  <SimpleEditor
                    value={form.description}
                    onChange={(content) => handleChange('description', content)}
                  />
                </div>
              </div>

              {/* Blog Image Uploader */}
              <ImageUploader
                label="عکس بلاگ"
                imageUrl={form.image}
                onUpload={(url) => setForm((prev) => ({ ...prev, image: url }))}
                onClear={() => setForm((prev) => ({ ...prev, image: '' }))}
                id="blog-image-upload"
              />

              {/* Author Image Uploader */}
              <ImageUploader
                label="عکس نویسنده"
                imageUrl={form.authorImage}
                onUpload={(url) =>
                  setForm((prev) => ({ ...prev, authorImage: url }))
                }
                onClear={() =>
                  setForm((prev) => ({ ...prev, authorImage: '' }))
                }
                id="author-image-upload"
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
    </div>
  )
}

export default AddBlog
