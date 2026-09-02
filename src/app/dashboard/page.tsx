import { EcommerceMetrics } from '@/components/domain/dashboard/ecommerce/EcommerceMetrics'
import RecentOrders from '@/components/domain/dashboard/ecommerce/RecentOrders'

export default async function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics />

        {/* <MonthlySalesChart /> */}
      </div>

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
        </div> */}

      <div className="col-span-12">
        <RecentOrders />
        {/* <MonthlyTarget /> */}
      </div>
    </div>
  )
}
