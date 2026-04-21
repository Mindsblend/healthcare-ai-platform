import BlogSwiper from '@/components/layout/BlogSwiper'

const BlogsSection = () => {
  return (
    <div className="container my-12 flex w-full flex-col">
      {/* only this block is centered */}
      <div className="text-color-title-on-light flex flex-col items-center text-center">
        <h1 className="font-aria text-xl font-bold">دانش برای سلامتی</h1>
        <h1 className="font-aria text-color-title-on-light mt-3 max-w-2xl text-center text-2xl font-bold sm:text-4xl xl:max-w-4xl xl:text-5xl">
          مقالات عمیق، بینش‌های علمی و الهام‌هایی برای یک زندگی طولانی‌تر و
          باکیفیت‌تر
        </h1>
      </div>

      {/* slider below, full width */}
      <div className="flex items-center justify-center">
        <BlogSwiper />
      </div>
    </div>
  )
}

export default BlogsSection
