import { createDomainError, ErrorCode } from './errors.ts'
import { City, DomainScores, Province } from '@/components/types/types.tsx'

export default function generateSlug(name: string) {
  return name
    .trim()
    .replace(/\s+/g, '-') // spaces → dash
    .replace(/[^\p{L}\p{N}-]+/gu, '') // remove symbols
}

export async function validateAuthenticationIdentifier(identifier: string) {
  if (!identifier) throw createDomainError(ErrorCode.MISSING_IDENTIFIER)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(identifier)) {
    const email = identifier.trim().toLowerCase()
    return { type: 'email', value: email }
  }

  // Otherwise treat as phone
  let phone = identifier.replace(/\D/g, '') // remove non-digits

  // Normalize Iranian phones
  if (phone.startsWith('98') && phone.length === 12) {
    phone = '0' + phone.slice(2) // e.g. 989991014300 → 09991014300
  } else if (phone.length === 10 && phone.startsWith('9')) {
    phone = '0' + phone // e.g. 9991014300 → 09991014300
  }

  // Final validation
  if (!/^09\d{9}$/.test(phone)) {
    throw createDomainError(ErrorCode.INVALID_PHONE_NUMBER)
  }

  return { type: 'phone', value: phone }
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Check Free Shipping Threshold
export const getFreeShippingStatus = (subtotal: number, threshold: number) => {
  const isFreeShipping = subtotal >= threshold

  return isFreeShipping
}

// Status mapping for Persian display
export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'در حال پرداخت'
    case 'PREPARING':
      return 'در حال آماده‌سازی'
    case 'PAID':
      return 'پرداخت شده'
    case 'FAILED':
      return 'ناموفق'
    case 'CANCELED':
      return 'لغو شده'
    case 'REFUNDED':
      return 'مرجوع شده'
    case 'DELIVERING':
      return 'در حال ارسال'
    case 'DELIVERED':
      return 'تحویل داده شد'
    default:
      return status
  }
}

// Status color mapping with all available badge colors
export const getStatusColor = (
  status: string,
): 'primary' | 'success' | 'error' | 'warning' | 'info' | 'light' | 'dark' => {
  switch (status) {
    case 'PAID':
      return 'success'
    case 'DELIVERED':
      return 'primary'
    case 'PENDING':
      return 'warning'
    case 'PREPARING':
      return 'warning'
    case 'DELIVERING':
      return 'info'
    case 'FAILED':
      return 'dark'
    case 'CANCELED':
      return 'error'
    case 'REFUNDED':
      return 'light'
    default:
      return 'warning'
  }
}

// Convert English numbers to Persian digits
export const toPersianDigit = (value: string | number): string => {
  // Convert number to string if needed
  const str = value.toString()

  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return str.replace(/\d/g, (d) => persianDigits[parseInt(d)])
}

// Helper function to check if string contains only Persian characters
const isPersianText = (text: string): boolean => {
  // Persian Unicode range: \u0600-\u06FF, Arabic: \u0750-\u077F, plus Persian specific characters
  const persianRegex = /^[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s]+$/
  return persianRegex.test(text)
}

// City and Provinces Data
export const provinces: Province[] = [
  {
    id: 1,
    name: 'آذربایجان شرقی',
    cities: [
      { id: 1, name: 'تبریز' },
      { id: 2, name: 'مراغه' },
      { id: 3, name: 'مرند' },
      { id: 4, name: 'میانه' },
      { id: 5, name: 'اهر' },
      { id: 6, name: 'بناب' },
      { id: 7, name: 'سراب' },
      { id: 8, name: 'هشترود' },
      { id: 9, name: 'عجبشیر' },
      { id: 10, name: 'ملکان' },
      { id: 11, name: 'بستان‌آباد' },
      { id: 12, name: 'ورزقان' },
      { id: 13, name: 'چاراویماق' },
      { id: 14, name: 'خداآفرین' },
      { id: 15, name: 'جلفا' },
      { id: 16, name: 'کلیبر' },
    ],
  },
  {
    id: 2,
    name: 'آذربایجان غربی',
    cities: [
      { id: 1, name: 'ارومیه' },
      { id: 2, name: 'خوی' },
      { id: 3, name: 'بوکان' },
      { id: 4, name: 'مهاباد' },
      { id: 5, name: 'میاندوآب' },
      { id: 6, name: 'سلماس' },
      { id: 7, name: 'نقده' },
      { id: 8, name: 'پیرانشهر' },
      { id: 9, name: 'سردشت' },
      { id: 10, name: 'شاهین‌دژ' },
      { id: 11, name: 'تکاب' },
      { id: 12, name: 'ماکو' },
      { id: 13, name: 'چالدران' },
      { id: 14, name: 'اشنویه' },
      { id: 15, name: 'پلدشت' },
    ],
  },
  {
    id: 3,
    name: 'اردبیل',
    cities: [
      { id: 1, name: 'اردبیل' },
      { id: 2, name: 'پارس‌آباد' },
      { id: 3, name: 'مشگین‌شهر' },
      { id: 4, name: 'خلخال' },
      { id: 5, name: 'بیله‌سوار' },
      { id: 6, name: 'گرمی' },
      { id: 7, name: 'نمین' },
      { id: 8, name: 'نیر' },
      { id: 9, name: 'کوثر' },
      { id: 10, name: 'سرعین' },
      { id: 11, name: 'اصلاندوز' },
    ],
  },
  {
    id: 4,
    name: 'اصفهان',
    cities: [
      { id: 1, name: 'اصفهان' },
      { id: 2, name: 'کاشان' },
      { id: 3, name: 'خمینی‌شهر' },
      { id: 4, name: 'نجف‌آباد' },
      { id: 5, name: 'شاهین‌شهر' },
      { id: 6, name: 'مبارکه' },
      { id: 7, name: 'فلاورجان' },
      { id: 8, name: 'لنجان' },
      { id: 9, name: 'زرین‌شهر' },
      { id: 10, name: 'آران و بیدگل' },
      { id: 11, name: 'گلپایگان' },
      { id: 12, name: 'سمیرم' },
      { id: 13, name: 'فریدون‌شهر' },
      { id: 14, name: 'تیران' },
      { id: 15, name: 'چادگان' },
      { id: 16, name: 'دهاقان' },
      { id: 17, name: 'نائین' },
      { id: 18, name: 'نطنز' },
      { id: 19, name: 'خور و بیابانک' },
      { id: 20, name: 'برخوار' },
    ],
  },
  {
    id: 5,
    name: 'البرز',
    cities: [
      { id: 1, name: 'کرج' },
      { id: 2, name: 'نظرآباد' },
      { id: 3, name: 'اشتهارد' },
      { id: 4, name: 'طالقان' },
      { id: 5, name: 'فردیس' },
      { id: 6, name: 'ساوجبلاغ' },
      { id: 7, name: 'هشتگرد' },
    ],
  },
  {
    id: 6,
    name: 'ایلام',
    cities: [
      { id: 1, name: 'ایلام' },
      { id: 2, name: 'دهلران' },
      { id: 3, name: 'ایوان' },
      { id: 4, name: 'مهران' },
      { id: 5, name: 'دره‌شهر' },
      { id: 6, name: 'آبدانان' },
      { id: 7, name: 'چرداول' },
      { id: 8, name: 'بدره' },
      { id: 9, name: 'ملکشاهی' },
      { id: 10, name: 'سیروان' },
    ],
  },
  {
    id: 7,
    name: 'بوشهر',
    cities: [
      { id: 1, name: 'بوشهر' },
      { id: 2, name: 'برازجان' },
      { id: 3, name: 'کنگان' },
      { id: 4, name: 'عسلویه' },
      { id: 5, name: 'گناوه' },
      { id: 6, name: 'دیر' },
      { id: 7, name: 'جم' },
      { id: 8, name: 'دیلم' },
      { id: 9, name: 'تنگستان' },
      { id: 10, name: 'دشتی' },
      { id: 11, name: 'دشتستان' },
    ],
  },
  {
    id: 8,
    name: 'تهران',
    cities: [
      { id: 1, name: 'تهران' },
      { id: 2, name: 'اسلامشهر' },
      { id: 3, name: 'ری' },
      { id: 4, name: 'قدس' },
      { id: 5, name: 'ملارد' },
      { id: 6, name: 'ورامین' },
      { id: 7, name: 'قرچک' },
      { id: 8, name: 'پاکدشت' },
      { id: 9, name: 'شهریار' },
      { id: 10, name: 'رباط‌کریم' },
      { id: 11, name: 'بهارستان' },
      { id: 12, name: 'پیشوا' },
      { id: 13, name: 'دماوند' },
      { id: 14, name: 'فیروزکوه' },
      { id: 15, name: 'شمیرانات' },
      { id: 16, name: 'لواسان' },
      { id: 17, name: 'اندیشه' },
      { id: 18, name: 'بومهن' },
      { id: 19, name: 'پردیس' },
    ],
  },
  {
    id: 9,
    name: 'چهارمحال و بختیاری',
    cities: [
      { id: 1, name: 'شهرکرد' },
      { id: 2, name: 'بروجن' },
      { id: 3, name: 'فارسان' },
      { id: 4, name: 'لردگان' },
      { id: 5, name: 'اردل' },
      { id: 6, name: 'کیار' },
      { id: 7, name: 'سامان' },
      { id: 8, name: 'بن' },
      { id: 9, name: 'کوهرنگ' },
    ],
  },
  {
    id: 10,
    name: 'خراسان جنوبی',
    cities: [
      { id: 1, name: 'بیرجند' },
      { id: 2, name: 'قائن' },
      { id: 3, name: 'فردوس' },
      { id: 4, name: 'نهبندان' },
      { id: 5, name: 'طبس' },
      { id: 6, name: 'سربیشه' },
      { id: 7, name: 'درمیان' },
      { id: 8, name: 'خوسف' },
      { id: 9, name: 'زیرکوه' },
    ],
  },
  {
    id: 11,
    name: 'خراسان رضوی',
    cities: [
      { id: 1, name: 'مشهد' },
      { id: 2, name: 'نیشابور' },
      { id: 3, name: 'سبزوار' },
      { id: 4, name: 'تربت حیدریه' },
      { id: 5, name: 'تربت جام' },
      { id: 6, name: 'قوچان' },
      { id: 7, name: 'کاشمر' },
      { id: 8, name: 'گناباد' },
      { id: 9, name: 'چناران' },
      { id: 10, name: 'سرخس' },
      { id: 11, name: 'فریمان' },
      { id: 12, name: 'درگز' },
      { id: 13, name: 'خواف' },
      { id: 14, name: 'رشتخوار' },
      { id: 15, name: 'بردسکن' },
      { id: 16, name: 'تایباد' },
      { id: 17, name: 'فیروزه' },
      { id: 18, name: 'جغتای' },
      { id: 19, name: 'باخرز' },
      { id: 20, name: 'زاوه' },
      { id: 21, name: 'مه‌ولات' },
    ],
  },
  {
    id: 12,
    name: 'خراسان شمالی',
    cities: [
      { id: 1, name: 'بجنورد' },
      { id: 2, name: 'شیروان' },
      { id: 3, name: 'اسفراین' },
      { id: 4, name: 'جاجرم' },
      { id: 5, name: 'مانه و سملقان' },
      { id: 6, name: 'راز و جرگلان' },
      { id: 7, name: 'فاروج' },
    ],
  },
  {
    id: 13,
    name: 'خوزستان',
    cities: [
      { id: 1, name: 'اهواز' },
      { id: 2, name: 'دزفول' },
      { id: 3, name: 'آبادان' },
      { id: 4, name: 'خرمشهر' },
      { id: 5, name: 'بهبهان' },
      { id: 6, name: 'اندیمشک' },
      { id: 7, name: 'مسجدسلیمان' },
      { id: 8, name: 'شوشتر' },
      { id: 9, name: 'شوش' },
      { id: 10, name: 'ایذه' },
      { id: 11, name: 'رامهرمز' },
      { id: 12, name: 'باغملک' },
      { id: 13, name: 'هندیجان' },
      { id: 14, name: 'بندر ماهشهر' },
      { id: 15, name: 'امیدیه' },
      { id: 16, name: 'لالی' },
      { id: 17, name: 'گتوند' },
      { id: 18, name: 'هویزه' },
      { id: 19, name: 'کارون' },
      { id: 20, name: 'حمیدیه' },
    ],
  },
  {
    id: 14,
    name: 'زنجان',
    cities: [
      { id: 1, name: 'زنجان' },
      { id: 2, name: 'ابهر' },
      { id: 3, name: 'خرمدره' },
      { id: 4, name: 'قیدار' },
      { id: 5, name: 'طارم' },
      { id: 6, name: 'ماهنشان' },
      { id: 7, name: 'سلطانیه' },
    ],
  },
  {
    id: 15,
    name: 'سمنان',
    cities: [
      { id: 1, name: 'سمنان' },
      { id: 2, name: 'شاهرود' },
      { id: 3, name: 'دامغان' },
      { id: 4, name: 'گرمسار' },
      { id: 5, name: 'مهدی‌شهر' },
      { id: 6, name: 'آرادان' },
      { id: 7, name: 'بسطام' },
      { id: 8, name: 'سرخه' },
      { id: 9, name: 'میامی' },
    ],
  },
  {
    id: 16,
    name: 'سیستان و بلوچستان',
    cities: [
      { id: 1, name: 'زاهدان' },
      { id: 2, name: 'زابل' },
      { id: 3, name: 'چابهار' },
      { id: 4, name: 'ایرانشهر' },
      { id: 5, name: 'خاش' },
      { id: 6, name: 'سراوان' },
      { id: 7, name: 'نیکشهر' },
      { id: 8, name: 'کنارک' },
      { id: 9, name: 'میرجاوه' },
      { id: 10, name: 'سرباز' },
      { id: 11, name: 'دلگان' },
      { id: 12, name: 'زهک' },
      { id: 13, name: 'مهرستان' },
      { id: 14, name: 'بمپور' },
    ],
  },
  {
    id: 17,
    name: 'فارس',
    cities: [
      { id: 1, name: 'شیراز' },
      { id: 2, name: 'مرودشت' },
      { id: 3, name: 'کازرون' },
      { id: 4, name: 'لارستان' },
      { id: 5, name: 'جهرم' },
      { id: 6, name: 'فیروزآباد' },
      { id: 7, name: 'فسا' },
      { id: 8, name: 'داراب' },
      { id: 9, name: 'سپیدان' },
      { id: 10, name: 'ممسنی' },
      { id: 11, name: 'لامرد' },
      { id: 12, name: 'استهبان' },
      { id: 13, name: 'نی ریز' },
      { id: 14, name: 'زرین‌دشت' },
      { id: 15, name: 'خرامه' },
      { id: 16, name: 'بوانات' },
      { id: 17, name: 'خنج' },
      { id: 18, name: 'قیر و کارزین' },
      { id: 19, name: 'فراشبند' },
      { id: 20, name: 'پاسارگاد' },
      { id: 21, name: 'ارسنجان' },
      { id: 22, name: 'رستم' },
    ],
  },
  {
    id: 18,
    name: 'قزوین',
    cities: [
      { id: 1, name: 'قزوین' },
      { id: 2, name: 'الوند' },
      { id: 3, name: 'محمدیه' },
      { id: 4, name: 'بوئین زهرا' },
      { id: 5, name: 'آبیک' },
      { id: 6, name: 'تاکستان' },
      { id: 7, name: 'اوج' },
      { id: 8, name: 'آوج' },
    ],
  },
  {
    id: 19,
    name: 'قم',
    cities: [
      { id: 1, name: 'قم' },
      { id: 2, name: 'جعفریه' },
      { id: 3, name: 'کهک' },
      { id: 4, name: 'سلفچگان' },
    ],
  },
  {
    id: 20,
    name: 'کردستان',
    cities: [
      { id: 1, name: 'سنندج' },
      { id: 2, name: 'سقز' },
      { id: 3, name: 'مریوان' },
      { id: 4, name: 'بانه' },
      { id: 5, name: 'قروه' },
      { id: 6, name: 'بیجار' },
      { id: 7, name: 'کامیاران' },
      { id: 8, name: 'دهگلان' },
      { id: 9, name: 'دیواندره' },
      { id: 10, name: 'سروآباد' },
    ],
  },
  {
    id: 21,
    name: 'کرمان',
    cities: [
      { id: 1, name: 'کرمان' },
      { id: 2, name: 'سیرجان' },
      { id: 3, name: 'رفسنجان' },
      { id: 4, name: 'بم' },
      { id: 5, name: 'جیرفت' },
      { id: 6, name: 'زرند' },
      { id: 7, name: 'کهنوج' },
      { id: 8, name: 'شهر بابک' },
      { id: 9, name: 'بافت' },
      { id: 10, name: 'بردسیر' },
      { id: 11, name: 'راور' },
      { id: 12, name: 'عنبرآباد' },
      { id: 13, name: 'منوجان' },
      { id: 14, name: 'نرماشیر' },
      { id: 15, name: 'رودبار جنوب' },
      { id: 16, name: 'قلعه گنج' },
      { id: 17, name: 'فهرج' },
    ],
  },
  {
    id: 22,
    name: 'کرمانشاه',
    cities: [
      { id: 1, name: 'کرمانشاه' },
      { id: 2, name: 'اسلام‌آباد غرب' },
      { id: 3, name: 'هرسین' },
      { id: 4, name: 'کنگاور' },
      { id: 5, name: 'سنقر' },
      { id: 6, name: 'صحنه' },
      { id: 7, name: 'روانسر' },
      { id: 8, name: 'پاوه' },
      { id: 9, name: 'سرپل ذهاب' },
      { id: 10, name: 'جوانرود' },
      { id: 11, name: 'ثلاث باباجانی' },
      { id: 12, name: 'دالاهو' },
      { id: 13, name: 'گیلانغرب' },
    ],
  },
  {
    id: 23,
    name: 'کهگیلویه و بویراحمد',
    cities: [
      { id: 1, name: 'یاسوج' },
      { id: 2, name: 'دوگنبدان' },
      { id: 3, name: 'دهدشت' },
      { id: 4, name: 'گچساران' },
      { id: 5, name: 'لنده' },
      { id: 6, name: 'سی سخت' },
      { id: 7, name: 'باشت' },
      { id: 8, name: 'چاروسا' },
    ],
  },
  {
    id: 24,
    name: 'گلستان',
    cities: [
      { id: 1, name: 'گرگان' },
      { id: 2, name: 'گنبد کاووس' },
      { id: 3, name: 'علی‌آباد کتول' },
      { id: 4, name: 'بندر ترکمن' },
      { id: 5, name: 'آق‌قلا' },
      { id: 6, name: 'کردکوی' },
      { id: 7, name: 'مینودشت' },
      { id: 8, name: 'کلاه' },
      { id: 9, name: 'گالیکش' },
      { id: 10, name: 'رامیان' },
      { id: 11, name: 'آزادشهر' },
      { id: 12, name: 'بندر گز' },
    ],
  },
  {
    id: 25,
    name: 'گیلان',
    cities: [
      { id: 1, name: 'رشت' },
      { id: 2, name: 'بندر انزلی' },
      { id: 3, name: 'لاهیجان' },
      { id: 4, name: 'آستارا' },
      { id: 5, name: 'تالش' },
      { id: 6, name: 'رودسر' },
      { id: 7, name: 'صومعه سرا' },
      { id: 8, name: 'فومن' },
      { id: 9, name: 'آستانه اشرفیه' },
      { id: 10, name: 'رضوانشهر' },
      { id: 11, name: 'ماسال' },
      { id: 12, name: 'شفت' },
      { id: 13, name: 'سیاهکل' },
      { id: 14, name: 'املش' },
    ],
  },
  {
    id: 26,
    name: 'لرستان',
    cities: [
      { id: 1, name: 'خرم‌آباد' },
      { id: 2, name: 'بروجرد' },
      { id: 3, name: 'دورود' },
      { id: 4, name: 'الیگودرز' },
      { id: 5, name: 'کوهدشت' },
      { id: 6, name: 'نورآباد' },
      { id: 7, name: 'پلدختر' },
      { id: 8, name: 'ازنا' },
      { id: 9, name: 'دلفان' },
      { id: 10, name: 'رومشکان' },
      { id: 11, name: 'چگنی' },
    ],
  },
  {
    id: 27,
    name: 'مازندران',
    cities: [
      { id: 1, name: 'ساری' },
      { id: 2, name: 'بابل' },
      { id: 3, name: 'آمل' },
      { id: 4, name: 'قائم‌شهر' },
      { id: 5, name: 'بهشهر' },
      { id: 6, name: 'نور' },
      { id: 7, name: 'نوشهر' },
      { id: 8, name: 'چالوس' },
      { id: 9, name: 'تنکابن' },
      { id: 10, name: 'رامسر' },
      { id: 11, name: 'جویبار' },
      { id: 12, name: 'بابلسر' },
      { id: 13, name: 'فریدونکنار' },
      { id: 14, name: 'محمودآباد' },
      { id: 15, name: 'نکا' },
      { id: 16, name: 'گلوگاه' },
      { id: 17, name: 'سوادکوه' },
      { id: 18, name: 'سوادکوه شمالی' },
      { id: 19, name: 'میاندرود' },
      { id: 20, name: 'عباس‌آباد' },
    ],
  },
  {
    id: 28,
    name: 'مرکزی',
    cities: [
      { id: 1, name: 'اراک' },
      { id: 2, name: 'ساوه' },
      { id: 3, name: 'خمین' },
      { id: 4, name: 'محلات' },
      { id: 5, name: 'دلیجان' },
      { id: 6, name: 'تفرش' },
      { id: 7, name: 'فراهان' },
      { id: 8, name: 'زرندیه' },
      { id: 9, name: 'شازند' },
      { id: 10, name: 'آشتیان' },
    ],
  },
  {
    id: 29,
    name: 'هرمزگان',
    cities: [
      { id: 1, name: 'بندرعباس' },
      { id: 2, name: 'قشم' },
      { id: 3, name: 'کیش' },
      { id: 4, name: 'بندر لنگه' },
      { id: 5, name: 'میناب' },
      { id: 6, name: 'حاجی‌آباد' },
      { id: 7, name: 'جاسک' },
      { id: 8, name: 'رودان' },
      { id: 9, name: 'بستک' },
      { id: 10, name: 'پارسیان' },
      { id: 11, name: 'خمیر' },
      { id: 12, name: 'سیریک' },
      { id: 13, name: 'بشاگرد' },
    ],
  },
  {
    id: 30,
    name: 'همدان',
    cities: [
      { id: 1, name: 'همدان' },
      { id: 2, name: 'ملایر' },
      { id: 3, name: 'نهاوند' },
      { id: 4, name: 'تویرکان' },
      { id: 5, name: 'کبودرآهنگ' },
      { id: 6, name: 'رزن' },
      { id: 7, name: 'اسدآباد' },
      { id: 8, name: 'فامنین' },
      { id: 9, name: 'درگوزین' },
    ],
  },
  {
    id: 31,
    name: 'یزد',
    cities: [
      { id: 1, name: 'یزد' },
      { id: 2, name: 'میبد' },
      { id: 3, name: 'اردکان' },
      { id: 4, name: 'بافق' },
      { id: 5, name: 'مهریز' },
      { id: 6, name: 'ابرکوه' },
      { id: 7, name: 'تفت' },
      { id: 8, name: 'خاتم' },
      { id: 9, name: 'اشکذر' },
      { id: 10, name: 'بهاباد' },
      { id: 11, name: 'مروست' },
    ],
  },
]

// Helper function to get cities by province name
export const getCitiesByProvince = (provinceName: string): City[] => {
  const province = provinces.find((p) => p.name === provinceName)
  return province?.cities || []
}

// Helper function to get province by city name
export const getProvinceByCity = (cityName: string): Province | undefined => {
  return provinces.find((province) =>
    province.cities.some((city) => city.name === cityName),
  )
}

// types/validation.ts or add to your existing types file
export type ValidationError = {
  field: string
  message: string
  code?: string
}

export type ValidationResult = {
  isValid: boolean
  errors: ValidationError[]
}

export type FieldValidators = {
  [key: string]: (
    value: any,
  ) => Promise<ValidationError | null> | ValidationError | null
}

// ============ Individual Field Validators ============

export const validateFirstName = (
  firstName: string,
): ValidationError | null => {
  if (!firstName || firstName.trim().length === 0) {
    return {
      field: 'firstName',
      message: 'نام الزامی است',
      code: ErrorCode.MISSING_FIELD.code,
    }
  }

  const trimmedName = firstName.trim()

  if (trimmedName.length < 2) {
    return {
      field: 'firstName',
      message: 'نام باید حداقل ۲ کاراکتر باشد',
      code: ErrorCode.INVALID_NAME.code,
    }
  }

  if (trimmedName.length > 50) {
    return {
      field: 'firstName',
      message: 'نام باید حداکثر ۵۰ کاراکتر باشد',
      code: ErrorCode.INVALID_NAME.code,
    }
  }

  // Check for Persian characters
  if (!isPersianText(trimmedName)) {
    return {
      field: 'firstName',
      message: 'نام باید با حروف فارسی وارد شود',
      code: ErrorCode.INVALID_NAME.code,
    }
  }

  return null
}

export const validateLastName = (lastName: string): ValidationError | null => {
  if (!lastName || lastName.trim().length === 0) {
    return {
      field: 'lastName',
      message: 'نام خانوادگی الزامی است',
      code: ErrorCode.MISSING_FIELD.code,
    }
  }

  const trimmedName = lastName.trim()

  if (trimmedName.length < 2) {
    return {
      field: 'lastName',
      message: 'نام خانوادگی باید حداقل ۲ کاراکتر باشد',
      code: ErrorCode.INVALID_NAME.code,
    }
  }

  if (trimmedName.length > 50) {
    return {
      field: 'lastName',
      message: 'نام خانوادگی باید حداکثر ۵۰ کاراکتر باشد',
      code: ErrorCode.INVALID_NAME.code,
    }
  }

  // Check for Persian characters
  if (!isPersianText(trimmedName)) {
    return {
      field: 'lastName',
      message: 'نام خانوادگی باید با حروف فارسی وارد شود',
      code: ErrorCode.INVALID_NAME.code,
    }
  }

  return null
}

export const validateEmail = (email: string): ValidationError | null => {
  if (!email || email.trim().length === 0) {
    return {
      field: 'email',
      message: 'ایمیل الزامی است',
      code: ErrorCode.MISSING_FIELD.code,
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      field: 'email',
      message: 'ایمیل معتبر نیست',
      code: ErrorCode.INVALID_EMAIL.code,
    }
  }

  if (email.length > 255) {
    return {
      field: 'email',
      message: 'ایمیل باید حداکثر ۲۵۵ کاراکتر باشد',
      code: ErrorCode.INVALID_EMAIL.code,
    }
  }

  return null
}

export const validatePhone = (phone: string): ValidationError | null => {
  if (!phone || phone.trim().length === 0) {
    return {
      field: 'phone',
      message: 'شماره تماس الزامی است',
      code: ErrorCode.MISSING_FIELD.code,
    }
  }

  // Normalize phone
  let normalizedPhone = phone.replace(/\D/g, '')

  if (normalizedPhone.startsWith('98') && normalizedPhone.length === 12) {
    normalizedPhone = '0' + normalizedPhone.slice(2)
  } else if (normalizedPhone.length === 10 && normalizedPhone.startsWith('9')) {
    normalizedPhone = '0' + normalizedPhone
  }

  if (!/^09\d{9}$/.test(normalizedPhone)) {
    return {
      field: 'phone',
      message: 'شماره تماس معتبر نیست (مثال: 09123456789)',
      code: ErrorCode.INVALID_PHONE_NUMBER.code,
    }
  }

  return null
}

export const validateProvince = (
  province: string,
  provincesList: any[],
): ValidationError | null => {
  if (!province || province.trim().length === 0) {
    return {
      field: 'province',
      message: 'لطفاً استان را انتخاب کنید',
      code: ErrorCode.MISSING_FIELD.code,
    }
  }

  const isValidProvince = provincesList.some((p) => p.name === province)
  if (!isValidProvince) {
    return {
      field: 'province',
      message: 'استان انتخاب شده معتبر نیست',
      code: ErrorCode.INVALID_PROVINCE.code,
    }
  }

  return null
}

export const validateCity = (
  city: string,
  province: string,
  getCitiesByProvince: (province: string) => any[],
): ValidationError | null => {
  if (!city || city.trim().length === 0) {
    return {
      field: 'city',
      message: 'لطفاً شهر را انتخاب کنید',
      code: ErrorCode.MISSING_FIELD.code,
    }
  }

  // If province is selected, validate city belongs to province
  if (province) {
    const cities = getCitiesByProvince(province)
    const isValidCity = cities.some((c) => c.name === city)
    if (cities.length > 0 && !isValidCity) {
      return {
        field: 'city',
        message: 'شهر انتخاب شده برای این استان معتبر نیست',
        code: ErrorCode.INVALID_CITY.code,
      }
    }
  }

  return null
}

export const validateAddress = (address: string): ValidationError | null => {
  if (!address || address.trim().length === 0) {
    return {
      field: 'address',
      message: 'آدرس الزامی است',
      code: ErrorCode.MISSING_FIELD.code,
    }
  }

  if (address.trim().length < 10) {
    return {
      field: 'address',
      message: 'آدرس باید حداقل ۱۰ کاراکتر باشد',
      code: ErrorCode.INVALID_ADDRESS.code,
    }
  }

  if (address.trim().length > 500) {
    return {
      field: 'address',
      message: 'آدرس باید حداکثر ۵۰۰ کاراکتر باشد',
      code: ErrorCode.INVALID_ADDRESS.code,
    }
  }

  return null
}

export const validatePostalCode = (
  postalCode: string,
): ValidationError | null => {
  if (!postalCode || postalCode.trim().length === 0) {
    return {
      field: 'postalCode',
      message: 'کد پستی الزامی است',
      code: ErrorCode.MISSING_FIELD.code,
    }
  }

  // Iranian postal code format: 10 digits, not starting with 0
  const postalCodeRegex = /^(?!0)\d{10}$/
  if (!postalCodeRegex.test(postalCode.trim())) {
    return {
      field: 'postalCode',
      message: 'کد پستی معتبر نیست (۱۰ رقم)',
      code: ErrorCode.INVALID_POSTAL_CODE.code,
    }
  }

  return null
}

// ============ Combined Validators ============

export const validateShippingInfo = async (
  shippingInfo: any,
  provincesList: any[],
  getCitiesByProvince: (province: string) => any[],
): Promise<ValidationResult> => {
  const errors: ValidationError[] = []

  // Validate each field
  const firstNameError = validateFirstName(shippingInfo.firstName)
  if (firstNameError) errors.push(firstNameError)

  const lastNameError = validateLastName(shippingInfo.lastName)
  if (lastNameError) errors.push(lastNameError)

  const emailError = validateEmail(shippingInfo.email)
  if (emailError) errors.push(emailError)

  const phoneError = validatePhone(shippingInfo.phone)
  if (phoneError) errors.push(phoneError)

  const provinceError = validateProvince(shippingInfo.province, provincesList)
  if (provinceError) errors.push(provinceError)

  const cityError = validateCity(
    shippingInfo.city,
    shippingInfo.province,
    getCitiesByProvince,
  )
  if (cityError) errors.push(cityError)

  const addressError = validateAddress(shippingInfo.address)
  if (addressError) errors.push(addressError)

  const postalCodeError = validatePostalCode(shippingInfo.postalCode)
  if (postalCodeError) errors.push(postalCodeError)

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ============ Real-time Validation Hook ============

export const getFieldError = (
  field: string,
  value: any,
  provincesList?: any[],
  getCitiesByProvince?: (province: string) => any[],
): string | null => {
  let error: ValidationError | null = null

  switch (field) {
    case 'firstName':
      error = validateFirstName(value)
      break
    case 'lastName':
      error = validateLastName(value)
      break
    case 'email':
      error = validateEmail(value)
      break
    case 'phone':
      error = validatePhone(value)
      break
    case 'province':
      error = validateProvince(value, provincesList || [])
      break
    case 'city':
      error = validateCity(value, '', getCitiesByProvince || (() => []))
      break
    case 'address':
      error = validateAddress(value)
      break
    case 'postalCode':
      error = validatePostalCode(value)
      break
    default:
      return null
  }

  return error?.message || null
}

// ============ Formatted Error Messages ============

export const getValidationErrorsObject = (
  errors: ValidationError[],
): Record<string, string> => {
  const errorObject: Record<string, string> = {}
  errors.forEach((error) => {
    errorObject[error.field] = error.message
  })
  return errorObject
}

// ============ Optional: Helper to validate identifier (email/phone) ============

export async function validateIdentifierField(identifier: string) {
  if (!identifier) {
    return { isValid: false, error: 'ایمیل یا شماره تماس الزامی است' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (emailRegex.test(identifier)) {
    if (identifier.length > 255) {
      return { isValid: false, error: 'ایمیل باید حداکثر ۲۵۵ کاراکتر باشد' }
    }
    return {
      isValid: true,
      type: 'email',
      value: identifier.trim().toLowerCase(),
    }
  }

  // Validate phone
  let phone = identifier.replace(/\D/g, '')

  if (phone.startsWith('98') && phone.length === 12) {
    phone = '0' + phone.slice(2)
  } else if (phone.length === 10 && phone.startsWith('9')) {
    phone = '0' + phone
  }

  if (!/^09\d{9}$/.test(phone)) {
    return {
      isValid: false,
      error: 'شماره تماس معتبر نیست (مثال: 09123456789)',
    }
  }

  return { isValid: true, type: 'phone', value: phone }
}

// ============ Fix and Validate Images ============
export const getValidImageUrl = (url: string | null | undefined): string => {
  if (!url || url.trim() === '') {
    return '/images/placeholder.png' // Default placeholder
  }

  // If URL doesn't start with /, http://, or https://, add leading slash
  if (
    !url.startsWith('/') &&
    !url.startsWith('http://') &&
    !url.startsWith('https://')
  ) {
    return `/${url}`
  }

  // Fix common issues: replace spaces with %20
  return url.replace(/ /g, '%20')
}

// ============ AI Test Scoring ============

// Answer scoring mapping (0-100)
// Keys match the Persian answer strings used in the questionnaire.
const scoreMap: Record<string, Record<string, number>> = {
  // ── Goals (G1–G3) — not scored numerically; used for segmentation only ──

  // ── Energy (E1–E3) ────────────────────────────────────────────────────────
  E1: {
    'ثابت و بالا': 100,
    'صبح خوب، عصر افت شدید': 50,
    'صبح خسته، عصر بهتر': 40,
    'کل روز خسته': 20,
  },
  E2: {
    'همچنان پرانرژی هستم': 100,
    'کمی خستگی دارم اما قابل تحمل است': 65,
    'افت شدید انرژی دارم، خوابم می‌آید': 35,
    'اصلاً نمی‌توانم تمرکز کنم': 15,
  },
  E3: {
    'فوری بیدار و شارژ هستم': 100,
    'بعد از ۱۵–۳۰ دقیقه جا می‌افتم': 65,
    'به ساعت‌ها قهوه و زمان نیاز دارم': 35,
    'هرگز کاملاً آماده احساس نمی‌کنم': 15,
  },

  // ── Sleep (SL1–SL4) ───────────────────────────────────────────────────────
  SL1: {
    'کمتر از ۵ ساعت': 20,
    '۵ تا ۶ ساعت': 40,
    '۶ تا ۷ ساعت': 60,
    '۷ تا ۸ ساعت': 85,
    'بیشتر از ۸ ساعت': 100,
  },
  SL2: {
    'سرحال و آماده برای شروع روز': 100,
    'بعد از چند دقیقه خوب می‌شوم': 70,
    'احساس سنگینی می‌کنم، انگار اصلاً نخوابیده‌ام': 30,
    'از همان اول به چرت زدن فکر می‌کنم': 10,
  },
  SL3: {
    'نه، خوابم پیوسته است': 100,
    'بله، یک بار (و راحت دوباره می‌خوابم)': 70,
    'بله، چندین بار': 40,
    'بله، و دوباره خوابیدن برایم سخت است': 20,
  },
  SL4: {
    'بله، هر شب': 100,
    'بعضی وقت‌ها': 60,
    'به ندرت': 30,
    'نه، فقط خسته می‌شوم و می‌خوابم': 10,
  },

  // ── Nutrition (N1–N5) ─────────────────────────────────────────────────────
  N1: {
    'در هر وعده غذایی': 100,
    'روزی دو بار': 80,
    'روزی یک بار': 60,
    'چند بار در هفته': 40,
    'به ندرت': 20,
  },
  N2: {
    روزانه: 100,
    'چند بار در هفته': 70,
    'هفته‌ای یک بار': 40,
    'به ندرت': 20,
  },
  N3: {
    '۵ وعده یا بیشتر': 100,
    '۳ تا ۴ وعده': 75,
    '۱ تا ۲ وعده': 45,
    'به ندرت': 20,
  },
  N4: {
    '۸ لیوان یا بیشتر': 100,
    '۶ تا ۷ لیوان': 75,
    '۴ تا ۵ لیوان': 50,
    'کمتر از ۴ لیوان': 25,
  },
  N5: {
    'بسیار راحت و منظم': 100,
    'گاهی نفخ یا گاز معده دارم': 60,
    'ناراحتی یا بی‌نظمی مکرر': 30,
    'مشکلات مزمن (IBS، یبوست یا اسهال)': 10,
  },

  // ── Physical Activity (P1–P4) ─────────────────────────────────────────────
  P1: {
    '۵ روز یا بیشتر': 100,
    '۳ تا ۴ روز': 75,
    '۱ تا ۲ روز': 50,
    'به ندرت یا هرگز': 25,
  },
  P2: {
    پیاده‌روی: 40,
    'ورزش هوازی (دویدن، دوچرخه‌سواری، شنا)': 80,
    'تمرینات قدرتی': 80,
    'یوگا / حرکات کششی': 60,
    'هیچ‌کدام به‌صورت منظم': 10,
  },
  P3: {
    'بسیار فعال (کار فیزیکی یا پیاده‌روی زیاد)': 100,
    'نسبتاً فعال': 60,
    'کم‌تحرک (کار پشت‌میزی و بیشتر نشسته)': 20,
  },
  P4: {
    پرانرژی: 100,
    'معمولی / بدون تغییر': 60,
    'خسته اما حس خوبی دارم': 70,
    'کاملاً خسته و بی‌حال': 30,
  },

  // ── Stress & Mental Health (M1–M5) ───────────────────────────────────────
  M1: {
    'به ندرت': 100,
    گاهی: 70,
    اغلب: 40,
    'تقریباً هر روز': 20,
  },
  // M2 (physical stress symptoms) — descriptive, not scored
  M3: {
    'معمولاً مثبت و پایدار': 100,
    'گاهی بی‌حوصلگی یا تحریک‌پذیری': 65,
    'نوسانات روحی زیاد': 35,
    'بیشتر اوقات بی‌انگیزه یا ناراحت': 15,
  },
  M4: {
    'بله، روزانه': 100,
    'بعضی وقت‌ها': 60,
    'به ندرت': 30,
    نه: 10,
  },
  M5: {
    روزانه: 100,
    'چند بار در هفته': 75,
    هفتگی: 50,
    'به ندرت': 25,
  },

  // ── Beauty (B1–B4) ────────────────────────────────────────────────────────
  B1: {
    'شفاف و آرام': 100,
    'جوش‌های گاه‌به‌گاه': 70,
    'آکنه یا جوش‌های مکرر': 40,
    'خشک، پوسته‌پوسته یا دارای علائم پیری زودرس': 30,
    'قرمزی یا روزاسه': 35,
  },
  // B2 (skin stress reaction) — descriptive, not scored
  // B3 (hair & nails) — descriptive, not scored
  B4: {
    'هر روز، چند مرحله‌ای': 100,
    'هر روز، ساده (شستشو + مرطوب‌کننده)': 75,
    'بعضی وقت‌ها': 40,
    'هیچ روتینی ندارم': 15,
  },

  // ── Medical (C3, C5) ──────────────────────────────────────────────────────
  // C1 (chronic conditions) — descriptive / risk flag, not scored
  // C2 (family history) — descriptive / risk flag, not scored
  C3: {
    'بله، یک دارو': 40,
    'بله، دو دارو یا بیشتر': 20,
    خیر: 100,
  },
  // C4 (allergies) — descriptive / safety flag, not scored
  C5: {
    'در یک سال گذشته': 100,
    '۱ تا ۲ سال پیش': 70,
    'بیشتر از ۲ سال پیش': 40,
    'یادم نیست / هرگز': 20,
  },

  // ── Behavioral Intelligence (BI1–BI5) ────────────────────────────────────
  // These feed readinessToChange, identityType, perceptionGap, confidence;
  // they also contribute to a behavioralScore.
  BI1: {
    'همین امروز شروع می‌کنم': 100,
    'احتمالاً شروع می‌کنم': 70,
    'مطمئن نیستم': 40,
    'فعلاً آماده نیستم': 15,
  },
  BI2: {
    'من فردی هستم که همیشه از سلامت خود مراقبت می‌کنم': 100,
    'معمولاً تلاش می‌کنم اما پایدار نیستم': 60,
    'هر از گاهی به سلامت خود توجه می‌کنم': 35,
    'سلامت در اولویت من نیست': 15,
  },
  BI3: {
    'بهتر از امروز': 100,
    'تقریباً مشابه': 60,
    'کمی بدتر': 35,
    'بسیار بدتر': 15,
  },
  BI4: {
    // Self-awareness score — used to compute perceptionGap, not added to overall
    'بسیار سالم': 100,
    'نسبتاً سالم': 75,
    متوسط: 50,
    ناسالم: 25,
  },
  BI5: {
    'کاملاً مطمئنم': 100,
    'تا حدودی مطمئنم': 65,
    'زیاد مطمئن نیستم': 35,
    'اصلاً مطمئن نیستم': 15,
  },
}

// Default score for any unmapped answer
const DEFAULT_SCORE = 50

// Map numeric question IDs → domain key used in scoreMap
const idToKey: Record<number, string> = {
  // Goals (G1–G3) — segmentation only, no numeric score
  // 1: G1, 2: G2, 3: G3

  // Energy
  4: 'E1',
  5: 'E2',
  6: 'E3',

  // Sleep
  7: 'SL1',
  8: 'SL2',
  9: 'SL3',
  10: 'SL4',

  // Nutrition
  11: 'N1',
  12: 'N2',
  13: 'N3',
  14: 'N4',
  15: 'N5',

  // Movement
  16: 'P1',
  17: 'P2',
  18: 'P3',
  19: 'P4',

  // Stress
  20: 'M1',
  21: 'M2', // descriptive
  22: 'M3',
  23: 'M4',
  24: 'M5',

  // Beauty
  25: 'B1',
  26: 'B2', // descriptive
  27: 'B3', // descriptive
  28: 'B4',

  // Medical
  29: 'C1', // descriptive
  30: 'C2', // descriptive
  31: 'C3',
  32: 'C4', // descriptive
  33: 'C5',

  // Behavioral Intelligence
  34: 'BI1',
  35: 'BI2',
  36: 'BI3',
  37: 'BI4', // perceptionGap source
  38: 'BI5',
}

// Helper: look up score by numeric question ID
function score(id: number, answers: Record<number, string>): number {
  const key = idToKey[id]
  if (!key) return DEFAULT_SCORE
  const answer = answers[id]
  if (!answer) return DEFAULT_SCORE
  return scoreMap[key]?.[answer] ?? DEFAULT_SCORE
}

export function calculateScores(answers: Record<number, string>): DomainScores {
  // ── Energy score (E1–E3) ──────────────────────────────────────────────────
  const energyScore = Math.round(
    [score(4, answers), score(5, answers), score(6, answers)].reduce(
      (a, b) => a + b,
      0,
    ) / 3,
  )

  // ── Sleep score (SL1–SL4) ─────────────────────────────────────────────────
  const sleepScore = Math.round(
    [
      score(7, answers),
      score(8, answers),
      score(9, answers),
      score(10, answers),
    ].reduce((a, b) => a + b, 0) / 4,
  )

  // ── Nutrition score (N1–N5) ───────────────────────────────────────────────
  const nutritionScore = Math.round(
    [
      score(11, answers),
      score(12, answers),
      score(13, answers),
      score(14, answers),
      score(15, answers),
    ].reduce((a, b) => a + b, 0) / 5,
  )

  // ── Activity score (P1–P4) ────────────────────────────────────────────────
  // P2 (Q17) may be skipped if user never exercises; fall back to 0 in that case
  const p1 = score(16, answers)
  const p2 = answers[17] ? score(17, answers) : 0
  const p2Divisor = answers[17] ? 4 : 3
  const p3 = score(18, answers)
  const p4 = score(19, answers)
  const activityScore = Math.round((p1 + p2 + p3 + p4) / p2Divisor)

  // ── Stress score (M1, M3, M4, M5 — M2 is descriptive) ────────────────────
  const stressScore = Math.round(
    [
      score(20, answers),
      score(22, answers),
      score(23, answers),
      score(24, answers),
    ].reduce((a, b) => a + b, 0) / 4,
  )

  // ── Beauty score (B1, B4 — B2 & B3 are descriptive) ──────────────────────
  const beautyScore = Math.round(
    [score(25, answers), score(28, answers)].reduce((a, b) => a + b, 0) / 2,
  )

  // ── Medical score (C3, C5) ────────────────────────────────────────────────
  const medicalScore = Math.round(
    [score(31, answers), score(33, answers)].reduce((a, b) => a + b, 0) / 2,
  )

  // ── Behavioral score (BI1, BI2, BI3, BI5 — BI4 feeds perceptionGap only) ─
  const behavioralScore = Math.round(
    [
      score(34, answers),
      score(35, answers),
      score(36, answers),
      score(38, answers),
    ].reduce((a, b) => a + b, 0) / 4,
  )

  return {
    energy: energyScore,
    sleep: sleepScore,
    nutrition: nutritionScore,
    activity: activityScore,
    stress: stressScore,
    beauty: beautyScore,
    medical: medicalScore,
    behavioral: behavioralScore,
  }
}

export function calculateOverallScore(scores: DomainScores): number {
  const weights = {
    energy: 0.1,
    sleep: 0.18,
    nutrition: 0.2,
    activity: 0.12,
    stress: 0.18,
    beauty: 0.07,
    medical: 0.08,
    behavioral: 0.07,
  }

  const overall =
    scores.energy * weights.energy +
    scores.sleep * weights.sleep +
    scores.nutrition * weights.nutrition +
    scores.activity * weights.activity +
    scores.stress * weights.stress +
    scores.beauty * weights.beauty +
    scores.medical * weights.medical +
    scores.behavioral * weights.behavioral

  return Math.round(overall)
}

// ── Behavioral intelligence derived fields ────────────────────────────────────
// Call this separately to get the rich profile fields described in the mental models.
export function extractBehavioralProfile(
  answers: Record<number, string>,
  overallScore: number,
) {
  const readinessMap: Record<string, string> = {
    'همین امروز شروع می‌کنم': 'high',
    'احتمالاً شروع می‌کنم': 'medium',
    'مطمئن نیستم': 'low',
    'فعلاً آماده نیستم': 'not_ready',
  }
  const identityMap: Record<string, string> = {
    'من فردی هستم که همیشه از سلامت خود مراقبت می‌کنم': 'consistent',
    'معمولاً تلاش می‌کنم اما پایدار نیستم': 'inconsistent',
    'هر از گاهی به سلامت خود توجه می‌کنم': 'occasional',
    'سلامت در اولویت من نیست': 'disengaged',
  }
  const constraintMap: Record<string, string> = {
    'وقت کافی ندارم': 'lack_of_time',
    'انرژی کافی ندارم': 'lack_of_energy',
    'نمی‌دانم از کجا شروع کنم': 'lack_of_knowledge',
    'استرس زیادی دارم': 'high_stress',
    'هزینه بالاست': 'cost',
    'انگیزه ندارم': 'lack_of_motivation',
  }
  const goalMap: Record<string, string> = {
    'انرژی بیشتری داشتم': 'energy',
    'وزن کم می‌کردم': 'weight_loss',
    'پوست بهتری داشتم': 'skin',
    'خواب بهتری داشتم': 'sleep',
    'استرس کمتری داشتم': 'stress',
    'تمرکز بیشتری داشتم': 'focus',
  }
  const outcomeMap: Record<string, string> = {
    'کاهش وزن': 'weight_loss',
    'افزایش انرژی': 'energy',
    'بهبود خواب': 'sleep',
    'کاهش استرس': 'stress',
    'سلامت پوست و مو': 'beauty',
    'بهبود عملکرد ورزشی': 'performance',
    'طول عمر و پیشگیری': 'longevity',
  }
  const energyPatternMap: Record<string, string> = {
    'ثابت و بالا': 'stable_high',
    'صبح خوب، عصر افت شدید': 'afternoon_crash',
    'صبح خسته، عصر بهتر': 'slow_start',
    'کل روز خسته': 'chronically_low',
  }

  // BI4 self-perception score (0–100)
  const selfPerceptionScore = scoreMap['BI4']?.[answers[37]] ?? DEFAULT_SCORE
  // perceptionGap: positive = overestimates health, negative = underestimates
  const perceptionGap = selfPerceptionScore - overallScore

  return {
    primaryGoal: goalMap[answers[1]] ?? null,
    desiredOutcome: outcomeMap[answers[2]] ?? null,
    biggestConstraint: constraintMap[answers[3]] ?? null,
    energyPattern: energyPatternMap[answers[4]] ?? null,
    readinessToChange: readinessMap[answers[34]] ?? null,
    identityType: identityMap[answers[35]] ?? null,
    selfPerceptionScore,
    perceptionGap,
  }
}
