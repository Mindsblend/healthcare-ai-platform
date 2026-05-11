'use client'

import { useUserAddress } from '@/features/shop/hooks/profile/useUserAddress'
import { toPersianDigit } from '@/lib/helpers'

const AddressContent = () => {
  const { userAddress, loading, error } = useUserAddress()

  if (loading) {
    return (
      <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">آدرس ها</h2>
        <div className="py-12 text-center">
          <p className="text-black">در حال بارگذاری...</p>
        </div>
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

      {/* Check if userAddress and addresses exist before accessing length */}
      {!userAddress?.addresses || userAddress.addresses.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-black">هیچ آدرسی ثبت نشده است</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userAddress.addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-lg border border-[#D9D9D9] p-5"
            >
              <div className="font-ray flex items-start justify-between text-lg font-medium">
                <div className="space-y-2">
                  {address.isDefault && (
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                      آدرس پیش‌فرض
                    </span>
                  )}
                  <p className="text-black">{address.address}</p>
                  <div className="flex flex-col space-y-2 text-black">
                    <span>شهر: {address.city}</span>
                    <span>استان: {address.province}</span>
                  </div>
                  <span className="flex text-black">
                    کد پستی: {toPersianDigit(address.postalCode)}
                  </span>
                  <div className="flex gap-1 text-black">
                    <span>
                      گیرنده: {address.firstName} {address.lastName}
                    </span>
                    |<span>{toPersianDigit(address.phone)}</span>
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
