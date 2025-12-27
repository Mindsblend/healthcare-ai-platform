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
    <div className="grid grid-cols-[2fr_1fr_1fr_40px] items-center border-b px-8 py-3 last:border-b-0">
      <div className="flex items-center">
        <Image
          src={image}
          alt="product image"
          width={95}
          height={95}
          className="rounded-3xl"
        />
        <div className="mr-6">
          <h1 className="font-aria text-color-title-on-light text-2xl font-extrabold">
            {title}
          </h1>
          <p className="font-ray text-color-body-on-light mt-1.5 max-w-40 text-sm font-medium">
            {solution}
          </p>
        </div>
      </div>
      <div className="flex h-10 w-24 items-center justify-between overflow-hidden rounded-3xl bg-[#f2f2f2] text-center">
        <button
          onClick={handleIncrement}
          className="flex h-8 w-8 cursor-pointer items-center justify-center pr-2 transition hover:bg-gray-100 active:scale-95"
        >
          <Image src="/images/add.svg" alt="add icon" width={10} height={10} />
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
  )
}
export default CartItem
