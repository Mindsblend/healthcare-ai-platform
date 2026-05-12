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
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => handlePageChange(safeCurrentPage - 1)}
        disabled={safeCurrentPage === 1}
        className="flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        aria-label="صفحه قبلی"
      >
        قبلی
      </button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(page)}
            disabled={page === '...'}
            className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              safeCurrentPage === page
                ? 'bg-brand-500 text-white shadow-md'
                : page === '...'
                  ? 'cursor-default text-gray-400 dark:text-gray-600'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
            aria-label={typeof page === 'number' ? `صفحه ${page}` : '...'}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(safeCurrentPage + 1)}
        disabled={safeCurrentPage === totalPages}
        className="flex h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03]"
        aria-label="صفحه بعدی"
      >
        بعدی
      </button>
    </div>
  )
}

export default Pagination
