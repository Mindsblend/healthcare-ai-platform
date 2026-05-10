import Image from 'next/image'
import { BlogType } from '../types/types'
import Link from 'next/link'

interface Props {
  blog: BlogType
}

const Blog = ({ blog }: Props) => {
  return (
    <div className="bg-page flex w-full flex-col rounded-3xl border border-black/25 px-2.5 py-2.5">
      {/* top image */}
      <div
        className="relative aspect-square w-full rounded-3xl bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${blog.image || '/images/default-blog.png'})`,
        }}
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

      {/* content */}
      <div className="mt-2 flex grow flex-col justify-between rounded-3xl bg-[#F2F2F2] p-4.25">
        <div className="text-color-title-on-light">
          <h1 className="font-ray text-xl font-extrabold xl:text-2xl">
            {blog.title}
          </h1>
          <p className="font-ray mt-1.5 text-sm font-medium">
            <div dangerouslySetInnerHTML={{ __html: blog.description }}></div>

            <Link href={'/blogs/' + blog.slug}>
              <span className="text-color-body-on-light mr-1.5 inline-flex cursor-pointer items-center">
                ادامه مطلب
                <Image
                  src="/images/left-arrow.svg"
                  alt="read more"
                  width={16}
                  height={16}
                />
              </span>
            </Link>
          </p>
        </div>

        {/* footer */}
        <div className="mt-3.5 flex flex-col-reverse gap-4 xl:flex-row xl:items-center xl:justify-between">
          <Link
            href={'/blogs/' + blog.slug}
            className="text-color-title-on-dark font-ray flex h-12 w-full items-center justify-center rounded-3xl bg-black px-7 xl:w-41.25"
          >
            مطالعه بیشتر
          </Link>

          <div className="flex items-center gap-2.5 2xl:ml-5">
            <Image
              src={blog.authorImage || '/images/default-avatar.png'}
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
                {blog.authorTitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog
