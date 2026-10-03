'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import { useProductsPreview } from '@/features/shop/hooks/products/useProductsPreview'
import { getSearchTokens, normalizeSearchText } from '@/lib/search'

/* -------------------------------------------------------------------------- */
/*  تنظیمات                                                                    */
/* -------------------------------------------------------------------------- */

const SEARCH_PAGE = '/products' // صفحه نتایج: /products?q=...
const MAX_PRODUCTS = 5
const MAX_HISTORY = 6
const HISTORY_KEY = 'digisalamat:recent-searches'

const POPULAR_SEARCHES = ['روغن زیتون انگیزه', 'عسل 3 ستاره', 'روغن ارده کنجد']

/**
 * true  → تصویر مستقیم و بدون بهینه‌سازی Next لود می‌شود (روی هر دامنه‌ای کار می‌کند)
 * false → Next تصویر کوچک می‌سازد (سبک‌تر)؛ فقط اگر دامنه‌ی تصاویر در
 *         images.remotePatterns فایل next.config تعریف شده باشد false کن
 */
const UNOPTIMIZED_IMAGES = true

type ProductItem = ReturnType<
  typeof useProductsPreview
>['productsPreview'][number]

/**
 * ⚠️ این دو تابع را با ساختار واقعی محصولت تطبیق بده.
 * (من از روی کد صفحه فقط id / title / price / categoryId را مطمئنم.)
 */
function getProductHref(product: ProductItem) {
  const p = product as unknown as Record<string, unknown>
  return `/products/${p.slug ?? p.id}`
}

function getProductImage(product: ProductItem): string | undefined {
  const p = product as unknown as Record<string, unknown>
  const img = p.image ?? p.imageUrl ?? p.thumbnail ?? p.imagePath
  return typeof img === 'string' && img ? img : undefined
}

// هر آیتم قابل انتخاب در لیست (برای ناوبری با کیبورد)
type Item =
  | { kind: 'history'; text: string }
  | { kind: 'popular'; text: string }
  | { kind: 'product'; product: ProductItem }

/* -------------------------------------------------------------------------- */
/*  توابع کمکی                                                                 */
/* -------------------------------------------------------------------------- */

function formatPrice(n: number) {
  return new Intl.NumberFormat('fa-IR').format(n) + ' تومان'
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** پررنگ کردن کلمات تطبیق‌یافته */
function Highlight({ text, term }: { text: string; term: string }) {
  const tokens = getSearchTokens(term)
  if (tokens.length === 0) return <>{text}</>

  const parts = text.split(
    new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'i'),
  )

  // با split و گروه capture، آیتم‌های با اندیس فرد همان تطبیق‌ها هستند
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-transparent font-extrabold text-blue-500">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

/** تاریخچه جستجو در localStorage */
function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (raw) setHistory(JSON.parse(raw))
    } catch {
      /* ignore */
    }
  }, [])

  const save = (list: string[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list))
    } catch {
      /* ignore */
    }
  }

  const add = useCallback((term: string) => {
    setHistory((prev) => {
      const next = [term, ...prev.filter((h) => h !== term)].slice(
        0,
        MAX_HISTORY,
      )
      save(next)
      return next
    })
  }, [])

  const remove = useCallback((term: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h !== term)
      save(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setHistory([])
    save([])
  }, [])

  return { history, add, remove, clear }
}

/* -------------------------------------------------------------------------- */
/*  کامپوننت اصلی                                                              */
/* -------------------------------------------------------------------------- */

type SmartSearchProps = {
  className?: string
}

export default function SmartSearch({ className = '' }: SmartSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get('q')
  const listId = useId()

  // همان منبع داده‌ی صفحه‌ی محصولات؛ پیشنهادها محلی فیلتر می‌شوند
  const { productsPreview, loading } = useProductsPreview()

  const [search, setSearch] = useState(() => urlQuery ?? '')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const {
    history,
    add: addHistory,
    remove: removeHistory,
    clear: clearHistory,
  } = useSearchHistory()

  const term = normalizeSearchText(search)
  const isTyping = term.length > 0

  /* ---- همگام‌سازی ورودی با پارامتر q در URL ---- */
  useEffect(() => {
    if (urlQuery !== null) setSearch(urlQuery)
    else if (pathname === SEARCH_PAGE) setSearch('')
  }, [urlQuery, pathname])

  /* ---- بستن لیست با کلیک بیرون ---- */
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  /* ---- ایندکس جستجو: عنوان‌ها فقط یک‌بار نرمال می‌شوند (نه با هر حرف) ---- */
  const searchIndex = useMemo(
    () =>
      productsPreview.map((product) => ({
        product,
        title: normalizeSearchText(product.title ?? ''),
      })),
    [productsPreview],
  )

  /* ---- محصولات تطبیق‌یافته (فقط وقتی پنل باز است؛ شروع‌شونده‌ها اول) ---- */
  const matches = useMemo(() => {
    if (!open || !isTyping) return []

    // term قبلاً نرمال شده؛ پس دوباره نرمال نمی‌کنیم
    const tokens = term.split(' ')
    const first = tokens[0]
    const found: { product: ProductItem; score: number }[] = []

    for (const { product, title } of searchIndex) {
      if (!tokens.every((token) => title.includes(token))) continue

      const score = title.startsWith(first)
        ? 0
        : title.includes(` ${first}`)
          ? 1
          : 2

      found.push({ product, score })
    }

    // sort در V8 پایدار است؛ پس ترتیب اصلی محصولات در هر امتیاز حفظ می‌شود
    return found.sort((a, b) => a.score - b.score).map((f) => f.product)
  }, [searchIndex, term, open, isTyping])

  /* ---- لیست آیتم‌های قابل انتخاب ---- */
  const items: Item[] = useMemo(() => {
    if (!isTyping) {
      return [
        ...history.map((text): Item => ({ kind: 'history', text })),
        ...POPULAR_SEARCHES.filter((p) => !history.includes(p)).map(
          (text): Item => ({ kind: 'popular', text }),
        ),
      ]
    }

    return matches
      .slice(0, MAX_PRODUCTS)
      .map((product): Item => ({ kind: 'product', product }))
  }, [isTyping, history, matches])

  // انتخاب کیبورد فقط وقتی عبارت یا باز/بسته بودن پنل عوض شود ریست می‌شود
  useEffect(() => setActiveIndex(-1), [term, open])

  /* ---- اکشن‌ها ---- */
  const goSearch = useCallback(
    (raw: string) => {
      const q = raw.trim().replace(/\s+/g, ' ')
      setOpen(false)
      inputRef.current?.blur()

      if (!q) {
        router.push(SEARCH_PAGE)
        return
      }

      addHistory(q)
      setSearch(q)
      router.push(`${SEARCH_PAGE}?q=${encodeURIComponent(q)}`)
    },
    [addHistory, router],
  )

  const goProduct = useCallback(
    (product: ProductItem) => {
      addHistory(term)
      setOpen(false)
      inputRef.current?.blur()
      router.push(getProductHref(product))
    },
    [addHistory, router, term],
  )

  const selectItem = (item: Item) => {
    if (item.kind === 'product') goProduct(item.product)
    else goSearch(item.text)
  }

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // اگر آیتمی با کیبورد انتخاب شده، همان را باز کن
    if (activeIndex >= 0 && items[activeIndex]) {
      selectItem(items[activeIndex])
      return
    }
    goSearch(search)
  }

  const clearSearch = () => {
    setSearch('')
    inputRef.current?.focus()
    setOpen(true)
    if (pathname === SEARCH_PAGE && urlQuery) router.push(SEARCH_PAGE)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!items.length) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActiveIndex((i) => (i + 1) % items.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? items.length - 1 : i - 1))
    }
  }

  // موقع تایپ، پنل همیشه باز است (دکمه «مشاهده همه نتایج» همیشه در دسترس است)
  const showPanel = open && (items.length > 0 || isTyping)
  const showEmpty = open && isTyping && !loading && matches.length === 0

  /* ---- رندر یک ردیف ---- */
  const renderRow = (item: Item, index: number) => {
    const active = index === activeIndex
    const base =
      'font-ray flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-right text-[13px] font-bold text-gray-700 transition'
    const state = active ? 'bg-[#f0f2f5]' : 'hover:bg-[#f7f8fa]'
    const common = {
      id: `${listId}-opt-${index}`,
      role: 'option' as const,
      'aria-selected': active,
      onMouseEnter: () => setActiveIndex(index),
    }

    if (item.kind === 'product') {
      const p = item.product
      const image = getProductImage(p)

      return (
        <li key={`p-${p.id}`} {...common}>
          <Link
            href={getProductHref(p)}
            onClick={() => {
              addHistory(term)
              setOpen(false)
            }}
            className={`${base} ${state}`}
          >
            {image ? (
              <Image
                src={image}
                alt=""
                width={40}
                height={40}
                sizes="40px"
                unoptimized={UNOPTIMIZED_IMAGES}
                className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 object-cover"
              />
            ) : (
              <span className="h-10 w-10 shrink-0 rounded-lg bg-gray-100" />
            )}
            <span className="min-w-0 flex-1">
              <span className="block truncate">
                <Highlight text={p.title ?? ''} term={term} />
              </span>
              {typeof p.price === 'number' && (
                <span className="mt-0.5 block text-[11px] font-bold text-gray-400">
                  {formatPrice(p.price)}
                </span>
              )}
            </span>
          </Link>
        </li>
      )
    }

    const isHistory = item.kind === 'history'
    return (
      <li key={`${item.kind}-${item.text}`} {...common}>
        <div className={`${base} ${state} justify-between`}>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => goSearch(item.text)}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-right"
          >
            <span className="text-gray-300" aria-hidden="true">
              {isHistory ? <ClockIcon /> : <SearchIcon size={15} />}
            </span>
            <span className="truncate">{item.text}</span>
          </button>
          {isHistory && (
            <button
              type="button"
              tabIndex={-1}
              aria-label={`حذف «${item.text}» از تاریخچه`}
              onClick={() => removeHistory(item.text)}
              className="cursor-pointer p-1 text-gray-300 hover:text-black"
            >
              <Image
                src="/images/close-line.svg"
                alt=""
                width={12}
                height={12}
              />
            </button>
          )}
        </div>
      </li>
    )
  }

  /* ---- عنوان بخش‌ها (فقط قبل از اولین آیتم هر نوع) ---- */
  const sectionTitle = (index: number) => {
    const item = items[index]
    if (items.findIndex((i) => i.kind === item.kind) !== index) return null

    const titles: Record<Item['kind'], string> = {
      history: 'جستجوهای اخیر',
      popular: 'پرطرفدارها',
      product: 'محصولات',
    }

    return (
      <li
        key={`title-${item.kind}`}
        role="presentation"
        className="font-ray flex items-center justify-between px-3 pt-2 pb-1 text-[11px] font-extrabold text-gray-400"
      >
        {titles[item.kind]}
        {item.kind === 'history' && (
          <button
            type="button"
            tabIndex={-1}
            onClick={clearHistory}
            className="cursor-pointer text-[11px] font-bold text-blue-500 hover:text-blue-600"
          >
            پاک کردن همه
          </button>
        )}
      </li>
    )
  }

  return (
    <form
      onSubmit={handleSearch}
      role="search"
      className={`max-w-xl flex-1 items-center ${className}`}
    >
      <div ref={wrapperRef} className="relative w-full">
        <input
          ref={inputRef}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-label="جستجو"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined
          }
          autoComplete="off"
          enterKeyHint="search"
          className="font-ray h-11 w-full rounded-full border border-transparent bg-[#f0f2f5] pr-5 pl-20 text-[13px] font-bold text-gray-800 transition outline-none focus:border-gray-200 focus:bg-white"
        />

        {/* placeholder سفارشی؛ فقط وقتی input خالی است نمایش داده می‌شود */}
        {!search && (
          <span className="font-ray pointer-events-none absolute top-1/2 right-5 -translate-y-1/2 text-[13px] font-bold text-gray-400">
            جست و جو در{' '}
            <span className="font-ray font-extrabold text-blue-500">
              دیجی سلامت
            </span>
          </span>
        )}

        {/* دکمه پاک کردن ورودی */}
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="پاک کردن جستجو"
            className="absolute top-1/2 left-10 -translate-y-1/2 cursor-pointer p-1 text-gray-400 hover:text-black"
          >
            <Image src="/images/close-line.svg" alt="" width={14} height={14} />
          </button>
        )}

        {/* آیکون ذره‌بین */}
        <button
          type="submit"
          aria-label="جستجو"
          className="absolute top-1/2 left-3.5 flex -translate-y-1/2 items-center justify-center text-gray-400 transition hover:text-gray-700"
        >
          <SearchIcon size={19} />
        </button>

        {/* پنل پیشنهادها */}
        {showPanel && (
          <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
            <ul id={listId} role="listbox" aria-label="پیشنهادهای جستجو">
              {items.map((item, i) => (
                <Row key={i} title={sectionTitle(i)}>
                  {renderRow(item, i)}
                </Row>
              ))}
            </ul>

            {showEmpty && (
              <p className="font-ray px-3 py-4 text-center text-[12px] font-bold text-gray-400">
                محصولی با «{term}» پیدا نشد. عبارت کوتاه‌تری امتحان کن.
              </p>
            )}

            {isTyping && matches.length > 0 && (
              <button
                type="button"
                onClick={() => goSearch(search)}
                className="font-ray mt-1 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-t border-gray-100 px-3 py-3 text-[12px] font-extrabold text-blue-500 transition hover:bg-[#f7f8fa]"
              >
                مشاهده همه {matches.length.toLocaleString('fa-IR')} نتیجه برای «
                {term}»
              </button>
            )}
          </div>
        )}
      </div>
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/*  اجزای کوچک                                                                 */
/* -------------------------------------------------------------------------- */

function Row({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <>
      {title}
      {children}
    </>
  )
}

function SearchIcon({ size = 19 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}
