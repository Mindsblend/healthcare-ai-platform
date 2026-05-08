// app/profile/(other-pages)/address/page.tsx
'use client'

import { useUserAddress } from '@/features/shop/hooks/profile/useUserAddress'

const AddressContent = () => {
  const { userAddress, loading, error } = useUserAddress()

  if (loading) {
    return (
      <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">آدرس ها</h2>
        loading
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">آدرس ها</h2>
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          خطا در بارگذاری آدرس‌ها. لطفاً دوباره تلاش کنید.
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
      <h2 className="font-aria mb-6 text-xl font-bold text-black">آدرس ها</h2>

      {/* ✅ Fixed: Check if userAddress and addresses exist before accessing length */}
      {!userAddress ||
      !userAddress.addresses ||
      userAddress.addresses.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">هیچ آدرسی ثبت نشده است</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userAddress.addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-lg border border-[#D9D9D9] p-5"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  {address.isDefault && (
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                      آدرس پیش‌فرض
                    </span>
                  )}
                  <p className="text-gray-700">{address.address}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>{address.city}</span>
                    <span>{address.province}</span>
                    <span>{address.postalCode}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>
                      {address.firstName} {address.lastName}
                    </span>
                    <span>{address.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressContent
