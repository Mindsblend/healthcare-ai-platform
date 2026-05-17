import Image from 'next/image'

type CartItemProps = {
  id: number
  title: string
  solution: string
  count: number
  price: number
  image: string
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

const CartItem = ({
  id,
  title,
  solution,
  count,
  price,
  image,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const handleIncrement = () => {
    onUpdateQuantity(id, count + 1)
  }

  const handleDecrement = () => {
    if (count <= 1) return
    onUpdateQuantity(id, count - 1)
  }

  return (
    <div className="border-b px-4 py-3 last:border-b-0 xl:px-8">
      {/* Mobile & Tablet Layout */}
      <div className="flex flex-col gap-3 lg:hidden">
        <div className="flex gap-5">
          {image && image.trim() !== '' ? (
            <Image
              src={image}
              alt="product image"
              width={80}
              height={80}
              className="h-20 w-20 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
              <span className="text-xs text-gray-400">بدون تصویر</span>
            </div>
          )}

          <div>
            <h1 className="font-aria text-color-title-on-light text-lg font-bold">
              {title}
            </h1>
            <p className="font-ray text-color-body-on-light mt-1 line-clamp-2 text-sm font-medium">
              {solution}
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-20.25 items-center justify-between overflow-hidden rounded-3xl bg-[#f2f2f2] text-center lg:h-9 lg:w-24">
              <button
                onClick={handleDecrement}
                disabled={count <= 1}
                aria-disabled={count <= 1}
                className={`flex h-7 w-7 items-center justify-center transition active:scale-95 xl:h-8 xl:w-8 ${
                  count <= 1
                    ? 'cursor-not-allowed opacity-40'
                    : 'cursor-pointer text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Image
                  src="/images/minimize.svg"
                  alt="minus icon"
                  width={10}
                  height={10}
                />
              </button>

              <span className="text-color-title-on-light font-aria text-center text-sm font-extrabold">
                {count.toLocaleString('fa-IR')}
              </span>

              <button
                onClick={handleIncrement}
                className="flex h-7 w-7 cursor-pointer items-center justify-center transition hover:bg-gray-100 active:scale-95 xl:h-8 xl:w-8"
              >
                <Image
                  src="/images/add.svg"
                  alt="add icon"
                  width={10}
                  height={10}
                />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <h1 className="font-aria text-color-title-on-light text-base font-extrabold">
                {price.toLocaleString('fa-IR')}
              </h1>
              <button onClick={() => onRemove(id)} className="cursor-pointer">
                <Image
                  src="/images/delete.svg"
                  alt="delete icon"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_40px] lg:items-center">
        <div className="flex items-center">
          {image && image.trim() !== '' ? (
            <Image
              src={image}
              alt="product image"
              width={80}
              height={80}
              className="rounded-3xl"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100">
              <span className="text-xs text-gray-400">بدون تصویر</span>
            </div>
          )}
          <div className="mr-6">
            <h1 className="font-aria text-color-title-on-light text-xl font-bold xl:text-2xl xl:font-extrabold">
              {title}
            </h1>
            <p className="font-ray text-color-body-on-light mt-1.5 line-clamp-2 max-w-40 text-sm font-medium">
              {solution}
            </p>
          </div>
        </div>

        <div className="flex h-10 w-24 items-center justify-between overflow-hidden rounded-3xl bg-[#f2f2f2] text-center">
          <button
            onClick={handleIncrement}
            className="flex h-8 w-8 cursor-pointer items-center justify-center pr-2 transition hover:bg-gray-100 active:scale-95"
          >
            <Image
              src="/images/add.svg"
              alt="add icon"
              width={10}
              height={10}
            />
          </button>

          <span className="text-color-title-on-light font-aria text-center font-extrabold">
            {count.toLocaleString('fa-IR')}
          </span>

          <button
            disabled={count <= 1}
            aria-disabled={count <= 1}
            onClick={handleDecrement}
            className={`flex h-8 w-8 cursor-pointer items-center justify-center pl-2 text-gray-600 transition hover:bg-gray-100 active:scale-95 ${
              count <= 1
                ? 'cursor-not-allowed opacity-40'
                : 'cursor-pointer text-gray-600 hover:bg-gray-100 active:scale-95'
            }`}
          >
            <Image
              src="/images/minimize.svg"
              alt="minus icon"
              width={10}
              height={10}
            />
          </button>
        </div>

        <div>
          <h1 className="font-aria text-color-title-on-light text-base font-extrabold">
            {price.toLocaleString('fa-IR')}
          </h1>
        </div>

        <div className="flex items-center justify-center">
          <button onClick={() => onRemove(id)} className="cursor-pointer">
            <Image
              src="/images/delete.svg"
              alt="delete icon"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem
