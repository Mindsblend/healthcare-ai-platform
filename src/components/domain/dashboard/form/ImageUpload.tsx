'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { useMultipleUpload } from '@/features/dashboard/hooks/useMultipleFileUpload'

interface ImageUploaderProps {
  label: string
  images: string[] // array of image URLs
  onImagesChange: (urls: string[]) => void
  maxImages?: number // default 3
  id: string
  setErrorMessage: (msg: string | null) => void
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  images,
  onImagesChange,
  maxImages = 3,
  id,
  setErrorMessage,
}) => {
  const { isUploading, uploadMultipleFiles } = useMultipleUpload()
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return
      const fileArray = Array.from(files)
      const remainingSlots = maxImages - images.length
      if (fileArray.length > remainingSlots) {
        setErrorMessage(
          `حداکثر ${remainingSlots} عکس دیگر می‌توانید آپلود کنید.`,
        )
        return
      }

      // Validate each file
      const validTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/svg+xml',
      ]
      for (const file of fileArray) {
        if (!validTypes.includes(file.type)) {
          setErrorMessage(
            'فرمت فایل پشتیبانی نمی‌شود. فقط JPG، PNG، GIF یا SVG.',
          )
          return
        }
        if (file.size > 5 * 1024 * 1024) {
          setErrorMessage('حجم هر فایل نباید بیشتر از ۵ مگابایت باشد.')
          return
        }
      }

      setErrorMessage(null)
      const uploaded = await uploadMultipleFiles(fileArray, 'products', {
        maxFiles: remainingSlots,
        accept: 'image/jpeg,image/jpg,image/png,image/gif,image/svg+xml',
        maxSize: 5 * 1024 * 1024,
      })

      if (uploaded && uploaded.length > 0) {
        const newUrls = uploaded.map((u) => u.url)
        onImagesChange([...images, ...newUrls])
      } else {
        setErrorMessage('خطا در آپلود تصاویر. لطفاً دوباره تلاش کنید.')
      }
    },
    [images, maxImages, onImagesChange, setErrorMessage, uploadMultipleFiles],
  )

  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, idx) => idx !== indexToRemove)
    onImagesChange(newImages)
  }

  const moveImage = (from: number, to: number) => {
    const newImages = [...images]
    const [moved] = newImages.splice(from, 1)
    newImages.splice(to, 0, moved)
    onImagesChange(newImages)
  }

  const triggerFileInput = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/jpeg,image/jpg,image/png,image/gif,image/svg+xml'
    input.onchange = (e) => handleFiles((e.target as HTMLInputElement).files)
    input.click()
  }

  return (
    <div className="col-span-full">
      <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        {label} (حداکثر {maxImages})
      </label>

      {/* Preview Grid (if any images uploaded) */}
      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((url, idx) => (
            <div
              key={url}
              className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <Image
                src={url}
                alt={`Preview ${idx}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="rounded-full bg-red-600 px-2 py-1 text-xs text-white"
                >
                  حذف
                </button>
                <div className="flex gap-1">
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(idx, idx - 1)}
                      className="rounded-full bg-white px-2 py-1 text-xs text-black"
                    >
                      ↑
                    </button>
                  )}
                  {idx < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(idx, idx + 1)}
                      className="rounded-full bg-white px-2 py-1 text-xs text-black"
                    >
                      ↓
                    </button>
                  )}
                </div>
              </div>
              {idx === 0 && (
                <span className="absolute top-1 left-1 rounded bg-black px-1 text-xs text-white">
                  اصلی
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area (only shown if less than maxImages) */}
      {images.length < maxImages && (
        <div>
          <div
            onClick={triggerFileInput}
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragging(false)
              handleFiles(e.dataTransfer.files)
            }}
            className={`shadow-theme-xs group block cursor-pointer rounded-lg border-2 border-dashed transition ${
              isUploading
                ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                : `border-gray-300 dark:border-gray-800 ${
                    isDragging
                      ? 'border-brand-500 bg-brand-50'
                      : 'hover:border-brand-500'
                  }`
            }`}
          >
            <div className="flex justify-center p-10">
              <div className="flex max-w-65 flex-col items-center gap-4">
                {isUploading ? (
                  // Loading state
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
                      در حال آپلود...
                    </p>
                    <div className="h-1.5 w-48 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                      <div className="bg-brand-500 h-full w-2/3 animate-pulse rounded-full"></div>
                    </div>
                  </>
                ) : (
                  // Default state
                  <>
                    <div className="inline-flex h-13 w-13 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition dark:border-gray-800 dark:text-gray-400">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium text-gray-800 dark:text-white/90">
                        برای بارگذاری کلیک کنید
                      </span>{' '}
                      یا بگیرید و بکشید (چند فایل)
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      حداکثر {maxImages - images.length} عکس دیگر – هر فایل
                      حداکثر ۵ مگابایت
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
