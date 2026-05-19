import { useUpload } from '@/features/dashboard/hooks/useFileUpload'

// ImageUploader component
interface ImageUploaderProps {
  label: string
  imageUrl: string | null
  onUpload: (url: string) => void
  onClear: () => void
  id: string
  setErrorMessage: (message: string | null) => void // Allow null
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  imageUrl,
  onUpload,
  onClear,
  id,
  setErrorMessage,
}) => {
  const { isUploading, uploadFile } = useUpload()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setErrorMessage(null)

    // اعتبارسنجی نوع فایل
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/svg+xml',
    ]
    if (!validTypes.includes(file.type)) {
      setErrorMessage(
        'فرمت فایل پشتیبانی نمی‌شود. لطفاً از فرمت‌های JPG، PNG، GIF یا SVG استفاده کنید.',
      )
      return
    }

    // اعتبارسنجی حجم فایل (حداکثر 5 مگابایت)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('حجم فایل نباید بیشتر از 5 مگابایت باشد.')
      return
    }

    const result = await uploadFile(file, 'blogs')

    if (result) {
      onUpload(result.url)
    } else {
      setErrorMessage('خطا در آپلود تصویر. لطفاً دوباره تلاش کنید.')
    }

    // پاک کردن مقدار input برای امکان آپلود مجدد همان فایل
    e.target.value = ''
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
        </div>
      )}
    </div>
  )
}
