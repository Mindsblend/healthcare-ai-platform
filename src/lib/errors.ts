export type DomainError = {
  code: string
  message: string
  meta?: unknown
}

// Error definitions as an object with code and message
export const ErrorCode = {
  // INPUT / CLIENT ERRORS
  UNKNOWN_IDENTIFIER: {
    code: 'UNKNOWN_IDENTIFIER',
    message: 'کاربر عزیز یا ایمیل یا شماره تلفن وارد کنین ',
  },
  INVALID_PHONE_NUMBER: {
    code: 'INVALID_PHONE_NUMBER',
    message:
      'شماره واردشده معتبر نیست. لطفاً شماره موبایل را به‌درستی وارد کنید.',
  },
  MISSING_PHONE_NUMBER: {
    code: 'MISSING_PHONE_NUMBER',
    message: 'لطفاً شماره موبایل خود را به‌درستی و کامل وارد کنید.',
  },
  TOO_MANY_ATTEMPTS: {
    code: 'TOO_MANY_ATTEMPTS',
    message:
      'تعداد تلاش‌های ناموفق زیاد بوده است. لطفاً کمی بعد دوباره امتحان کنید.',
  },

  // POLICY / RATE LIMIT ERRORS
  OTP_RATE_LIMIT: {
    code: 'OTP_RATE_LIMIT',
    message:
      'درخواست کد بیش از حد مجاز انجام شده است. لطفاً چند دقیقه صبر کنید.',
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
  UNKNOWN: {
    code: 'UNKNOWN',
    message: 'خطای غیرمنتظره‌ای رخ داده است. لطفاً دوباره امتحان کنید.',
  },
} as const

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
