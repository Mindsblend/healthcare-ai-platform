import Image from 'next/image'
import Link from 'next/link'
import { BlogPreview } from '@/features/shop/shop.types'

interface Props {
  blog: BlogPreview
}

const Blog = ({ blog }: Props) => {
  return (
    <Link
      href={'/blogs/' + blog.slug}
      className="bg-page flex max-h-min w-full flex-col rounded-[16.5px] border border-black/25 p-2.5"
    >
      {/* top image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[16.5px]">
        <Image
          src={blog.image || '/images/default-blog.png'}
          alt={blog.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover"
        />
        <div className="bg-page absolute top-3 right-3 z-10 flex h-9.5 w-9.5 items-center justify-center rounded-full">
          <Image
            src="/images/binoculars.svg"
            alt="Product icon"
            width={23}
            height={23}
          />
        </div>
      </div>

      {/* content */}
      <div className="mt-2 flex grow flex-col justify-between rounded-[16.5px] bg-[#F2F2F2] p-2.5">
        <div className="text-color-title-on-light">
          <h2 className="font-ray text-base font-extrabold sm:text-lg">
            {blog.title}
          </h2>
          <div className="font-ray mt-1.5 line-clamp-2 text-xs font-medium">
            <div dangerouslySetInnerHTML={{ __html: blog.description }}></div>
          </div>
        </div>

        {/* footer */}
        <div className="mt-2.5 flex gap-2 xl:flex-row xl:items-center">
          <button className="text-color-title-on-dark font-ray flex h-10 w-full max-w-30 flex-1 cursor-pointer items-center justify-center rounded-3xl bg-black text-xs whitespace-nowrap transition hover:bg-gray-800">
            مطالعه بیشتر
          </button>
          <div className="flex items-center gap-1.25">
            <Image
              src={blog.authorImage || '/images/default-avatar.png'}
              alt="writer image"
              width={35}
              height={35}
              className="h-8.75 w-8.75 rounded-full bg-cover"
            />
            <div>
              <h3 className="font-aria text-color-title-on-light text-sm font-extrabold">
                {blog.author}
              </h3>
              <p className="font-ray text-color-title-on-light text-xs">
                {blog.authorTitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default Blog
