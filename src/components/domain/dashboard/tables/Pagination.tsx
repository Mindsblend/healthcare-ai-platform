// components/domain/dashboard/tables/Pagination.tsx
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
    let l: number

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
      if (l) {
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
    <div className="flex items-center justify-center gap-2 py-6">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(safeCurrentPage - 1)}
        disabled={safeCurrentPage === 1}
        className="group relative flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
        aria-label="صفحه قبلی"
      >
        <span className="hidden sm:inline">قبلی</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1.5">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            disabled={page === '...'}
            className={`relative flex h-10 min-w-[2.5rem] cursor-pointer items-center justify-center rounded-lg px-2 py-2 text-sm font-medium transition-all duration-200 ${
              safeCurrentPage === page
                ? 'bg-blue-500 text-white shadow-md shadow-blue-200 hover:bg-blue-600'
                : page === '...'
                  ? 'cursor-default text-gray-400'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            }`}
            aria-label={typeof page === 'number' ? `صفحه ${page}` : '...'}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(safeCurrentPage + 1)}
        disabled={safeCurrentPage === totalPages}
        className="group relative flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
        aria-label="صفحه بعدی"
      >
        <span className="hidden sm:inline">بعدی</span>
      </button>
    </div>
  )
}

export default Pagination
