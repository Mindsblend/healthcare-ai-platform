'use client'

import { useBlogsPreview } from '@/features/shop/hooks/blogs/useBlogsPreview'
import Blog from '@/components/layout/Blog'
import { BlogType } from '@/components/types/types'
import Image from 'next/image'
import LoadingBar from '@/components/layout/LoadingBar'

const page = () => {
  const { blogs, loading, error } = useBlogsPreview()

  const sortedBlogs: BlogType[] = [...blogs].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )

  const latestBlog: BlogType = sortedBlogs[0]
  const remainingBlogs: BlogType[] = sortedBlogs.slice(1)

  return (
    <LoadingBar
      loading={loading}
      error={error}
      loadingText="در حال بارگذاری بلاگ ها..."
    >
      {!blogs || blogs.length === 0 ? (
        <div className="container mt-28 text-center">
          <p>هیچ بلاگی یافت نشد</p>
        </div>
      ) : (
        <div className="container mt-14 xl:mt-28">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="font-aria text-color-title-on-light max-w-lg text-3xl font-extrabold sm:text-4xl xl:max-w-3xl xl:text-6xl">
              راهنمای کامل برای زندگی با انرژی و طول عمر بیشتر
            </h1>
            <p className="font-ray text-color-title-on-light mt-5 max-w-xl text-xs sm:text-sm xl:text-lg">
              زندگی روزمره پر از فشار، تغذیه ناسالم و استرس‌های پنهان است که
              اغلب ما متوجه اثرات آن بر بدن و ذهن‌مان نمی‌شویم. این صفحه برای
              شما ساخته شده تا با ارائه مقالات علمی، توصیه‌های عملی و راهکارهای
              شخصی‌سازی‌شده، مسیر شما را به سمت سلامتی پایدار، انرژی بیشتر و طول
              عمر بالاتر هموار کند.
            </p>
          </div>

          {/* Latest Blog */}
          <div className="bg-page mt-14 flex w-full flex-col gap-4 rounded-3xl border border-black/25 px-2 py-3 lg:min-h-135.5 lg:flex-row lg:gap-7">
            {/* content */}
            <div className="order-2 flex flex-col rounded-3xl bg-[#F2F2F2] px-5 py-4 lg:order-0 lg:grow lg:px-12 lg:py-6">
              {/* text */}
              <div className="text-color-title-on-light">
                <h1 className="font-aria text-2xl font-extrabold lg:text-5xl">
                  {latestBlog.title}
                </h1>

                <p className="font-ray mt-3 text-sm font-medium lg:mt-3.5 lg:text-base">
                  <div
                    dangerouslySetInnerHTML={{ __html: latestBlog.description }}
                  ></div>
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
              <div className="mt-auto flex flex-col-reverse gap-4 pt-6 lg:flex-row lg:items-center lg:justify-between">
                <a
                  href="#"
                  className="text-color-title-on-dark font-ray flex h-12 w-full shrink-0 items-center justify-center rounded-3xl bg-black px-7 whitespace-nowrap lg:w-41.25"
                >
                  مطالعه بیشتر
                </a>

                <div className="flex shrink-0 items-center gap-2.5">
                  <Image
                    src={latestBlog.authorImage || '/images/default-avatar.png'}
                    alt="writer image"
                    width={46}
                    height={46}
                    className="rounded-full"
                  />
                  <div>
                    <h1 className="font-aria text-color-title-on-light text-[16px] font-extrabold">
                      {latestBlog.author}
                    </h1>
                    <p className="font-ray text-color-title-on-light text-[14px]">
                      نویسنده و پژوهشگر
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* image */}
            <div
              className="relative order-1 h-100 w-full rounded-3xl bg-cover bg-center lg:order-0 lg:h-auto lg:max-w-185"
              style={{
                backgroundImage: `url(${latestBlog.image || '/images/default-blog.png'})`,
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
          </div>

          {/* All Blogs */}
          <div className="mt-14 grid flex-1 grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {remainingBlogs.map((blog) => (
              <Blog key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      )}
    </LoadingBar>
  )
}

export default page
