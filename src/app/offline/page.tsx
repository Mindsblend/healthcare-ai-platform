import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'آفلاین - دیجی سلامت',
  description: 'شما در حال حاضر آفلاین هستید. لطفا اتصال اینترنت خود را بررسی کنید.',
  robots: 'noindex, nofollow',
}

export default function OfflinePage() {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1B2024" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon-180.png" />
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Vazirmatn', 'Tahoma', sans-serif;
            background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #1B2024;
          }
          .container {
            background: white;
            border-radius: 24px;
            padding: 48px 32px;
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(27, 32, 36, 0.1);
            border: 1px solid #e5e5e5;
          }
          .icon-wrapper {
            width: 100px;
            height: 100px;
            margin: 0 auto 24px;
            background: linear-gradient(135deg, #1B2024 0%, #23282D 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(27, 32, 36, 0.4); }
            50% { transform: scale(1.05); box-shadow: 0 0 0 16px rgba(27, 32, 36, 0); }
          }
          h1 {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #1B2024;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
            color: #6A7073;
            margin-bottom: 24px;
          }
          .retry-btn {
            background: #1B2024;
            color: white;
            border: none;
            border-radius: 12px;
            padding: 14px 32px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
            max-width: 200px;
          }
          .retry-btn:hover {
            background: #23282D;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(27, 32, 36, 0.2);
          }
          .retry-btn:active {
            transform: translateY(0);
          }
          .retry-btn:focus-visible {
            outline: 3px solid #B1C8FF;
            outline-offset: 3px;
          }
          .tip {
            margin-top: 24px;
            padding: 16px;
            background: #F0FDF4;
            border-radius: 12px;
            border: 1px solid #BBF7D0;
            font-size: 14px;
            color: #166534;
            text-align: right;
          }
          .tip strong { display: block; margin-bottom: 8px; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="icon-wrapper">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2 8.82a15 15 0 0 1 4.17-2.65" />
              <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76" />
              <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68" />
              <path d="M5 13a10 10 0 0 1 5.24-2.76" />
              <path d="M12 20h.01" />
              <path d="m2 2 20 20" />
            </svg>
          </div>
          <h1>اتصال اینترنت قطع شده</h1>
          <p>شما در حال حاضر آفلاین هستید. برخی قابلیت‌ها ممکن است در دسترس نباشند. لطفا اتصال اینترنت خود را بررسی کنید و دوباره تلاش کنید.</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            تلاش مجدد
          </button>
          <div className="tip">
            <strong>نکته:</strong>
            اگر این صفحه را به عنوان برنامه نصب کرده‌اید، می‌توانید صفحات قبلاً بازشده را در حالت آفلاین مشاهده کنید.
          </div>
        </div>
        <script>{`
          // Auto-retry when connection restored
          window.addEventListener('online', () => {
            window.location.reload()
          })
        `}</script>
      </body>
    </html>
  )
}