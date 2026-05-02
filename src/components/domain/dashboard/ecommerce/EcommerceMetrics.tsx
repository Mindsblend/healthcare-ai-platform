'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { useOrders } from '@/features/dashboard/hooks/useOrders'
import Badge from '../../../ui/badge/Badge'
import ArrowDownIcon from '../../../../../public/images/arrow-down.svg'
import ArrowUpIcon from '../../../../../public/images/arrow-up.svg'
import BoxIconLine from '../../../../../public/images/box-line.svg'
import GroupIcon from '../../../../../public/images/group.svg'
import { useUsers } from '@/features/auth/hooks/useUsers'
import { useTrackedVisit } from '@/features/dashboard/hooks/useTrackedVisits'

export const EcommerceMetrics = () => {
  const { orders } = useOrders()
  const { users } = useUsers()
  const { visits } = useTrackedVisit()

  const now = Date.now()
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000
  const cutoff = now - THIRTY_DAYS

  const monthlyOrdersCount = useMemo(() => {
    if (!orders?.length) return 0

    return orders.filter((order) => {
      const created = new Date(order.createdAt).getTime()
      return created >= cutoff
    }).length
  }, [orders])

  const monthlyRevenue = useMemo(() => {
    if (!orders?.length) return 0

    return orders
      .filter((order) => {
        const created = new Date(order.createdAt).getTime()
        return created >= cutoff && order.status === 'PAID'
      })
      .reduce((sum, order) => sum + order.totalPrice, 0)
  }, [orders])

  const allTimeUsers = users.length

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <Image src={GroupIcon} alt="Customers" width={24} height={24} />
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              مشتری ها
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              {allTimeUsers.toLocaleString('fa-IR')}
            </h4>
          </div>
          {/* <Badge color="success">
            <Image src={ArrowUpIcon} alt="Arrow Up" width={16} height={16} />
            11.01%
          </Badge> */}
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <Image src={BoxIconLine} alt="Orders" width={24} height={24} />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              فروش
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              {monthlyOrdersCount.toLocaleString('fa-IR')}
            </h4>
          </div>

          {/* <Badge color="error">
            <Image
              src={ArrowDownIcon}
              alt="Arrow Down"
              width={16}
              height={16}
            />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <Image src={BoxIconLine} alt="Orders" width={24} height={24} />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              بازدید کننده ها
            </span>
            {visits.map((visit) => (
              <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
                {visit.visits.toLocaleString('fa-IR')}
              </h4>
            ))}
          </div>

          {/* <Badge color="error">
            <Image
              src={ArrowDownIcon}
              alt="Arrow Down"
              width={16}
              height={16}
            />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* Metric Item End */}

      {/* Metric Item Start */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
          <Image src={BoxIconLine} alt="Orders" width={24} height={24} />
        </div>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              درآمد کل
            </span>
            <h4 className="text-title-sm mt-2 font-bold text-gray-800 dark:text-white/90">
              {monthlyRevenue.toLocaleString('fa-IR')}
            </h4>
          </div>

          {/* <Badge color="error">
            <Image
              src={ArrowDownIcon}
              alt="Arrow Down"
              width={16}
              height={16}
            />
            9.05%
          </Badge> */}
        </div>
      </div>
      {/* Metric Item End */}
    </div>
  )
}
