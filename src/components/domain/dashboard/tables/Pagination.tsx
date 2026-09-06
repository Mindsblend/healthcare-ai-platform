'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages || 1)

  if (totalPages <= 1) return null

  const getPageNumbers = (): (number | string)[] => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []
    let l: number | undefined

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= safeCurrentPage - delta && i <= safeCurrentPage + delta)
      ) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }

      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  const handlePageChange = (page: number | string) => {
    if (
      typeof page === 'number' &&
      page !== safeCurrentPage &&
      page >= 1 &&
      page <= totalPages
    ) {
      onPageChange(page)
    }
  }

  return (
    <nav
      className="flex w-full items-center justify-center px-2 py-5 sm:px-0 sm:py-6"
      aria-label="Pagination"
    >
      <div className="flex max-w-full items-center gap-1.5 sm:gap-2">
        {/* Previous */}
        <button
          type="button"
          onClick={() => handlePageChange(safeCurrentPage - 1)}
          disabled={safeCurrentPage === 1}
          className="flex h-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:px-4"
          aria-label="صفحه قبلی"
        >
          <span className="hidden sm:inline">قبلی</span>
          <span className="text-lg sm:hidden">‹</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-0.5 sm:gap-1.5">
          {getPageNumbers().map((page, index) => (
            <button
              key={`${page}-${index}`}
              type="button"
              onClick={() => handlePageChange(page)}
              disabled={page === '...'}
              className={`flex h-9 min-w-9 items-center justify-center rounded-lg px-1.5 text-sm font-medium transition-all duration-200 sm:h-10 sm:min-w-10 sm:px-2 ${
                safeCurrentPage === page
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-200 hover:bg-blue-600'
                  : page === '...'
                    ? 'cursor-default text-gray-400'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              } `}
              aria-label={
                typeof page === 'number' ? `صفحه ${page}` : 'صفحات بیشتر'
              }
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => handlePageChange(safeCurrentPage + 1)}
          disabled={safeCurrentPage === totalPages}
          className="flex h-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:px-4"
          aria-label="صفحه بعدی"
        >
          <span className="hidden sm:inline">بعدی</span>
          <span className="text-lg sm:hidden">›</span>
        </button>
      </div>
    </nav>
  )
}

export default Pagination
