'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useHealthAssessment } from '@/features/shop/hooks/health/useHealthAssessment'
import { motion, AnimatePresence } from 'framer-motion'

interface Question {
  id: number
  title: string
  prompt: string
  options?: string[]
}

type Direction = 1 | -1

interface Answers {
  [key: number]: string
}

// ============ DOMAIN & SCORING CONFIGURATION ============

// Map each question to its domain and prompt code (for scoring)
const questionDomain: Record<number, { domain: string; code: string }> = {
  // Goals – not scored, but used for routing (treated as own domain)
  1: { domain: 'goals', code: 'G1' },
  2: { domain: 'goals', code: 'G2' },
  3: { domain: 'goals', code: 'G3' },
  // Energy
  4: { domain: 'energy', code: 'E1' },
  5: { domain: 'energy', code: 'E2' },
  6: { domain: 'energy', code: 'E3' },
  // Sleep
  7: { domain: 'sleep', code: 'SL1' },
  8: { domain: 'sleep', code: 'SL2' },
  9: { domain: 'sleep', code: 'SL3' },
  10: { domain: 'sleep', code: 'SL4' },
  // Nutrition
  11: { domain: 'nutrition', code: 'N1' },
  12: { domain: 'nutrition', code: 'N2' },
  13: { domain: 'nutrition', code: 'N3' },
  14: { domain: 'nutrition', code: 'N4' },
  15: { domain: 'nutrition', code: 'N5' },
  // Movement (Activity)
  16: { domain: 'activity', code: 'P1' },
  17: { domain: 'activity', code: 'P2' },
  18: { domain: 'activity', code: 'P3' },
  19: { domain: 'activity', code: 'P4' },
  // Stress
  20: { domain: 'stress', code: 'M1' },
  21: { domain: 'stress', code: 'M2' },
  22: { domain: 'stress', code: 'M3' },
  23: { domain: 'stress', code: 'M4' },
  24: { domain: 'stress', code: 'M5' },
  // Beauty
  25: { domain: 'beauty', code: 'B1' },
  26: { domain: 'beauty', code: 'B2' },
  27: { domain: 'beauty', code: 'B3' },
  28: { domain: 'beauty', code: 'B4' },
  // Medical
  29: { domain: 'medical', code: 'C1' },
  30: { domain: 'medical', code: 'C2' },
  31: { domain: 'medical', code: 'C3' },
  32: { domain: 'medical', code: 'C4' },
  33: { domain: 'medical', code: 'C5' },
  // Behavioral
  34: { domain: 'behavioral', code: 'BI1' },
  35: { domain: 'behavioral', code: 'BI2' },
  36: { domain: 'behavioral', code: 'BI3' },
  37: { domain: 'behavioral', code: 'BI4' },
  38: { domain: 'behavioral', code: 'BI5' },
}

// Scoring map (original from earlier version, mapped to codes)
const scoreMap: Record<string, Record<string, number>> = {
  // Sleep
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
  // Nutrition
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
  // Activity
  P1: {
    '۵ روز یا بیشتر': 100,
    '۳ تا ۴ روز': 75,
    '۱ تا ۲ روز': 50,
    'به ندرت یا هرگز': 25,
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
  // Stress
  M1: {
    'به ندرت': 100,
    گاهی: 70,
    اغلب: 40,
    'تقریباً هر روز': 20,
  },
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
  // Beauty
  B1: {
    'شفاف و آرام': 100,
    'جوش‌های گاه‌به‌گاه': 70,
    'آکنه یا جوش‌های مکرر': 40,
    'خشک، پوسته‌پوسته یا دارای علائم پیری زودرس': 30,
    'قرمزی یا روزاسه': 35,
  },
  B4: {
    'هر روز، چند مرحله‌ای': 100,
    'هر روز، ساده (شستشو + مرطوب‌کننده)': 75,
    'بعضی وقت‌ها': 40,
    'هیچ روتینی ندارم': 15,
  },
  // Medical (only C3 and C5 have scoring)
  C3: {
    'بله، یک دارو': 40,
    'بله، دو دارو یا بیشتر': 20,
    خیر: 100,
  },
  C5: {
    'در یک سال گذشته': 100,
    '۱ تا ۲ سال پیش': 70,
    'بیشتر از ۲ سال پیش': 40,
    'یادم نیست / هرگز': 20,
  },
  // Energy (simple scoring)
  E1: {
    'ثابت و بالا': 100,
    'صبح خوب، عصر افت شدید': 50,
    'صبح خسته، عصر بهتر': 40,
    'کل روز خسته': 20,
  },
  E2: {
    'همچنان پرانرژی هستم': 100,
    'کمی خستگی دارم اما قابل تحمل است': 60,
    'افت شدید انرژی دارم، خوابم می‌آید': 30,
    'اصلاً نمی‌توانم تمرکز کنم': 10,
  },
  E3: {
    'فوری بیدار و شارژ هستم': 100,
    'بعد از ۱۵–۳۰ دقیقه جا می‌افتم': 60,
    'به ساعت‌ها قهوه و زمان نیاز دارم': 30,
    'هرگز کاملاً آماده احساس نمی‌کنم': 10,
  },
}

const DEFAULT_SCORE = 50

// Calculate partial scores for all domains based on answered questions
function calculatePartialScores(answers: Answers): Record<string, number> {
  const domainScores: Record<string, { sum: number; count: number }> = {}

  for (const [qIdStr, answer] of Object.entries(answers)) {
    const qId = parseInt(qIdStr)
    const domainInfo = questionDomain[qId]
    if (!domainInfo) continue
    const { domain, code } = domainInfo
    const score = scoreMap[code]?.[answer as string] ?? DEFAULT_SCORE

    if (!domainScores[domain]) domainScores[domain] = { sum: 0, count: 0 }
    domainScores[domain].sum += score
    domainScores[domain].count++
  }

  const result: Record<string, number> = {}
  for (const [domain, { sum, count }] of Object.entries(domainScores)) {
    result[domain] = Math.round(sum / count)
  }
  return result
}

// Compute how many questions per domain are answered
function getDomainCoverage(answers: Answers): Record<string, number> {
  const totalPerDomain: Record<string, number> = {}
  const answeredPerDomain: Record<string, number> = {}

  for (const [idStr, info] of Object.entries(questionDomain)) {
    const id = parseInt(idStr)
    totalPerDomain[info.domain] = (totalPerDomain[info.domain] || 0) + 1
    if (answers[id])
      answeredPerDomain[info.domain] = (answeredPerDomain[info.domain] || 0) + 1
  }

  const coverage: Record<string, number> = {}
  for (const domain of Object.keys(totalPerDomain)) {
    coverage[domain] = (answeredPerDomain[domain] || 0) / totalPerDomain[domain]
  }
  return coverage
}

// The most uncertain domain = (closest score to 50) * (lowest coverage)
function getMostUncertainDomain(
  partialScores: Record<string, number>,
  coverage: Record<string, number>,
): string | null {
  let maxUncertainty = -1
  let bestDomain: string | null = null

  for (const domain of Object.keys(coverage)) {
    const score = partialScores[domain] ?? 50
    const distanceFromMiddle = Math.abs(score - 50)
    const uncertainty = (1 - distanceFromMiddle / 50) * (1 - coverage[domain])
    if (uncertainty > maxUncertainty) {
      maxUncertainty = uncertainty
      bestDomain = domain
    }
  }
  return bestDomain
}

// Early exit condition: all domains have high confidence (score far from 50 or fully covered)
function isTestComplete(answers: Answers, answeredCount: number): boolean {
  const MIN_QUESTIONS = 15
  if (answeredCount < MIN_QUESTIONS) return false

  const partialScores = calculatePartialScores(answers)
  const coverage = getDomainCoverage(answers)

  for (const domain of Object.keys(coverage)) {
    const score = partialScores[domain] ?? 50
    const distance = Math.abs(score - 50)
    const isConfident = distance > 30 || coverage[domain] === 1
    if (!isConfident) return false
  }
  return true
}

// Dynamic next question selector based on uncertainty
function selectNextQuestion(
  answers: Answers,
  allQuestions: Question[],
): Question | null {
  const answeredIds = new Set(Object.keys(answers).map(Number))
  const remaining = allQuestions.filter((q) => !answeredIds.has(q.id))
  if (remaining.length === 0) return null

  const partialScores = calculatePartialScores(answers)
  const coverage = getDomainCoverage(answers)
  const targetDomain = getMostUncertainDomain(partialScores, coverage)

  if (!targetDomain) {
    // fallback: return first remaining
    return remaining[0]
  }

  // Find first unanswered question in the target domain
  const next = remaining.find(
    (q) => questionDomain[q.id]?.domain === targetDomain,
  )
  if (next) return next

  // No question in that domain left – fallback to first remaining
  return remaining[0]
}

// ============ END ADAPTIVE ROUTING ============

const Page = () => {
  const questions: Question[] = [
    // ── Section 1: Goals (G1–G3) ─────────────────────────────────────────────
    {
      id: 1,
      title: 'بزرگ‌ترین چیزی که آرزو می‌کنید در سلامتتان فرق می‌کرد چیست؟',
      prompt: 'G1 – هدف اصلی',
      options: [
        'انرژی بیشتری داشتم',
        'وزن کم می‌کردم',
        'پوست بهتری داشتم',
        'خواب بهتری داشتم',
        'استرس کمتری داشتم',
        'تمرکز بیشتری داشتم',
      ],
    },
    {
      id: 2,
      title: 'در ۹۰ روز آینده کدام نتیجه برایتان مهم‌تر است؟',
      prompt: 'G2 – نتیجه مطلوب',
      options: [
        'کاهش وزن',
        'افزایش انرژی',
        'بهبود خواب',
        'کاهش استرس',
        'سلامت پوست و مو',
        'بهبود عملکرد ورزشی',
        'طول عمر و پیشگیری',
      ],
    },
    {
      id: 3,
      title: 'چه چیزی شما را از سالم‌تر بودن باز می‌دارد؟',
      prompt: 'G3 – بزرگ‌ترین مانع',
      options: [
        'وقت کافی ندارم',
        'انرژی کافی ندارم',
        'نمی‌دانم از کجا شروع کنم',
        'استرس زیادی دارم',
        'هزینه بالاست',
        'انگیزه ندارم',
      ],
    },

    // ── Section 2: Energy (E1–E3) ────────────────────────────────────────────
    {
      id: 4,
      title: 'در اکثر روزها انرژی شما چگونه است؟',
      prompt: 'E1 – الگوی انرژی روزانه',
      options: [
        'ثابت و بالا',
        'صبح خوب، عصر افت شدید',
        'صبح خسته، عصر بهتر',
        'کل روز خسته',
      ],
    },
    {
      id: 5,
      title: 'بعد از ناهار معمولاً چه احساسی دارید؟',
      prompt: 'E2 – افت انرژی بعد از ظهر',
      options: [
        'همچنان پرانرژی هستم',
        'کمی خستگی دارم اما قابل تحمل است',
        'افت شدید انرژی دارم، خوابم می‌آید',
        'اصلاً نمی‌توانم تمرکز کنم',
      ],
    },
    {
      id: 6,
      title: 'وقتی از خواب بیدار می‌شوید، بدنتان چقدر آماده شروع روز است؟',
      prompt: 'E3 – کیفیت بیداری صبح',
      options: [
        'فوری بیدار و شارژ هستم',
        'بعد از ۱۵–۳۰ دقیقه جا می‌افتم',
        'به ساعت‌ها قهوه و زمان نیاز دارم',
        'هرگز کاملاً آماده احساس نمی‌کنم',
      ],
    },

    // ── Section 3: Sleep (SL1–SL4) ───────────────────────────────────────────
    {
      id: 7,
      title: 'معمولاً چند ساعت در شب می‌خوابید؟',
      prompt: 'SL1 – مدت زمان خواب',
      options: [
        'کمتر از ۵ ساعت',
        '۵ تا ۶ ساعت',
        '۶ تا ۷ ساعت',
        '۷ تا ۸ ساعت',
        'بیشتر از ۸ ساعت',
      ],
    },
    {
      id: 8,
      title: 'وقتی از خواب بیدار می‌شوید، معمولاً چه احساسی دارید؟',
      prompt: 'SL2 – کیفیت خواب',
      options: [
        'سرحال و آماده برای شروع روز',
        'بعد از چند دقیقه خوب می‌شوم',
        'احساس سنگینی می‌کنم، انگار اصلاً نخوابیده‌ام',
        'از همان اول به چرت زدن فکر می‌کنم',
      ],
    },
    {
      id: 9,
      title: 'آیا در طول شب از خواب بیدار می‌شوید؟',
      prompt: 'SL3 – بیدار شدن در طول شب',
      options: [
        'نه، خوابم پیوسته است',
        'بله، یک بار (و راحت دوباره می‌خوابم)',
        'بله، چندین بار',
        'بله، و دوباره خوابیدن برایم سخت است',
      ],
    },
    {
      id: 10,
      title: 'آیا قبل از خواب روتین آرامش‌بخش مشخصی دارید؟',
      prompt: 'SL4 – روتین قبل از خواب',
      options: [
        'بله، هر شب',
        'بعضی وقت‌ها',
        'به ندرت',
        'نه، فقط خسته می‌شوم و می‌خوابم',
      ],
    },

    // ── Section 4: Nutrition (N1–N5) ─────────────────────────────────────────
    {
      id: 11,
      title: 'چند وقت یک‌بار غذاهای سرشار از پروتئین مصرف می‌کنید؟',
      prompt: 'N1 – مصرف پروتئین',
      options: [
        'در هر وعده غذایی',
        'روزی دو بار',
        'روزی یک بار',
        'چند بار در هفته',
        'به ندرت',
      ],
    },
    {
      id: 12,
      title: 'چند وقت یک‌بار چربی‌های سالم مصرف می‌کنید؟',
      prompt: 'N2 – چربی‌های سالم',
      options: ['روزانه', 'چند بار در هفته', 'هفته‌ای یک بار', 'به ندرت'],
    },
    {
      id: 13,
      title: 'روزانه چند وعده میوه و سبزیجات مصرف می‌کنید؟',
      prompt: 'N3 – مصرف میوه و سبزیجات',
      options: ['۵ وعده یا بیشتر', '۳ تا ۴ وعده', '۱ تا ۲ وعده', 'به ندرت'],
    },
    {
      id: 14,
      title: 'روزانه چند لیوان آب می‌نوشید؟',
      prompt: 'N4 – میزان آب مصرفی',
      options: [
        '۸ لیوان یا بیشتر',
        '۶ تا ۷ لیوان',
        '۴ تا ۵ لیوان',
        'کمتر از ۴ لیوان',
      ],
    },
    {
      id: 15,
      title: 'وضعیت گوارش خود را چگونه توصیف می‌کنید؟',
      prompt: 'N5 – وضعیت گوارش',
      options: [
        'بسیار راحت و منظم',
        'گاهی نفخ یا گاز معده دارم',
        'ناراحتی یا بی‌نظمی مکرر',
        'مشکلات مزمن (IBS، یبوست یا اسهال)',
      ],
    },

    // ── Section 5: Movement (P1–P4) ──────────────────────────────────────────
    {
      id: 16,
      title: 'چند روز در هفته حداقل ۲۰ دقیقه ورزش می‌کنید؟',
      prompt: 'P1 – تعداد دفعات ورزش',
      options: [
        '۵ روز یا بیشتر',
        '۳ تا ۴ روز',
        '۱ تا ۲ روز',
        'به ندرت یا هرگز',
      ],
    },
    {
      id: 17,
      title: 'چه نوع فعالیت ورزشی را به‌صورت منظم انجام می‌دهید؟',
      prompt: 'P2 – نوع ورزش',
      options: [
        'پیاده‌روی',
        'ورزش هوازی (دویدن، دوچرخه‌سواری، شنا)',
        'تمرینات قدرتی',
        'یوگا / حرکات کششی',
        'هیچ‌کدام به‌صورت منظم',
      ],
    },
    {
      id: 18,
      title: 'خارج از ورزش، سبک زندگی روزانه شما چقدر فعال است؟',
      prompt: 'P3 – میزان تحرک روزانه',
      options: [
        'بسیار فعال (کار فیزیکی یا پیاده‌روی زیاد)',
        'نسبتاً فعال',
        'کم‌تحرک (کار پشت‌میزی و بیشتر نشسته)',
      ],
    },
    {
      id: 19,
      title: 'بعد از فعالیت بدنی معمولاً چه احساسی دارید؟',
      prompt: 'P4 – احساس بعد از ورزش',
      options: [
        'پرانرژی',
        'معمولی / بدون تغییر',
        'خسته اما حس خوبی دارم',
        'کاملاً خسته و بی‌حال',
      ],
    },

    // ── Section 6: Stress (M1–M5) ────────────────────────────────────────────
    {
      id: 20,
      title: 'چند وقت یک‌بار احساس استرس یا فشار روانی می‌کنید؟',
      prompt: 'M1 – میزان استرس',
      options: ['به ندرت', 'گاهی', 'اغلب', 'تقریباً هر روز'],
    },
    {
      id: 21,
      title: 'وقتی استرس دارید، آن را در کدام بخش بدن احساس می‌کنید؟',
      prompt: 'M2 – علائم فیزیکی استرس',
      options: [
        'سردرد یا فشار فک',
        'دل‌درد یا حالت تهوع',
        'تپش قلب یا تنفس سطحی',
        'هیچ علامت فیزیکی ندارم',
      ],
    },
    {
      id: 22,
      title: 'در یک ماه گذشته، حال روحی خود را چگونه توصیف می‌کنید؟',
      prompt: 'M3 – وضعیت روحیه',
      options: [
        'معمولاً مثبت و پایدار',
        'گاهی بی‌حوصلگی یا تحریک‌پذیری',
        'نوسانات روحی زیاد',
        'بیشتر اوقات بی‌انگیزه یا ناراحت',
      ],
    },
    {
      id: 23,
      title: 'آیا تمرین منظم برای آرامش ذهن دارید؟',
      prompt: 'M4 – تمرین آرام‌سازی',
      options: ['بله، روزانه', 'بعضی وقت‌ها', 'به ندرت', 'نه'],
    },
    {
      id: 24,
      title:
        'چند وقت یک‌بار با افرادی که از شما حمایت می‌کنند در ارتباط هستید؟',
      prompt: 'M5 – ارتباط اجتماعی',
      options: ['روزانه', 'چند بار در هفته', 'هفتگی', 'به ندرت'],
    },

    // ── Section 7: Beauty (B1–B4) ────────────────────────────────────────────
    {
      id: 25,
      title: 'پوست خود را چگونه توصیف می‌کنید؟',
      prompt: 'B1 – وضعیت پوست',
      options: [
        'شفاف و آرام',
        'جوش‌های گاه‌به‌گاه',
        'آکنه یا جوش‌های مکرر',
        'خشک، پوسته‌پوسته یا دارای علائم پیری زودرس',
        'قرمزی یا روزاسه',
      ],
    },
    {
      id: 26,
      title: 'وقتی استرس دارید، پوست شما چه واکنشی نشان می‌دهد؟',
      prompt: 'B2 – واکنش پوست به استرس',
      options: [
        'هیچ تغییری نمی‌کند',
        'جوش‌ها بیشتر می‌شوند',
        'قرمزی یا التهاب',
        'خشکی یا تشدید اگزما',
      ],
    },
    {
      id: 27,
      title: 'آیا مشکلی در مو یا ناخن خود مشاهده می‌کنید؟',
      prompt: 'B3 – وضعیت مو و ناخن',
      options: [
        'هیچ مشکلی ندارم',
        'نازک شدن یا ریزش مو',
        'شکنندگی ناخن',
        'رشد کند مو',
        'موهای خشک یا آسیب‌دیده',
      ],
    },
    {
      id: 28,
      title: 'روتین مراقبت پوستی شما چقدر منظم است؟',
      prompt: 'B4 – روتین مراقبت پوستی',
      options: [
        'هر روز، چند مرحله‌ای',
        'هر روز، ساده (شستشو + مرطوب‌کننده)',
        'بعضی وقت‌ها',
        'هیچ روتینی ندارم',
      ],
    },

    // ── Section 8: Medical (C1–C5) ────────────────────────────────────────────
    {
      id: 29,
      title: 'آیا بیماری یا مشکل سلامت بلندمدت دارید؟',
      prompt: 'C1 – بیماری‌های مزمن',
      options: [
        'فشار خون بالا',
        'کلسترول بالا',
        'دیابت / پیش‌دیابت',
        'اختلال تیروئید',
        'کم‌خونی یا فقر آهن',
        'بیماری خودایمنی',
        'افسردگی / اضطراب',
        'هیچ‌کدام',
      ],
    },
    {
      id: 30,
      title:
        'آیا در خانواده نزدیک شما سابقه بیماری قلبی، دیابت یا فشار خون بالا وجود دارد؟',
      prompt: 'C2 – سابقه خانوادگی',
      options: ['بله، یک یا چند مورد', 'خیر', 'مطمئن نیستم'],
    },
    {
      id: 31,
      title: 'آیا به‌صورت منظم داروی تجویزی مصرف می‌کنید؟',
      prompt: 'C3 – مصرف دارو',
      options: ['بله، یک دارو', 'بله، دو دارو یا بیشتر', 'خیر'],
    },
    {
      id: 32,
      title: 'آیا به چیزی آلرژی یا حساسیت دارید؟',
      prompt: 'C4 – آلرژی یا حساسیت',
      options: [
        'گلوتن',
        'لبنیات',
        'صدف دریایی',
        'سویا',
        'مغزها / آجیل',
        'هیچ‌کدام',
      ],
    },
    {
      id: 33,
      title: 'آخرین چکاپ کامل پزشکی شما چه زمانی بوده است؟',
      prompt: 'C5 – چکاپ پزشکی',
      options: [
        'در یک سال گذشته',
        '۱ تا ۲ سال پیش',
        'بیشتر از ۲ سال پیش',
        'یادم نیست / هرگز',
      ],
    },

    // ── Section 9: Behavioral Intelligence (BI1–BI5) ─────────────────────────
    {
      id: 34,
      title:
        'اگر همین امروز یک برنامه شخصی‌سازی‌شده به شما می‌دادیم، چقدر احتمال دارد آن را دنبال کنید؟',
      prompt: 'BI1 – آمادگی برای تغییر',
      options: [
        'همین امروز شروع می‌کنم',
        'احتمالاً شروع می‌کنم',
        'مطمئن نیستم',
        'فعلاً آماده نیستم',
      ],
    },
    {
      id: 35,
      title: 'کدام جمله بیشتر توصیف‌کننده شماست؟',
      prompt: 'BI2 – هویت سلامت',
      options: [
        'من فردی هستم که همیشه از سلامت خود مراقبت می‌کنم',
        'معمولاً تلاش می‌کنم اما پایدار نیستم',
        'هر از گاهی به سلامت خود توجه می‌کنم',
        'سلامت در اولویت من نیست',
      ],
    },
    {
      id: 36,
      title:
        'اگر هیچ‌چیزی در عادات شما تغییر نکند، فکر می‌کنید سلامتتان در ۵ سال آینده کجا خواهد بود؟',
      prompt: 'BI3 – مدل آینده‌نگری',
      options: ['بهتر از امروز', 'تقریباً مشابه', 'کمی بدتر', 'بسیار بدتر'],
    },
    {
      id: 37,
      title: 'سلامت خود را امروز چطور ارزیابی می‌کنید؟',
      prompt: 'BI4 – خودآگاهی سلامت',
      options: ['بسیار سالم', 'نسبتاً سالم', 'متوسط', 'ناسالم'],
    },
    {
      id: 38,
      title:
        'چقدر به توانایی خود برای ایجاد تغییرات پایدار در سبک زندگی اطمینان دارید؟',
      prompt: 'BI5 – اطمینان به تغییر',
      options: [
        'کاملاً مطمئنم',
        'تا حدودی مطمئنم',
        'زیاد مطمئن نیستم',
        'اصلاً مطمئن نیستم',
      ],
    },
  ]

  const [showIntro, setShowIntro] = useState(true)
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1)
  const [answers, setAnswers] = useState<Answers>({})
  const [direction, setDirection] = useState<Direction>(1)
  const [error, setError] = useState<boolean>(false)
  const [questionPath, setQuestionPath] = useState<number[]>([1])
  const router = useRouter()
  const { submit, loading, error: submitError } = useHealthAssessment()

  const handleStart = () => setShowIntro(false)

  const getCurrentQuestion = () =>
    questions.find((q) => q.id === currentQuestionId)!

  const handleNext = async (): Promise<void> => {
    const current = getCurrentQuestion()
    const questionId = current.id

    if (current.options && !answers[questionId]) {
      setError(true)
      return
    }
    setError(false)

    // Determine if test is complete
    const answeredCount = Object.keys(answers).length
    const complete = isTestComplete(answers, answeredCount)

    if (complete) {
      // Early exit – submit immediately
      try {
        const result = await submit(answers)
        console.log(result)
        alert('تست شما با موفقیت ثبت شد!')
        router.push(`/ai-test/result/${result.assessment.id}`)
      } catch (error) {
        console.error(error)
      }
      return
    }

    // Otherwise, select next question dynamically
    const nextQuestion = selectNextQuestion(answers, questions)
    if (!nextQuestion) {
      // No questions left – submit
      try {
        const result = await submit(answers)
        console.log(result)
        alert('تست شما با موفقیت ثبت شد!')
        router.push(`/ai-test/result/${result.assessment.id}`)
      } catch (error) {
        console.error(error)
      }
      return
    }

    setDirection(1)
    setQuestionPath((prev) => [...prev, nextQuestion.id])
    setCurrentQuestionId(nextQuestion.id)
  }

  const handlePrevious = (): void => {
    if (questionPath.length > 1) {
      setDirection(-1)
      const newPath = [...questionPath]
      newPath.pop()
      const prevId = newPath[newPath.length - 1]
      setQuestionPath(newPath)
      setCurrentQuestionId(prevId)
      setError(false)
    }
  }

  const handleOptionSelect = (option: string): void => {
    setError(false)
    const questionId = getCurrentQuestion().id
    setAnswers((prev: Answers) => ({
      ...prev,
      [questionId]: option,
    }))
  }

  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / questions.length) * 100

  // Intro Screen (unchanged)
  if (showIntro) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="font-aria text-4xl font-extrabold text-black sm:text-5xl lg:text-6xl">
            به تست سلامت هوشمند خوش آمدید
          </h1>
          <p className="font-ray mt-6 text-lg font-medium text-[#555555]">
            این تست نتیجه‌ی ترکیب دو دنیا است: از یک طرف، دانش ارزشمند و
            هزارساله‌ی طب سنتی ایرانی که ریشه در شناخت عمیق بدن و تعادل مزاج‌ها
            دارد، و از طرف دیگر، قدرت بی‌نظیر تحلیل داده‌ها توسط هوش مصنوعی. با
            پاسخ دادن دقیق به پرسش‌ها، الگوریتم هوشمند ما می‌تواند تصویر روشنی
            از وضعیت بدنی شما ترسیم کند و گزارشی شخصی‌سازی‌شده به شما ارائه دهد.
            این گزارش شامل تیپ بدنی شما، توصیه‌های غذایی متناسب، پیشنهادهایی
            برای سبک زندگی و حتی نکاتی درباره پیشگیری از مشکلات احتمالی در آینده
            خواهد بود. هرچه پاسخ‌های شما جزئی‌تر و دقیق‌تر باشد، نتیجه نهایی
            واقعی‌تر و کاربردی‌تر خواهد شد. این تست فقط یک پرسشنامه ساده نیست؛
            بلکه یک راهنماست که می‌تواند در عرض چند دقیقه به شما بینشی بدهد که
            بسیاری افراد برای به‌دست آوردنش ماه‌ها وقت و هزینه صرف می‌کنند. به
            یاد داشته باشید: تکمیل این تست کمتر از ۳ دقیقه طول می‌کشد، اما بینشی
            که دریافت می‌کنید می‌تواند مسیر جدیدی برای سلامتی، انرژی و آرامش شما
            در سال‌های آینده بسازد.
          </p>
          <button
            onClick={handleStart}
            className="font-aria mt-8 cursor-pointer rounded-lg bg-[#087112] px-8 py-3 text-lg font-bold text-white transition hover:bg-[#065c0e]"
          >
            شروع تست
          </button>
        </div>
      </div>
    )
  }

  const currentQuestion = getCurrentQuestion()
  const isFinish =
    isTestComplete(answers, answeredCount) ||
    selectNextQuestion(answers, questions) === null

  // Questionnaire (UI unchanged except button text logic)
  return (
    <div className="flex min-h-screen flex-col">
      {/* Progress Bar - Fixed Top */}
      <div className="fixed top-0 right-0 left-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="h-1.25 bg-gray-200">
          <motion.div
            className="h-full bg-[#087112]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Main Content - Vertically Centered */}
      <div className="flex grow items-center justify-center">
        {submitError && (
          <p className="mt-4 text-sm font-medium text-red-500">{submitError}</p>
        )}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestionId}
            custom={direction}
            initial={{
              x: direction > 0 ? 200 : -200,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
            }}
            exit={{
              x: direction < 0 ? 200 : -200,
              opacity: 0,
            }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full px-6"
          >
            <div className="mx-auto flex w-full max-w-5xl gap-6">
              {/* Question ID and Clickable Back Arrow */}
              <div className="flex gap-1 self-start pt-2">
                <button
                  onClick={handlePrevious}
                  disabled={questionPath.length === 1}
                  className="flex items-center gap-1 focus:outline-none"
                >
                  <h2 className="font-aria text-lg text-black">
                    {currentQuestion.id.toLocaleString('fa-IR')}
                  </h2>
                  <Image
                    src="/images/left-arrow.svg"
                    width={24}
                    height={24}
                    alt="previous"
                    className={`${questionPath.length === 1 ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}`}
                  />
                </button>
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <div className="text-black">
                  <h1 className="font-aria text-6xl font-extrabold">
                    {currentQuestion.title}
                  </h1>
                  <p className="font-ray mt-6 text-lg font-medium text-[#555555]">
                    {currentQuestion.prompt}
                  </p>
                </div>

                {/* Options */}
                {currentQuestion.options && (
                  <div className="mt-8 space-y-3">
                    {currentQuestion.options.map(
                      (option: string, index: number) => {
                        const isSelected =
                          answers[currentQuestion.id] === option

                        return (
                          <motion.button
                            key={`${currentQuestion.id}-${index}`}
                            type="button"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * index }}
                            onClick={() => handleOptionSelect(option)}
                            className={`font-ray w-full cursor-pointer rounded-lg border-2 p-4 text-right transition-all duration-200 ${
                              isSelected
                                ? 'border-[#555555] bg-gray-50 text-[#555555]'
                                : error
                                  ? 'border-red-300 text-[#555555] hover:border-red-400'
                                  : 'border-gray-200 text-[#555555] hover:border-gray-300'
                            }`}
                          >
                            {option}
                          </motion.button>
                        )
                      },
                    )}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="font-ray mt-4 text-sm font-medium text-red-500"
                  >
                    لطفاً یک گزینه را انتخاب کنید
                  </motion.p>
                )}

                {/* Next / Submit Button */}
                <div className="mt-8 flex justify-start">
                  <button
                    disabled={loading}
                    onClick={handleNext}
                    className="to-accent-blue from-accent-purple font-aria flex h-13.5 w-52.5 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-linear-to-br text-lg font-extrabold text-black transition-opacity hover:opacity-90"
                  >
                    {loading ? 'در حال تحلیل...' : isFinish ? 'پایان' : 'ادامه'}
                    <Image
                      src="/images/left-arrow.svg"
                      width={24}
                      height={24}
                      alt="next"
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="mt-auto flex justify-start px-6 py-4">
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={questionPath.length === 1}
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl font-bold transition-all duration-200 ${
              questionPath.length === 1
                ? 'cursor-not-allowed border-gray-200 text-gray-300'
                : 'cursor-pointer border-gray-300 text-black hover:bg-gray-100'
            }`}
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            disabled={loading}
            className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl font-bold transition-all duration-200 ${
              loading
                ? 'cursor-not-allowed border-gray-200 text-gray-300'
                : 'cursor-pointer border-gray-300 text-black hover:bg-gray-100'
            }`}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  )
}

export default Page
