import { getSession } from '@/features/auth/services/sessionService'
import Sidebar from '@/components/layout/Sidebar'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await getSession()

  if (!user) {
    redirect('/auth')
  } else {
    return (
      <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">
          نام کاربری
        </h2>
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-aria text-sm font-semibold text-[#A2A2A2]">
                نام
              </label>
              <input
                type="text"
                className="font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black"
              />
            </div>
            <div>
              <label className="font-aria text-sm font-semibold text-[#A2A2A2]">
                نام خانوادگی
              </label>
              <input
                type="text"
                className="font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black"
              />
            </div>
            <div>
              <label className="font-aria text-sm font-semibold text-[#A2A2A2]">
                کد پستی
              </label>
              <input
                type="text"
                className="font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black"
              />
            </div>
            <div>
              <label className="font-aria text-sm font-semibold text-[#A2A2A2]">
                ایمیل
              </label>
              <input
                type="email"
                className="font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black"
              />
            </div>
            <div>
              <label className="font-aria text-sm font-semibold text-[#A2A2A2]">
                شماره موبایل
              </label>
              <input
                type="tel"
                className="font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black"
              />
            </div>
            <div>
              <label className="font-aria text-sm font-semibold text-[#A2A2A2]">
                شهر
              </label>
              <input
                type="text"
                className="font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black"
              />
            </div>
            <div>
              <label className="font-aria text-sm font-semibold text-[#A2A2A2]">
                استان
              </label>
              <input
                type="text"
                className="font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black"
              />
            </div>
          </div>
          <div className="mt-7.5 gap-x-3 self-end">
            <button className="font-aria h-9.5 w-33 cursor-pointer text-sm font-bold text-black">
              انصراف
            </button>
            <button className="font-aria h-9.5 w-33 cursor-pointer rounded-[5px] bg-[#161A1D] text-sm font-bold text-white">
              اعمال تعغیرات
            </button>
          </div>
        </div>
      </div>
    )
  }
}
