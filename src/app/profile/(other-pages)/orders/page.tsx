// components/shop/profile/orders/OrdersContent.tsx

'use client'

import { useMemo, useState } from 'react'
import { useUserOrder } from '@/features/shop/hooks/profile/useUserOrder'
import Image from 'next/image'
import { OrderStatus, OrderItem } from '@/features/shop/shop.types'
import { getStatusLabel, toPersianDigit } from '@/lib/helpers'
import LoadingBar from '@/components/layout/LoadingBar'

// تایپ محلی برای Order - دقیقاً مطابق با ساختار Prisma
interface LocalOrder {
  id: string
  totalPrice: number
  status: string
  createdAt: Date | string
  items: OrderItem[]
}

const OrdersContent = () => {
  const { userOrder, loading, error } = useUserOrder()
  const [activeStatus, setActiveStatus] = useState<string>('all')

  // تعریف گروه‌های وضعیت
  const statusGroups = [
    {
      id: 'all',
      label: 'همه',
      statuses: [
        'PENDING',
        'PREPARING',
        'DELIVERING',
        'DELIVERED',
        'CANCELED',
        'REFUNDED',
      ],
    },
    { id: 'pending', label: getStatusLabel('PENDING'), statuses: ['PENDING'] },
    {
      id: 'preparing',
      label: getStatusLabel('PREPARING'),
      statuses: ['PREPARING'],
    },
    {
      id: 'delivering',
      label: getStatusLabel('DELIVERING'),
      statuses: ['DELIVERING'],
    },
    {
      id: 'delivered',
      label: getStatusLabel('DELIVERED'),
      statuses: ['DELIVERED'],
    },
    {
      id: 'canceled',
      label: getStatusLabel('CANCELED'),
      statuses: ['CANCELED'],
    },
    {
      id: 'refunded',
      label: getStatusLabel('REFUNDED'),
      statuses: ['REFUNDED'],
    },
  ]

  // محاسبه تعداد سفارش‌ها در هر وضعیت
  const getStatusCount = (statuses: string[]) => {
    if (!userOrder?.orders) return 0

    // تبدیل به تایپ مشخص
    const orders = userOrder.orders as unknown as LocalOrder[]

    if (statuses.length === 1 && statuses[0] !== 'all') {
      return (
        orders.filter((order: LocalOrder) => order.status === statuses[0])
          .length || 0
      )
    }

    return orders.length
  }

  // فیلتر سفارش‌ها بر اساس وضعیت فعال
  const filteredOrders: LocalOrder[] = useMemo(() => {
    if (!userOrder?.orders) return []

    // تبدیل نوع برای سازگاری با تایپ‌های Prisma
    const orders = userOrder.orders as unknown as LocalOrder[]

    if (activeStatus === 'all') {
      return orders
    }

    const selectedGroup = statusGroups.find(
      (group) => group.id === activeStatus
    )
    if (!selectedGroup) return orders

    return orders.filter((order: LocalOrder) =>
      selectedGroup.statuses.includes(order.status)
    )
  }, [userOrder, activeStatus])

  // فرمت قیمت به ریال
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
  }

  // فرمت تاریخ شمسی
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'تاریخ نامعتبر'
    return dateObj.toLocaleDateString('fa-IR')
  }

  // تعیین رنگ بر اساس وضعیت سفارش
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-600'
      case 'CANCELED':
        return 'bg-red-100 text-red-600'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-600'
      case 'REFUNDED':
        return 'bg-purple-100 text-purple-600'
      case 'PREPARING':
        return 'bg-blue-100 text-blue-600'
      case 'DELIVERING':
        return 'bg-indigo-100 text-indigo-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="w-full">
      <LoadingBar loading={loading} error={error}>
        <div>
          <div className="w-full rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-5 py-5 sm:px-10 sm:py-8">
            <h2 className="font-aria mb-6 text-xl font-bold text-black">
              سفارش ها
            </h2>

            {/* فیلترهای وضعیت */}
            <div className="mb-3.75 w-full overflow-x-auto pb-3">
              <div className="flex w-max flex-nowrap items-center gap-5 px-1">
                {statusGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => setActiveStatus(group.id)}
                    className={`flex h-7 shrink-0 cursor-pointer items-center gap-1 whitespace-nowrap transition-all ${
                      activeStatus === group.id
                        ? 'border-b-2 border-[#161A1D]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span
                      className={`font-ray font-medium ${
                        activeStatus === group.id
                          ? 'text-black'
                          : 'text-[#A2A2A2]'
                      }`}
                    >
                      {group.label}
                    </span>
                    <div
                      className={`font-aria flex h-5 w-5 items-center justify-center rounded-xs text-center text-sm font-semibold ${
                        activeStatus === group.id
                          ? 'bg-[#161A1D] text-white'
                          : 'bg-[#D9D9D9] text-black'
                      }`}
                    >
                      {getStatusCount(group.statuses)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <hr className="w-full" />

            {/* لیست سفارش‌ها */}
            <div className="mt-7.5 w-full">
              {filteredOrders.length === 0 ? (
                <div className="w-full py-10 text-center text-gray-500">
                  سفارشی با این وضعیت وجود ندارد
                </div>
              ) : (
                <div className="w-full space-y-5">
                  {filteredOrders.map((order: LocalOrder) => (
                    <div
                      key={order.id}
                      className="w-full rounded-[10px] border border-[#D9D9D9] p-5"
                    >
                      {/* نشان وضعیت */}
                      <div className="w-full">
                        <span
                          className={`font-aria inline-block rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status as OrderStatus)}
                        </span>
                      </div>

                      {/* اطلاعات سفارش */}
                      <div className="font-ray mt-3 flex w-full flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">تاریخ:</span>
                          <span className="text-black">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-[#FF0000]"></div>
                          <span className="text-sm text-gray-500">
                            کد سفارش:
                          </span>
                          <span className="font-medium text-black">
                            {order.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-[#FF0000]"></div>
                          <span className="text-sm text-gray-500">
                            مبلغ کل:
                          </span>
                          <span className="font-bold text-black">
                            {formatPrice(order.totalPrice)}
                          </span>
                        </div>
                      </div>

                      {/* لیست محصولات سفارش */}
                      <div className="mt-4 w-full border-t border-[#D9D9D9] pt-4">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item: OrderItem) => (
                            <div
                              key={item.id}
                              className="flex w-full flex-col gap-4 border-b border-gray-200 py-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                            >
                              {item.product?.image && (
                                <Image
                                  src={item.product.image}
                                  alt={item.product.title}
                                  className="h-16 w-16 rounded-md object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-black">
                                  {item.product?.title || 'محصول'}
                                </p>
                                <p className="text-sm text-gray-500">
                                  تعداد: {toPersianDigit(item.quantity)}
                                </p>
                              </div>
                              <div>
                                <p className="font-medium text-black">
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-2 text-center text-gray-500">
                            آیتمی برای این سفارش وجود ندارد
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </LoadingBar>
    </div>
  )
}

export default OrdersContent