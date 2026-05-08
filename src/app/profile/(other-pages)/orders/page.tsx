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
    if (activeStatus === 'all') {
      return userOrder
    }
    const selectedGroup = statusGroups.find(
      (group) => group.id === activeStatus,
    )
    if (!selectedGroup) return userOrder
    return userOrder?.orders.filter((order) =>
      selectedGroup.statuses.includes(order.status as OrderStatus),
    )
  }, [userOrder, activeStatus])

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان'
  }

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fa-IR')
  }

  return (
    <div>
      <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">
          سفارش ها
        </h2>
        {/* Status Filters */}
        <div className="mb-3.75 flex flex-wrap items-center gap-5">
          {statusGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setActiveStatus(group.id)}
              className={`flex items-center gap-1 transition-all ${
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
        <hr />
        <div className="mt-7.5 p-5"></div>
      </div>
    </div>
  )
}

export default OrdersContent
