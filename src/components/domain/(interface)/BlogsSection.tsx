import BlogSwiper from '@/components/layout/BlogSwiper'
import { BlogType } from '@/components/types/types'

interface Props {
  blogs: BlogType[]
}

const BlogsSection = ({ blogs }: Props) => {
  return (
    <div className="mt-48 flex w-full flex-col">
      {/* only this block is centered */}
      <div className="text-color-title-on-light flex flex-col items-center text-center">
        <h1 className="font-aria text-xl font-bold">دانش برای سلامتی</h1>
        <h1 className="font-aria mt-3 max-w-5xl text-5xl font-bold">
          مقالات عمیق، بینش‌های علمی و الهام‌هایی برای یک زندگی طولانی‌تر و
          باکیفیت‌تر
        </h1>
      </div>

      {/* slider below, full width */}
      <div className="flex items-center justify-center">
        <BlogSwiper blogs={blogs} />
      </div>
    </div>
  )
}

export default BlogsSection
