import Image from "next/image"

const CartItem = () => {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_40px] items-center border-b px-8 py-3 last:border-b-0">
      <div className="flex items-center">
        <Image
          src="/images/product-five.svg"
          alt="product image"
          width={95}
          height={95}
          className="rounded-3xl"
        />
        <div className="mr-6">
          <h1 className="font-aria text-color-title-on-light text-2xl font-extrabold">
            عرق خونساز
          </h1>
          <p className="font-ray text-color-body-on-light mt-1.5 max-w-40 text-sm font-medium">
            جلوگیری از خشکی پوست با تامین آب و رطوبت لازم
          </p>
        </div>
      </div>
      <div className="flex h-10 w-24 items-center justify-between overflow-hidden rounded-3xl bg-[#f2f2f2] text-center">
        <button className="flex h-8 w-8 cursor-pointer items-center justify-center pr-2 text-gray-600 transition hover:bg-gray-100 active:scale-95">
          <Image src="/images/add.svg" alt="add icon" width={10} height={10} />
        </button>

        <span className="text-color-title-on-light font-aria text-center font-extrabold">
          ۵
        </span>

        <button className="flex h-8 w-8 cursor-pointer items-center justify-center pl-2 text-gray-600 transition hover:bg-gray-100 active:scale-95">
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
          ۲۲۰ تومان
        </h1>
      </div>
      <div className="flex items-center justify-center">
        <Image
          src="/images/delete.svg"
          alt="delete icon"
          width={24}
          height={24}
        />
      </div>
    </div>
  )
}

export default CartItem
