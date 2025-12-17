import Image from 'next/image'

const categories = [
  {
    id: '0',
    title: 'پوست و مو',
    icon: '/images/clean.svg',
  },
  {
    id: '1',
    title: 'مکمل ها',
    icon: '/images/medication.svg',
  },
  {
    id: '2',
    title: 'مراقبت ذهنی',
    icon: '/images/mindfulness.svg',
  },
  {
    id: '3',
    title: 'حیوانات',
    icon: '/images/pets.svg',
  },
  {
    id: '4',
    title: 'موادغذایی',
    icon: '/images/spoon.svg',
  },
  {
    id: '5',
    title: 'لوازم خانه',
    icon: '/images/chair.svg',
  },
]

const ProductCategorySection = () => {
  return (
    <div className="mb-10 px-24">
      <div className="text-center">
        <h1 className="font-aria text-color-title-on-light text-[30px] font-extrabold">
          دسته بندی محصولات
        </h1>
        <p className="font-ray font-regular text-color-body-on-light text-[16px]">
          سالم‌ترین و ارگانیک‌ترین انتخاب‌ها، با دقت برای شما آماده شده‌اند
        </p>
      </div>
      <div className="flex items-center text-color-title-on-light justify-center gap-16 mt-4">
        {categories.map((category) => (
          <div key={category.id} className="h-[107px] w-[86px]">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[10px] border border-[#E9E9E8] text-center">
              <Image
                src={category.icon}
                alt={category.title}
                width={32}
                height={32}
              />
            </div>
            <h1 className="font-aria mt-2 text-center text-[16px] font-bold">
              {category.title}
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductCategorySection
