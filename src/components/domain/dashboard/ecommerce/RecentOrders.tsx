'use client'

import { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '../../../ui/table'
import Badge from '../../../ui/badge/Badge'
import { useOrdersPreview } from '@/features/shop/hooks/orders/useOrdersPreview'
import { getOrderById } from '@/features/shop/actions/orders/getOrderByIdAction'
import { useUpdateOrder } from '@/features/shop/hooks/orders/updateOrder'
import Link from 'next/link'
import {
  getStatusLabel,
  getStatusColor,
  getFreeShippingStatus,
  toPersianDigit,
} from '@/lib/helpers'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  OrderSummary,
  OrderStatus,
  OrderItem,
  GetOrderByIdResponse,
} from '@/features/shop/shop.types'
import LoadingBar from '@/components/layout/LoadingBar'

export default function RecentOrders() {
  const router = useRouter()
  const { orders, loading, error } = useOrdersPreview()
  const { updateOrder, loading: updating } = useUpdateOrder()

  const TAX_RATE = 0.09
  const FREE_SHIPPING_THRESHOLD = 2_000_000

  const [orderSubtotal, setOrderSubtotal] = useState(0)
  const [orderTaxAmount, setOrderTaxAmount] = useState(0)
  const [orderDeliveryAmount, setOrderDeliveryAmount] = useState(0)

  const [selectedOrder, setSelectedOrder] =
    useState<GetOrderByIdResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFetchingOrder, setIsFetchingOrder] = useState(false)

  // Form state for editing order
  const [orderId, setOrderId] = useState('')
  const [shippingFirstName, setShippingFirstName] = useState('')
  const [shippingLastName, setShippingLastName] = useState('')
  const [shippingEmail, setShippingEmail] = useState('')
  const [shippingPhone, setShippingPhone] = useState('')
  const [shippingCity, setShippingCity] = useState('')
  const [shippingProvince, setShippingProvince] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [shippingPostalCode, setShippingPostalCode] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('PAID')
  const [shippingNotes, setShippingNotes] = useState<string | undefined>(
    undefined,
  )
  const [createdAt, setCreatedAt] = useState<string>(new Date().toISOString())
  const [items, setItems] = useState<OrderItem[]>([])

  const lastFiveSortedOrders = [...orders]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA
    })
    .slice(0, 5)

  // Effect to update form when fetchedOrder changes
  useEffect(() => {
    if (selectedOrder && !isFetchingOrder) {
      setSelectedOrder(selectedOrder)
      setSelectedStatus(selectedOrder.status)
      setShippingNotes(selectedOrder.shippingNotes || '')
      setIsFetchingOrder(false)
    }
  }, [selectedOrder])

  const handleViewOrder = async (order: OrderSummary) => {
    setIsFetchingOrder(true)
    setIsModalOpen(true)

    try {
      const fullOrder = await getOrderById({ id: order.id })

      setSelectedOrder(fullOrder)
      setOrderId(fullOrder.id)
      setShippingFirstName(fullOrder.shippingFirstName)
      setShippingLastName(fullOrder.shippingLastName)
      setShippingEmail(fullOrder.shippingEmail)
      setShippingPhone(fullOrder.shippingPhone)
      setShippingCity(fullOrder.shippingCity)
      setShippingProvince(fullOrder.shippingProvince)
      setShippingAddress(fullOrder.shippingAddress)
      setShippingPostalCode(fullOrder.shippingPostalCode)
      setSelectedStatus(fullOrder.status)
      setShippingNotes(fullOrder.shippingNotes)
      setItems(fullOrder.items)
      setCreatedAt(fullOrder.createdAt)
    } catch (error) {
      console.error('Failed to fetch order details:', error)
    } finally {
      setIsFetchingOrder(false)
    }
  }

  useEffect(() => {
    if (selectedOrder && Array.isArray(selectedOrder.items)) {
      const calculatedSubtotal = selectedOrder.items.reduce(
        (itemSum, item) => itemSum + item.price * item.quantity,
        0,
      )
      setOrderSubtotal(calculatedSubtotal)

      const calculatedTax = Math.round(calculatedSubtotal * TAX_RATE)
      setOrderTaxAmount(calculatedTax)

      const isFreeShipping = getFreeShippingStatus(
        calculatedSubtotal,
        FREE_SHIPPING_THRESHOLD,
      )
      const calculatedDeliveryAmount = isFreeShipping ? 0 : 300_000
      setOrderDeliveryAmount(calculatedDeliveryAmount)
    } else {
      // Reset if no order is selected or items are missing
      setOrderSubtotal(0)
      setOrderTaxAmount(0)
      setOrderDeliveryAmount(0)
    }
  }, [selectedOrder])

  const handleApplyChanges = async () => {
    if (!selectedOrder) return

    try {
      await updateOrder({
        orderId: selectedOrder.id,
        status: selectedStatus,
        shippingNotes,
      })
      setIsModalOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Failed to update order:', error)
    }
  }

  if (!orders.length) {
    return (
      <LoadingBar loading={loading} error={error}>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/3">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              سفارشات اخیر
            </h3>

            <Link
              href="/dashboard/orders"
              className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
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
                    شماره تلفن
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
                  <td colSpan={7} className="h-64 text-center">
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
      </LoadingBar>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-4 pb-3 sm:px-6 dark:border-gray-800 dark:bg-white/3">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            سفارشات اخیر
          </h3>

          <Link
            href="/dashboard/orders"
            className="text-theme-sm shadow-theme-xs inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/3 dark:hover:text-gray-200"
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
                  شماره تلفن
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
              {lastFiveSortedOrders.map((order) => (
                <TableRow key={order.id}>
                  {/* ID */}
                  <TableCell className="text-theme-sm py-3 font-medium text-gray-800 dark:text-white/90">
                    {order.id}
                  </TableCell>

                  {/* View Button */}
                  <TableCell className="text-theme-sm py-3 text-center font-medium text-gray-800 dark:text-white/90">
                    <div className="flex items-center justify-center">
                      <button onClick={() => handleViewOrder(order)}>
                        <Image
                          src="/images/eye.svg"
                          alt="مشاهده جزئیات"
                          width={24}
                          height={24}
                          className="opacity-70 transition-opacity hover:opacity-100"
                        />
                      </button>
                    </div>
                  </TableCell>

                  {/* Name */}
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="text-theme-sm font-medium text-gray-800 dark:text-white/90">
                        {order.shippingFirstName} {order.shippingLastName}
                      </span>
                    </div>
                  </TableCell>

                  {/* Phone */}
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {toPersianDigit(order.shippingPhone)}
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

                  {/* Price */}
                  <TableCell className="text-theme-sm py-3 text-gray-500 dark:text-gray-400">
                    {order.totalPrice.toLocaleString('fa-IR')} تومان
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center bg-black/50">
          <div className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {isFetchingOrder
                  ? 'در حال بارگذاری...'
                  : `جزئیات سفارش - ${orderId}`}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            {isFetchingOrder ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-gray-900"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    در حال بارگذاری اطلاعات سفارش...
                  </p>
                </div>
              </div>
            ) : (
              selectedOrder && (
                <>
                  <div className="space-y-6 p-4">
                    {/* Customer Information */}
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
                        اطلاعات مشتری
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            نام و نام خانوادگی
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white/90">
                            {shippingFirstName} {shippingLastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            ایمیل
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white/90">
                            {shippingEmail}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            تلفن
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white/90">
                            {toPersianDigit(shippingPhone)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            تاریخ سفارش
                          </p>
                          <p className="font-medium text-gray-800 dark:text-white/90">
                            {new Date(createdAt).toLocaleDateString('fa-IR')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
                        آدرس تحویل
                      </h3>
                      <div className="space-y-2 text-gray-800 dark:text-white/90">
                        <p>{shippingAddress}</p>
                        <p>
                          {shippingCity}، {shippingProvince}
                        </p>
                        <p>کد پستی: {toPersianDigit(shippingPostalCode)}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
                        محصولات
                      </h3>
                      <div className="space-y-3">
                        {items && items.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                                    محصول
                                  </th>
                                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                                    تعداد
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                    قیمت واحد
                                  </th>
                                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                                    جمع
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
                                {items.map((item, index) => (
                                  <tr key={index}>
                                    <td className="px-4 py-3 text-sm text-gray-800 dark:text-white/90">
                                      {item.product.title}
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm text-gray-800 dark:text-white/90">
                                      {item.quantity}
                                    </td>
                                    <td className="px-4 py-3 text-left text-sm text-gray-800 dark:text-white/90">
                                      {item.price.toLocaleString('fa-IR')} تومان
                                    </td>
                                    <td className="px-4 py-3 text-left text-sm font-medium text-gray-800 dark:text-white/90">
                                      {(
                                        item.price * item.quantity
                                      ).toLocaleString('fa-IR')}{' '}
                                      تومان
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                              <tfoot className="bg-gray-50">
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                                  >
                                    مجموعه سفارش:
                                  </td>
                                  <td className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white/90">
                                    {orderSubtotal.toLocaleString('fa-IR')}{' '}
                                    تومان
                                  </td>
                                </tr>
                              </tfoot>
                              <tfoot className="bg-gray-50">
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                                  >
                                    هزینه ارسال:
                                  </td>
                                  <td className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white/90">
                                    {orderDeliveryAmount == 0
                                      ? 'ارسال رایگان 🎉'
                                      : orderDeliveryAmount.toLocaleString(
                                          'fa-IR',
                                        ) + ' تومان'}
                                  </td>
                                </tr>
                              </tfoot>
                              <tfoot className="bg-gray-50">
                                <tr>
                                  <td
                                    colSpan={3}
                                    className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white/90"
                                  >
                                    مالیات:
                                  </td>
                                  <td className="px-4 py-3 text-left text-sm font-semibold text-gray-800 dark:text-white/90">
                                    {orderTaxAmount.toLocaleString('fa-IR')}{' '}
                                    تومان
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-gray-400">
                            هیچ محصولی برای این سفارش یافت نشد.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status Update */}
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
                        تغییر وضعیت
                      </h3>
                      <select
                        value={selectedStatus}
                        onChange={(e) =>
                          setSelectedStatus(e.target.value as OrderStatus)
                        }
                        className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 dark:border-gray-700 dark:text-white/90"
                      >
                        <option value="PENDING">در حال آماده‌سازی</option>
                        <option value="PAID">پرداخت شده</option>
                        <option value="DELIVERING">در حال ارسال</option>
                        <option value="DELIVERED">تحویل داده شد</option>
                        <option value="FAILED">ناموفق</option>
                        <option value="CANCELED">لغو شده</option>
                        <option value="REFUNDED">مرجوع شده</option>
                      </select>
                    </div>

                    {/* Notes */}
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-white/90">
                        یادداشت سفارش
                      </h3>
                      <textarea
                        value={shippingNotes}
                        onChange={(e) => setShippingNotes(e.target.value)}
                        rows={4}
                        className="w-full rounded-lg border border-gray-300 p-2 text-gray-800 dark:border-gray-700 dark:text-white/90"
                        placeholder="یادداشت‌های سفارش..."
                      />
                    </div>

                    {/* Total */}
                    <div className="border-t pt-4">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-800 dark:text-white/90">
                          جمع کل:
                        </span>
                        <span className="text-xl font-bold text-gray-800 dark:text-white/90">
                          {selectedOrder.totalPrice.toLocaleString('fa-IR')}{' '}
                          تومان
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-end gap-3 border-t p-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-white/90 dark:hover:bg-gray-800"
                    >
                      انصراف
                    </button>
                    <button
                      onClick={handleApplyChanges}
                      disabled={updating}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {updating ? 'در حال ذخیره...' : 'اعمال تغییرات'}
                    </button>
                  </div>
                </>
              )
            )}
          </div>
        </div>
      )}
    </>
  )
}
