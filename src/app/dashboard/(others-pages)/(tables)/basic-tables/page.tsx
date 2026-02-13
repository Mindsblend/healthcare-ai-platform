'use client'

import ComponentCard from '@/components/domain/dashboard/common/ComponentCard'
import { useState } from 'react'
import PageBreadcrumb from '@/components/domain/dashboard/common/PageBreadCrumb'
import BasicTableOne from '@/components/domain/dashboard/tables/BasicTableOne'
import Pagination from '@/components/domain/dashboard/tables/Pagination'



export default function BasicTables() {
  const [page, setPage] = useState(1)
  return (
    <div>
      <PageBreadcrumb pageTitle="Basic Table" />
      <div className="space-y-6">
        <ComponentCard title="Basic Table 1">
          <BasicTableOne />
          <Pagination
            currentPage={page}
            totalPages={10}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </ComponentCard>
      </div>
    </div>
  )
}
