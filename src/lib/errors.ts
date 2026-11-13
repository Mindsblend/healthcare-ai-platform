// errors.ts
export type DomainError = {
  code: string
  message: string
  meta?: unknown
}

// createDomainError باید پارامتر دوم رو بپذیره و تو خروجی بذاره:
// createDomainError(err, meta?: { retryAfter?: number }) → { code, message, meta }

// Error definitions as an object with code and message
export const ErrorCode = {
  INVALID_INPUT: { code: 'INVALID_INPUT', message: 'ورودی نامعتبر است' },
  INVALID_OTP: {
    code: 'INVALID_OTP',
    message: 'کد وارد شده اشتباه یا منقضی شده است',
  },
  OTP_TOO_MANY_ATTEMPTS: {
    code: 'OTP_TOO_MANY_ATTEMPTS',
    message: 'تعداد تلاش‌ها زیاد بود، کد جدید دریافت کنید',
  },
  NETWORK_ERROR: {
    code: 'NETWORK_ERROR',
    message: 'ارتباط با سرور برقرار نشد',
  },

  // INPUT / CLIENT ERRORS
  UNKNOWN_IDENTIFIER: {
    code: 'UNKNOWN_IDENTIFIER',
    message: 'کاربر عزیز یا ایمیل یا شماره تلفن وارد کنید ',
  },
  MISSING_IDENTIFIER: {
    code: 'MISSING_IDENTIFIER',
    message: 'ایمیل یا شماره تلفن وارد نشده',
  },
  INVALID_PHONE_NUMBER: {
    code: 'INVALID_PHONE_NUMBER',
    message:
      'شماره واردشده معتبر نیست. در حال حاضر از شماره های ایران پشتیبانی میشود .',
  },
  INVALID_EMAIL: {
    code: 'INVALID_EMAIL',
    message: 'ایمیل واردشده معتبر نیست. لطفاً ایمیل را به‌درستی وارد کنید.',
  },
  TOO_MANY_ATTEMPTS: {
    code: 'TOO_MANY_ATTEMPTS',
    message:
      'تعداد تلاش‌های ناموفق زیاد بوده است. لطفاً کمی بعد دوباره امتحان کنید.',
  },

  // Form Validation Errors (Added for checkout form)
  MISSING_FIELD: {
    code: 'MISSING_FIELD',
    message: 'این فیلد الزامی است',
  },
  INVALID_POSTAL_CODE: {
    code: 'INVALID_POSTAL_CODE',
    message: 'کد پستی معتبر نیست (۱۰ رقم)',
  },
  INVALID_ADDRESS: {
    code: 'INVALID_ADDRESS',
    message: 'آدرس وارد شده معتبر نیست',
  },
  INVALID_NAME: {
    code: 'INVALID_NAME',
    message: 'نام وارد شده معتبر نیست',
  },
  INVALID_CITY: {
    code: 'INVALID_CITY',
    message: 'شهر انتخاب شده معتبر نیست',
  },
  INVALID_PROVINCE: {
    code: 'INVALID_PROVINCE',
    message: 'استان انتخاب شده معتبر نیست',
  },

  // POLICY / RATE LIMIT ERRORS
  OTP_RATE_LIMIT: {
    code: 'OTP_RATE_LIMIT',
    message:
      'درخواست کد بیش از ۴ بار در ۹۰ ثانیه مجاز نیست. لطفاً کمی صبر کنید.',
  },
  OTP_COOLDOWN_ACTIVE: {
    code: 'OTP_COOLDOWN_ACTIVE',
    message: 'برای دریافت کد جدید باید کمی صبر کنید.',
  },

  // DELIVERY / PROVIDER ERRORS
  OTP_PROVIDER_FAILED: {
    code: 'OTP_PROVIDER_FAILED',
    message: 'ارسال پیامک با مشکل مواجه شد. لطفاً دوباره تلاش کنید.',
  },
  OTP_PROVIDER_TIMEOUT: {
    code: 'OTP_PROVIDER_TIMEOUT',
    message:
      'ارتباط با سرویس پیامک برقرار نشد. لطفاً اتصال اینترنت را بررسی کنید.',
  },
  OTP_PROVIDER_REJECTED: {
    code: 'OTP_PROVIDER_REJECTED',
    message:
      'امکان ارسال پیامک به این شماره وجود ندارد. لطفاً شماره دیگری امتحان کنید.',
  },
  EMAIL_PROVIDER_FAILED: {
    code: 'EMAIL_PROVIDER_FAILED',
    message:
      'ارسال ایمیل انجام نشد. تنظیمات ایمیل یا پوشه هرزنامه را بررسی کنید.',
  },

  // VERIFICATION ERRORS
  OTP_INVALID: {
    code: 'OTP_INVALID',
    message: 'کد واردشده نادرست است. لطفاً دوباره بررسی کنید.',
  },
  OTP_EXPIRED: {
    code: 'OTP_EXPIRED',
    message: 'کد تأیید منقضی شده است. لطفاً کد جدید دریافت کنید.',
  },
  OTP_ALREADY_USED: {
    code: 'OTP_ALREADY_USED',
    message: 'این کد قبلاً استفاده شده است. لطفاً کد جدید دریافت کنید.',
  },

  // SYSTEM / UNKNOWN
  INTERNAL_ERROR: {
    code: 'INTERNAL_ERROR',
    message: 'خطای داخلی رخ داده است. لطفاً کمی بعد دوباره تلاش کنید.',
  },
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'دسترسی غیر مجاز',
  },
  UNKNOWN: {
    code: 'UNKNOWN',
    message: 'خطای غیرمنتظره‌ای رخ داده است. لطفاً دوباره امتحان کنید.',
  },
} as const

export function isDomainError(e: unknown): e is DomainError {
  if (typeof e !== 'object' || e === null) return false
  const x = e as { code?: unknown; message?: unknown }
  return (
    typeof x.code === 'string' &&
    typeof x.message === 'string' &&
    Object.values(ErrorCode).some((c) => c.code === x.code)
  )
}

// Helper to create an AppError
export function createDomainError(
  error: (typeof ErrorCode)[keyof typeof ErrorCode],
  meta?: unknown,
): Error & { code: string; meta?: unknown } {
  const e = new Error(error.message) as Error & { code: string; meta?: unknown }
  e.code = error.code
  if (meta) e.meta = meta
  return e
}
