import Image from 'next/image'
import { BlogType } from '../types/types'

interface Props {
  blog: BlogType
}

const Blog = ({ blog }: Props) => {
  return (
    <div className="bg-page h-[542px] w-[415px] rounded-3xl border border-black/25 px-2 py-3">
      <div
        className="relative w-[398px] h-[334px] rounded-3xl"
        style={{ backgroundImage: `url(${blog.image})` }}
      >
        <div className="bg-page absolute top-3.5 right-4 z-10 h-12 w-12 rounded-full p-2.5">
          <Image
            src="/images/binoculars.svg"
            alt="Product icon"
            width={30}
            height={30}
          />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between rounded-3xl bg-[#F2F2F2] px-6 py-4 h-[177px]">
        <div className="text-color-title-on-light">
          <h1 className="font-ray text-[24px] font-extrabold">{blog.title}</h1>
          <p className="font-ray max-w-full text-[14px] font-medium">
            {blog.description}
            <span className="text-color-body-on-light mr-1.5 inline-flex cursor-pointer items-center">
              ادامه مطلب
              <Image
                src="/images/left-arrow.svg"
                alt="read more"
                width={16}
                height={16}
              />
            </span>
          </p>
          <div className="mt-2 flex">
            <a
              href="#"
              className="text-color-title-on-dark font-ray font-regular flex h-12 w-[165px] items-center justify-center rounded-3xl bg-black px-7"
            >
              مطالعه بیشتر
            </a>
            <div className="mr-2.5 flex gap-2.5">
              <Image
                src="/images/arash.svg"
                alt="writer image"
                width={46}
                height={46}
                className="rounded-full"
              />
              <div className="gap-y-2">
                <h1 className="font-aria text-[16px] font-extrabold">
                  سینا توکلی
                </h1>
                <p className="font-ray font-regular text-[14px]">
                  نویسنده و پژوهشگر
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog
