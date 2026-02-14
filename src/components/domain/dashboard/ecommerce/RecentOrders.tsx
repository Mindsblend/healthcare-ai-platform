import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../ui/table'
import Badge from '../../../ui/badge/Badge'
import { OrderType } from '@/components/types/types'
import Link from 'next/link'

const tableData: OrderType[] = [
  {
    cartId: 1,
    customerName: 'حسین علی زاده',
    email: 'hossein@gmail.com',
    createdAt: '2026-02-10',
    variants: '2 Variants',
    totalPrice: 2399.0,
    status: 'PAID',
  },
  {
    cartId: 2,
    customerName: 'علی ابتکاری',
    email: 'ali@gmail.com',
    createdAt: '2026-02-11',
    variants: '1 Variant',
    totalPrice: 879.0,
    status: 'CANCELED',
  },
  {
    cartId: 3,
    customerName: 'آرمان ابتکاری',
    email: 'arman@gmail.com',
    createdAt: '2026-02-12',
    variants: '2 Variants',
    totalPrice: 1869.0,
    status: 'PENDING',
  },
  {
    cartId: 4,
    customerName: 'اشکان ابتکاری',
    email: 'ashkan@gmail.com',
    createdAt: '2026-02-13',
    variants: '2 Variants',
    totalPrice: 1699.0,
    status: 'REFUNDED',
  },
  {
    cartId: 5,
    customerName: 'کیان ابتکاری',
    email: 'kian@gmail.com',
    createdAt: '2026-02-13',
    variants: '1 Variant',
    totalPrice: 240.0,
    status: 'PAID',
  },
]

export default function RecentOrders() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          سفارشات اخیر
        </h3>

        <Link href='/dashboard/orders' className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
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
            {tableData.map((order) => (
              <TableRow key={order.cartId}>
                {/* شماره سفارش */}
                <TableCell className="text-theme-sm py-3 font-medium text-gray-800 dark:text-white/90">
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
