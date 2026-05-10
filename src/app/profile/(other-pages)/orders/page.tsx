'use client'

import { useMemo, useState } from 'react'
import { useUserOrder } from '@/features/shop/hooks/profile/useUserOrder'
import { OrderStatus } from '@/components/types/types'
import { getStatusLabel } from '@/lib/helpers'

const OrdersContent = () => {
  const { userOrder, loading, error } = useUserOrder()
  const [activeStatus, setActiveStatus] = useState<string>('all')

  // Define status groups
  const statusGroups = [
    {
      id: 'all',
      label: 'همه',
      statuses: ['PENDING', 'DELIVERING', 'DELIVERED', 'CANCELED', 'REFUNDED'],
    },
    { id: 'pending', label: getStatusLabel('PENDING'), statuses: ['PENDING'] },
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

  // Get number of orders in each status
  const getStatusCount = (statuses: string[]) => {
    if (statuses[0] === 'all') {
      return userOrder?.orders.length
    }
    return userOrder?.orders.filter((order) =>
      statuses.includes(order.status as OrderStatus),
    ).length
  }

  // Get filtered orders based on active status
  const filteredOrders = useMemo(() => {
    if (!userOrder?.orders) return []

    if (activeStatus === 'all') {
      return userOrder.orders
    }
    const selectedGroup = statusGroups.find(
      (group) => group.id === activeStatus,
    )
    if (!selectedGroup) return userOrder.orders

    return userOrder.orders.filter((order) =>
      selectedGroup.statuses.includes(order.status as OrderStatus),
    )
  }, [userOrder, activeStatus])

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
  }

  // Format date
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return '-'
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) return 'تاریخ نامعتبر'
    return dateObj.toLocaleDateString('fa-IR')
  }

  if (loading) {
    return (
      <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">
          سفارش ها
        </h2>
        <div className="text-center">در حال بارگذاری...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">
          سفارش ها
        </h2>
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          خطا در بارگذاری سفارش‌ها. لطفاً دوباره تلاش کنید.
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="w-full rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">
          سفارش ها
        </h2>

        {/* Status Filters */}
        <div className="mb-3.75 flex w-full flex-wrap items-center gap-5">
          {statusGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveStatus(group.id)}
              className={`flex h-7 cursor-pointer items-center gap-1 transition-all ${
                activeStatus === group.id
                  ? 'border-b-2 border-[#161A1D]'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <span
                className={`font-ray font-medium ${
                  activeStatus === group.id ? 'text-black' : 'text-[#A2A2A2]'
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
                {getStatusCount(group.statuses as OrderStatus[])}
              </div>
            </button>
          ))}
        </div>

        <hr className="w-full" />

        <div className="mt-7.5 w-full">
          {filteredOrders.length === 0 ? (
            <div className="w-full py-10 text-center text-gray-500">
              سفارشی با این وضعیت وجود ندارد
            </div>
          ) : (
            <div className="w-full space-y-5">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="w-full rounded-[10px] border border-[#D9D9D9] p-5"
                >
                  {/* Status Badge */}
                  <div className="w-full">
                    <span
                      className={`font-aria inline-block rounded-full px-3 py-1 text-sm font-medium ${
                        order.status === 'DELIVERED'
                          ? 'bg-green-100 text-green-600'
                          : order.status === 'CANCELED'
                            ? 'bg-red-100 text-red-600'
                            : order.status === 'PENDING'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {getStatusLabel(order.status as OrderStatus)}
                    </span>
                  </div>

                  <div className="font-ray mt-3 flex w-full gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">تاریخ:</span>
                      <span className="text-black">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FF0000]"></div>
                      <span className="text-sm text-gray-500">کد سفارش:</span>
                      <span className="font-medium text-black">{order.id}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#FF0000]"></div>
                      <span className="text-sm text-gray-500">مبلغ کل:</span>
                      <span className="font-bold text-black">
                        {formatPrice(order.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Products List - در صورت نیاز فعال کنید */}
                  {/* <div className="mt-4 w-full border-t border-[#D9D9D9] pt-4">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex w-full items-center gap-4 py-2">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 rounded-md object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-black">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            تعداد: {item.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-black">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrdersContent
