'use client'

import { useState } from 'react'
import PageBreadcrumb from '@/components/domain/dashboard/common/PageBreadCrumb'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import Badge from '../../../../components/ui/badge/Badge'
import { OrderType } from '@/components/types/types'
import Pagination from '@/components/domain/dashboard/tables/Pagination'

const tableData: OrderType[] = [
  {
    cartId: 1,
    customerName: 'حسین علی زاده',
    customerEmail: 'hossein@gmail.com',
    orderDate: '2026-02-10',
    variants: '2 Variants',
    totalPrice: 2399.0,
    status: 'PAID',
  },
  {
    cartId: 2,
    customerName: 'علی ابتکاری',
    customerEmail: 'ali@gmail.com',
    orderDate: '2026-02-11',
    variants: '1 Variant',
    totalPrice: 879.0,
    status: 'CANCELED',
  },
  {
    cartId: 3,
    customerName: 'آرمان ابتکاری',
    customerEmail: 'arman@gmail.com',
    orderDate: '2026-02-12',
    variants: '2 Variants',
    totalPrice: 1869.0,
    status: 'PENDING',
  },
  {
    cartId: 4,
    customerName: 'اشکان ابتکاری',
    customerEmail: 'ashkan@gmail.com',
    orderDate: '2026-02-13',
    variants: '2 Variants',
    totalPrice: 1699.0,
    status: 'REFUNDED',
  },
  {
    cartId: 5,
    customerName: 'حسین علی زاده',
    customerEmail: 'hossein@gmail.com',
    orderDate: '2026-02-10',
    variants: '2 Variants',
    totalPrice: 2399.0,
    status: 'PAID',
  },
  {
    cartId: 6,
    customerName: 'کیان ابتکاری',
    customerEmail: 'kian@gmail.com',
    orderDate: '2026-02-13',
    variants: '1 Variant',
    totalPrice: 240.0,
    status: 'PAID',
  },
  {
    cartId: 7,
    customerName: 'علی ابتکاری',
    customerEmail: 'ali@gmail.com',
    orderDate: '2026-02-11',
    variants: '1 Variant',
    totalPrice: 879.0,
    status: 'CANCELED',
  },
  {
    cartId: 8,
    customerName: 'اشکان ابتکاری',
    customerEmail: 'ashkan@gmail.com',
    orderDate: '2026-02-13',
    variants: '2 Variants',
    totalPrice: 1699.0,
    status: 'REFUNDED',
  },
  {
    cartId: 9,
    customerName: 'آرمان ابتکاری',
    customerEmail: 'arman@gmail.com',
    orderDate: '2026-02-12',
    variants: '2 Variants',
    totalPrice: 1869.0,
    status: 'PENDING',
  },
]

const Orders = () => {
  const [page, setPage] = useState(1)

  const itemsPerPage = 7
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = tableData.slice(startIndex, endIndex)

  return (
    <div>
      <PageBreadcrumb pageTitle="سفارشات" />

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white pt-4 pb-3 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              سفارشات اخیر
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              سفارشات چند روز اخیر شما
            </p>
          </div>

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
              placeholder="جست و جو کنید..."
              className="dark:bg-dark-900 shadow-theme-xs focus:border-brand-300 focus:ring-brand-500/10 dark:focus:border-brand-800 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pr-4 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-3 focus:outline-hidden xl:w-[430px] dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30"
            />
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
                  شماره سفارش
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  نام مشتری
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  ایمیل
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  تاریخ سفارش
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  وضعیت
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  جمع کل
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {currentData.map((order) => (
                <TableRow key={order.cartId}>
                  {/* شماره سفارش */}
                  <TableCell className="text-theme-sm py-3 pr-4 font-medium text-gray-800 sm:pr-6 dark:text-white/90">
                    #{order.cartId}
                  </TableCell>

                  {/* نام مشتری */}
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        {order.customerName}
                      </span>
                      <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                        {order.variants}
                      </span>
                    </div>
                  </TableCell>

                  {/* ایمیل */}
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {order.customerEmail}
                  </TableCell>

                  {/* تاریخ سفارش */}
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {new Date(order.orderDate).toLocaleDateString('fa-IR')}
                  </TableCell>

                  {/* وضعیت */}
                  <TableCell className="text-theme-sm py-3">
                    <Badge
                      size="sm"
                      color={
                        order.status === 'PAID'
                          ? 'success'
                          : order.status === 'PENDING'
                            ? 'warning'
                            : 'error'
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>

                  {/* جمع کل */}
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {order.totalPrice.toLocaleString('fa-IR')} تومان
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <hr />
        <div className="pt-3">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(tableData.length / itemsPerPage)}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  )
}

export default Orders
