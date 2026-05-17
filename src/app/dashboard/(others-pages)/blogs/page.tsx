'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import PageBreadcrumb from '@/components/domain/dashboard/common/PageBreadCrumb'
import { useBlogsPreview } from '@/features/shop/hooks/blogs/useBlogsPreview'
import { useDeleteBlog } from '@/features/shop/hooks/blogs/deleteBlog'
import Pagination from '@/components/domain/dashboard/tables/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import { useRouter } from 'next/navigation'
import LoadingBar from '@/components/layout/LoadingBar'
import { BlogSummary } from '@/features/shop/shop.types'
import ConfirmPopup from '@/components/layout/ConfirmPopup'

const Blogs = () => {
  const { blogs, loading, error } = useBlogsPreview()
  const { deleteBlog } = useDeleteBlog()

  const router = useRouter()

  // Search and pagination state
  const [searchValue, setSearchValue] = useState<string>('')
  const [openIndex, setOpenIndex] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<number>(0)
  const [selectedBlogTitle, setSelectedBlogTitle] = useState<string>('')
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  // Ref for debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Debounce search input
  const handleSearchChange = useCallback((value: string) => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchValue(value)
      setPage(1) // Reset to first page when search changes
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

  // Filter Blogs based on debounced search value
  const filteredBlogs = blogs.filter((blog: BlogSummary) => {
    if (!debouncedSearchValue.trim()) return true

    const searchTerm = debouncedSearchValue.toLowerCase().trim()

    return (
      blog.id?.toString().includes(searchTerm) ||
      blog.title?.toLowerCase().includes(searchTerm) ||
      blog.author?.toLowerCase().includes(searchTerm) ||
      blog.description?.toLowerCase().includes(searchTerm)
    )
  })

  const itemsPerPage = 7
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage)

  // Safe page calculation
  const safePage = totalPages === 0 ? 1 : Math.min(page, totalPages)

  const startIndex = (safePage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredBlogs.slice(startIndex, endIndex)

  const showEmptyState =
    !loading && !error && !blogs.length && !debouncedSearchValue

  const handleDelete = async (id: number) => {
    await deleteBlog({ id })
    router.refresh()
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }
  return (
    <LoadingBar loading={loading} error={error}>
      <div>
        <PageBreadcrumb pageTitle="بلاگ" />

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white pt-4 pb-3 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="mb-4 flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                بلاگ
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                تمامی بلاگ های سایت
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

                {/* Clear search button */}
                {searchValue && (
                  <button
                    onClick={clearSearch}
                    className="flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
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
                href="/dashboard/addblog"
                className="bg-brand-500 shadow-theme-xs hover:bg-brand-600 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white transition"
              >
                ساخت بلاگ
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
                    بلاگ ها
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    نویسنده
                  </TableCell>
                  <TableCell
                    isHeader
                    className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                  >
                    تاریخ انتشار
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
                    <td colSpan={5} className="h-64 text-center">
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
                            <path d="M4 4h16v16H4z" />
                            <path d="M8 8h8v2H8zM8 12h6v2H8z" />
                          </svg>
                        </div>

                        <h3 className="text-color-title-on-light mb-2 text-lg font-semibold">
                          بلاگی وجود ندارد
                        </h3>

                        <p className="text-sm text-gray-500">
                          هنوز هیچ بلاگی ثبت نشده است.
                        </p>

                        <Link
                          href="/dashboard/addblog"
                          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                        >
                          ساخت بلاگ جدید
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M5 10.0002H15.0006M10.0002 5V15.0006"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </Link>
                      </div>
                    </td>
                  </TableRow>
                ) : currentData.length === 0 && debouncedSearchValue ? (
                  <TableRow>
                    <td colSpan={5} className="h-64 text-center">
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
                          بلاگی با "{debouncedSearchValue}" پیدا نشد.
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
                  currentData.map((blog) => (
                    <TableRow key={blog.id}>
                      <TableCell className="text-theme-sm py-4 pr-4 font-medium text-gray-800 sm:pr-6 dark:text-white/90">
                        {blog.id}
                      </TableCell>

                      <TableCell className="py-4">
                        <h1 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                          {blog.title}
                        </h1>
                        {blog.description && (
                          <p className="mt-1 line-clamp-1 max-w-sm text-xs text-gray-500 dark:text-gray-400">
                            {blog.description}
                          </p>
                        )}
                      </TableCell>

                      <TableCell className="text-theme-sm py-4 text-gray-600 dark:text-gray-400">
                        {blog.author || 'نامشخص'}
                      </TableCell>

                      <TableCell className="text-theme-sm py-4 text-gray-500 dark:text-gray-400">
                        {new Date(blog.createdAt).toLocaleDateString('fa-IR')}
                      </TableCell>

                      <TableCell className="text-theme-sm py-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBlog(blog.id)
                            setSelectedBlogTitle(blog.title)
                            setOpenIndex(true)
                          }}
                          className="text-red-500 transition-colors hover:text-red-700"
                          aria-label="حذف بلاگ"
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredBlogs.length > 0 && (
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
      <ConfirmPopup
        isOpen={openIndex}
        onClose={() => setOpenIndex(false)}
        onConfirm={async () => {
          await handleDelete(selectedBlog)
        }}
        popupTitle={`آیا از حذف "${selectedBlogTitle}" مطمئن هستید؟`}
        descriptionText={
          'در صورت حذف این مقاله، تمامی اطلاعات مرتبط با آن به‌طور دائمی پاک خواهد شد. لطفاً پیش از ادامه، تصمیم خود را بررسی کنید.'
        }
        confirmButtonText={'حذف'}
        cancelButtonText={'انصراف'}
      />
    </LoadingBar>
  )
}

export default Blogs
