'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useOrders } from '@/features/dashboard/hooks/useOrders'
import PageBreadcrumb from '@/components/domain/dashboard/common/PageBreadCrumb'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../../components/ui/table'
import Badge from '../../../../components/ui/badge/Badge'
import Pagination from '@/components/domain/dashboard/tables/Pagination'
import { getStatusLabel, getStatusColor } from '@/lib/helpers'
import { OrderSummary } from '@/components/types/types'

const Orders = () => {
  const { orders, loading, error } = useOrders()

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()

    return dateB - dateA
  })

  const [selectedOrder, setSelectedOrder] = useState<OrderSummary | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [page, setPage] = useState(1)

  const itemsPerPage = 7
  const startIndex = (page - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = sortedOrders.slice(startIndex, endIndex)

  const handleViewOrder = (order: OrderSummary) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleUpdateOrder = async (updatedOrder: OrderSummary) => {
    // // Update your local state or refetch orders
    // await updateOrderMutation(updatedOrder)
    // setIsModalOpen(false)
    // // Refresh orders list
    // refetchOrders()
  }

  if (loading) return <div>در حال بارگذاری سفارشات...</div>

  if (error) return <div>خطا در بارگذاری سفارشات: {error}</div>

  if (!sortedOrders.length) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            سفارشات اخیر
          </h3>

          <Link
            href="/dashboard/orders"
            className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            مشاهده کامل
          </Link>
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-y border-gray-100 dark:border-gray-800">
              <TableRow>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 text-start font-medium text-gray-500 dark:text-gray-400"
                >
                  شماره سفارش
                </TableCell>
                <TableCell
                  isHeader
                  className="text-theme-xs py-3 font-medium text-gray-500 dark:text-gray-400"
                >
                  مشاهده جزئیات
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
              <TableRow>
                <td colSpan={6} className="h-64 text-center">
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
                        <path d="M3 7l9-4 9 4v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
                        <path d="M3 7l9 6 9-6" />
                      </svg>
                    </div>

                    <h3 className="text-color-title-on-light mb-2 text-lg font-semibold">
                      سفارشی وجود ندارد
                    </h3>

                    <p className="text-sm text-gray-500">
                      هنوز هیچ سفارشی ثبت نشده است.
                    </p>
                  </div>
                </td>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

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
                  className="text-theme-xs py-3 font-medium text-gray-500 dark:text-gray-400"
                >
                  مشاهده جزئیات
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
                <TableRow key={order.id}>
                  {/* ID */}
                  <TableCell className="text-theme-sm py-3 pr-4 font-medium text-gray-800 sm:pr-6 dark:text-white/90">
                    {order.id}
                  </TableCell>

                  {/* Management */}
                  <TableCell className="text-theme-sm h-24 px-8 py-3 text-center font-medium text-gray-800 dark:text-white/90">
                    <div className="flex h-full w-full items-center justify-center">
                      <button>
                        <Image
                          src="/images/eye.svg"
                          alt="Empty cart"
                          width={24}
                          height={24}
                          className="opacity-70"
                        />
                      </button>
                    </div>
                  </TableCell>

                  {/* Full Name */}
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        {order.shippingFirstName} {order.shippingLastName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {order.shippingEmail}
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-theme-sm py-3">
                    <Badge size="sm" color={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
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
            totalPages={Math.ceil(sortedOrders.length / itemsPerPage)}
            onPageChange={(newPage) => setPage(newPage)}
          />
        </div>
      </div>
    </div>
  )
}

export default Orders
