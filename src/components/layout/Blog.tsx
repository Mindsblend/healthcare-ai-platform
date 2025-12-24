import Image from 'next/image'
import { BlogType } from '../types/types'

interface Props {
  blog: BlogType
}

const Blog = ({ blog }: Props) => {
  return (
    <div className="bg-page flex min-h-[542px] w-full max-w-[415px] flex-col rounded-3xl border border-black/25 px-2 py-3">
      {/* تصویر بالا */}
      <div
        className="relative h-[334px] w-full rounded-3xl bg-cover bg-center"
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

      {/* محتوا */}
      <div className="mt-2 flex flex-grow flex-col justify-between rounded-3xl bg-[#F2F2F2] px-6 py-4">
        <div className="text-color-title-on-light">
          <h1 className="font-ray text-[20px] font-extrabold md:text-[24px]">
            {blog.title}
          </h1>
          <p className="font-ray line-clamp-3 text-[14px] font-medium">
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
        </div>

        {/* footer */}
        <div className="mt-4 flex flex-col-reverse gap-4 lg:flex-row lg:items-center lg:justify-between">
          <a
            href="#"
            className="text-color-title-on-dark font-ray flex h-12 w-full items-center justify-center rounded-3xl bg-black px-7 lg:w-[165px]"
          >
            مطالعه بیشتر
          </a>

          <div className="flex items-center gap-2.5">
            <Image
              src={blog.authorImage}
              alt="writer image"
              width={46}
              height={46}
              className="rounded-full"
            />
            <div>
              <h1 className="font-aria text-color-title-on-light text-[16px] font-extrabold">
                {blog.author}
              </h1>
              <p className="font-ray text-color-title-on-light text-[14px]">
                نویسنده و پژوهشگر
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog
