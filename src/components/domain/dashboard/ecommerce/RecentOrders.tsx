'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../ui/table'
import Badge from '../../../ui/badge/Badge'
import { useOrders } from '@/features/dashboard/hooks/useOrders'
import Link from 'next/link'

export default function RecentOrders() {
  const { orders, loading, error } = useOrders()

  if (loading) return <div>در حال بارگذاری سفارشات...</div>

  if (error) return <div>خطا در بارگذاری سفارشات: {error}</div>

  if (!orders.length) {
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

                    <h3 className="mb-2 text-color-title-on-light text-lg font-semibold">
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
            {orders.map((order) => (
              <TableRow key={order.cartId}>
                {/* شماره سفارش */}
                <TableCell className="text-theme-sm py-3 font-medium text-gray-800 dark:text-white/90">
                  #{order.cartId}
                </TableCell>

                {/* نام مشتری */}
                <TableCell className="py-3">
                  <div className="flex flex-col">
                    <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                      name
                    </span>
                  </div>
                </TableCell>

                {/* ایمیل */}
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {order.user?.email}
                </TableCell>

                {/* تاریخ سفارش */}
                <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString('fa-IR')}
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
    </div>
  )
}
