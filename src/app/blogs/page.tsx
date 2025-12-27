'use client'

import { useBlogs } from '@/features/shop/hooks/blogs/useBlogs'
import Blog from '@/components/layout/Blog'

const page = () => {
  const { blogs, loading, error } = useBlogs()

  return (
    <div className="container">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="font-aria text-color-title-on-light max-w-3xl text-6xl font-extrabold">
          راهنمای کامل برای زندگی با انرژی و طول عمر بیشتر
        </h1>
        <p className="font-ray text-color-title-on-light max-w-xl text-lg">
          زندگی روزمره پر از فشار، تغذیه ناسالم و استرس‌های پنهان است که اغلب ما
          متوجه اثرات آن بر بدن و ذهن‌مان نمی‌شویم. این صفحه برای شما ساخته شده
          تا با ارائه مقالات علمی، توصیه‌های عملی و راهکارهای شخصی‌سازی‌شده،
          مسیر شما را به سمت سلامتی پایدار، انرژی بیشتر و طول عمر بالاتر هموار
          کند.
        </p>
      </div>
      <div className="grid flex-1 grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3 mt-14">
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

export default page
