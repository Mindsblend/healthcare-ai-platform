import { defineConfig, devices } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// تعریف __dirname برای محیط ES Module ("type": "module")
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// بارگذاری متغیرهای محیط تست (.env.test) از ریشه پروژه
dotenv.config({ path: path.resolve(__dirname, '.env.test') })

const PORT = process.env.PORT || 3000
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || `http://localhost:${PORT}`

// مسیر ذخیره وضعیت لاگین کاربر (کوکی‌ها و سشن)
export const STORAGE_STATE_PATH = path.join(
  __dirname,
  'src/tests/e2e/.auth/user.json',
)

export default defineConfig({
  // مسیر پوشه تست‌های E2E مطابق ساختار پروژه شما
  testDir: './src/tests/e2e',

  // اجرای همزمان تست‌های مستقل
  fullyParallel: true,

  // جلوگیری از اجرای متدهای .only در محیط CI (مثل GitHub Actions)
  forbidOnly: !!process.env.CI,

  // تعداد تلاش مجدد در صورت شکست در محیط CI
  retries: process.env.CI ? 2 : 0,

  // تعداد ورکرها (در CI برای جلوگیری از تداخل دیتابیس روی 1 تنظیم می‌شود)
  workers: process.env.CI ? 1 : undefined,

  // گزارش‌ساز تست‌ها
  reporter: [['html', { open: 'never' }], ['list']],

  // اسکریپت آماده‌سازی اولیه (سازگار با ES Modules بدون نیاز به require.resolve)
  globalSetup: './src/tests/e2e/global-setup.ts',

  use: {
    baseURL: BASE_URL,
    // استفاده مستقیم از مرورگر Google Chrome نصب‌شده روی ویندوز در تمام پروژه‌ها (از جمله setup)
    channel: 'chrome',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // غیرفعال کردن ضبط ویدیو تا نیازی به دانلود باینری ffmpeg نباشد
    video: 'off',
    locale: 'fa-IR',
    timezoneId: 'Asia/Tehran',
  },

  projects: [
    // ۱. پروژه Setup: اجرای لاگین با کد OTP (123456) و ذخیره کوکی‌ها
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },

    // ۲. پروژه تست‌های نیازمند لاگین (پروفایل، ثبت سفارش، پنل ادمین)
    {
      name: 'chromium-authenticated',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        storageState: STORAGE_STATE_PATH,
      },
      dependencies: ['setup'],
      testIgnore: [/.*\.guest\.spec\.ts/, /.*\.setup\.ts/],
    },

    // ۳. پروژه تست‌های کاربر مهمان (صفحه اصلی، لیست محصولات، تست خود صفحه لاگین)
    {
      name: 'chromium-guest',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
      testMatch: /.*\.guest\.spec\.ts/,
    },
  ],

  // بالا آوردن خودکار سرور Next.js 16 با متغیرهای .env.test قبل از شروع تست‌ها
  webServer: {
    command: 'npx dotenv run -f .env.test -- npm run dev',
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
})
