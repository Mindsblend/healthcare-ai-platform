import { DomainScores, AIAnalysisResult } from '@/components/types/types'

// ============================================
// SYSTEM PROMPT (UPGRADED: CAUSAL REASONING ENGINE)
// ============================================

export const SYSTEM_PROMPT = `
You are a behavioral health intelligence system, not a wellness chatbot.

Your job is to generate causal, systems-level analysis of human health.

You must think in 3 internal stages:

1. PLANNER:
   Identify the top 2–3 limiting constraints in the system.

2. ANALYST:
   Explain causal relationships between domains (sleep, stress, energy, nutrition, activity, behavioral).

3. COACH:
   Translate insights into practical, emotionally supportive guidance.

---

### CORE REASONING RULES:

- Health is a SYSTEM, not independent categories.
- Always prioritize causality over description.
- Energy and Sleep are foundational drivers.
- Stress modifies all systems.
- Behavior determines adherence and long-term outcomes.
- Avoid generic advice at all costs.
- Never list symptoms or domains independently without linking them.

---

### OUTPUT REQUIREMENTS (STRICT JSON):

Return ONLY valid JSON:

{
  "summary": "2 sentences acknowledging effort and state of system",
  "diagnosis": "causal systems analysis (NOT descriptive), 5–8 sentences max",
  "goals": [
    {
      "goal": "Highly specific, low-friction action",
      "domain": "sleep|nutrition|activity|stress|beauty|medical|energy|behavioral",
      "priority": 1
    }
  ],
  "healthArchetype": "One of: The Busy Achiever, The Self-Care Seeker, The Skeptical Beginner, The Consistency Queen, The Stressed Overachiever, The Hopeful Restarter, The Burnout Candidate",
  "readinessStage": "One of: Contemplation, Preparation, Action, Maintenance",
  "keyInsight": "Single most important leverage point in the system",
  "causalChain": [
    "A → B → C explanation of main dysfunction loop"
  ]
}

---

### STRICT CONSTRAINTS:

- goals MUST be exactly 3 items
- diagnosis MUST be causal (not descriptive)
- NEVER use medical or clinical framing
- focus on energy, recovery, behavior loops
- no repetition of user answers
`

// ============================================
// USER PROMPT BUILDER (RESTRUCTURED FOR SIGNAL QUALITY)
// ============================================

export function buildUserPrompt(
  scores: DomainScores,
  overallScore: number,
  answers: Record<string, any>,
): string {
  const entries = Object.entries(scores)
  const highest = entries.reduce((a, b) => (a[1] > b[1] ? a : b))
  const lowest = entries.reduce((a, b) => (a[1] < b[1] ? a : b))

  const primaryGoal = answers[1] || 'Not specified'
  const biggestObstacle = answers[3] || 'Not specified'
  const energyPattern = answers[4] || 'Not specified'
  const afternoonCrash = answers[5] || 'Not specified'
  const sleepDuration = answers[7] || 'Not specified'
  const sleepQuality = answers[8] || 'Not specified'
  const readiness = answers[34] || 'Not specified'
  const healthIdentity = answers[35] || 'Not specified'
  const confidence = answers[38] || 'Not specified'
  const futureSelf = answers[36] || 'Not specified'

  const systemVector = {
    energy: scores.energy,
    sleep: scores.sleep,
    stress: scores.stress,
    nutrition: scores.nutrition,
    activity: scores.activity,
    behavioral: scores.behavioral,
  }

  const recoveryIndex = Math.round((scores.sleep + (100 - scores.stress)) / 2)
  const systemWeakPoint = lowest[0]
  const systemStrongPoint = highest[0]

  const intentContext =
    'User is seeking lifestyle optimization, energy stabilization, and long-term habit improvement (not clinical treatment).'

  return `
SYSTEM STATE VECTOR:
${JSON.stringify(systemVector, null, 2)}

Derived Metrics:
- Recovery Index: ${recoveryIndex}
- System Weak Point: ${systemWeakPoint}
- System Strong Point: ${systemStrongPoint}

BEHAVIORAL SIGNALS:
- Primary Goal: ${primaryGoal}
- Biggest Barrier: ${biggestObstacle}
- Readiness: ${readiness}
- Identity: ${healthIdentity}
- Confidence: ${confidence}
- Future Outlook: ${futureSelf}

ENERGY CONTEXT:
- Energy Pattern: ${energyPattern}
- Afternoon Crash: ${afternoonCrash}

SLEEP CONTEXT:
- Duration: ${sleepDuration}
- Quality: ${sleepQuality}

INTENT:
${intentContext}

RAW DATA (secondary reference only):
${JSON.stringify(answers, null, 2)}

TASK:
Generate a causal systems-level health analysis following system rules and output format strictly.
`
}

// ============================================
// FALLBACKS (UNCHANGED BUT STILL VALID)
// ============================================

export function getDefaultSummary(scores: DomainScores): string {
  if (scores.beauty > 70) {
    return 'از اینکه این ارزیابی را کامل کردید متشکرم. پایه‌های خوبی در سلامت و زیبایی طبیعی شما دیده می‌شود.'
  }
  if (scores.stress < 40) {
    return 'از اعتماد شما سپاسگزارم. سیستم شما نشان می‌دهد که ظرفیت خوبی برای بهبود احساس آرامش دارید.'
  }
  return 'از اینکه این ارزیابی را انجام دادید سپاسگزارم. این اولین قدم مهم برای درک بهتر سیستم بدن شماست.'
}

export function getDefaultDiagnosis(
  weakestDomain: keyof DomainScores,
  answers?: Record<string, any>,
): string {
  const base: Record<keyof DomainScores, string> = {
    sleep:
      'الگوی خواب شما نشان می‌دهد که سیستم بازیابی بدن بهینه نیست و این می‌تواند بر انرژی روزانه تأثیر بگذارد.',
    nutrition:
      'الگوی تغذیه شما احتمالاً در پایداری انرژی نقش دارد و می‌تواند یکی از عوامل محدودکننده باشد.',
    activity:
      'سطح فعالیت بدنی شما نشان می‌دهد که چرخه انرژی-تحرک نیاز به تنظیم دارد.',
    stress:
      'سطح استرس نشان می‌دهد که سیستم عصبی در حالت فعال باقی می‌ماند و بر سایر بخش‌ها اثر می‌گذارد.',
    beauty:
      'نشانه‌های ظاهری بدن شما می‌تواند بازتابی از وضعیت درونی سیستم باشد.',
    medical: 'آگاهی از وضعیت پایه بدن نقش مهمی در مدیریت بلندمدت سلامت دارد.',
    energy:
      'سطح انرژی شما یک شاخص مرکزی است که بر تمام رفتارهای روزانه اثر می‌گذارد.',
    behavioral:
      'الگوهای رفتاری شما تعیین‌کننده اصلی ثبات تغییرات بلندمدت هستند.',
  }

  let diagnosis = base[weakestDomain] || base.stress

  const obstacle = answers?.[3]

  if (obstacle === 'وقت کافی ندارم') {
    diagnosis += ' محدودیت زمان نیاز به راه‌حل‌های بسیار کوچک و قابل اجرا دارد.'
  } else if (obstacle === 'انرژی کافی ندارم') {
    diagnosis +=
      ' کمبود انرژی نشان می‌دهد باید ابتدا روی بازیابی سیستم تمرکز شود.'
  } else if (obstacle === 'نمی‌دانم از کجا شروع کنم') {
    diagnosis += ' شروع باید از کوچک‌ترین نقطه اثرگذار در سیستم باشد.'
  }

  return diagnosis
}

export function getDefaultGoals(
  scores: DomainScores,
  weakestDomain: keyof DomainScores,
  answers?: Record<string, any>,
): Array<{ goal: string; domain: string; priority: number }> {
  const goalsByDomain: Record<
    keyof DomainScores,
    Array<{ goal: string; domain: string; priority: number }>
  > = {
    sleep: [
      {
        goal: '۱۵ دقیقه قبل از خواب، نور صفحه را حذف کنید و بدن را در حالت استراحت قرار دهید',
        domain: 'sleep',
        priority: 1,
      },
      {
        goal: 'ساعت خواب ثابت ایجاد کنید حتی در روزهای تعطیل',
        domain: 'sleep',
        priority: 2,
      },
      {
        goal: 'صبح‌ها ۵ دقیقه نور طبیعی دریافت کنید',
        domain: 'sleep',
        priority: 3,
      },
    ],
    nutrition: [
      {
        goal: 'در هر وعده غذایی یک منبع پروتئین پایدار اضافه کنید',
        domain: 'nutrition',
        priority: 1,
      },
      {
        goal: 'آب مصرفی را به صورت یکنواخت در طول روز تقسیم کنید',
        domain: 'nutrition',
        priority: 2,
      },
      {
        goal: 'قندهای ساده را در یک وعده روزانه کاهش دهید',
        domain: 'nutrition',
        priority: 3,
      },
    ],
    activity: [
      {
        goal: '۱۰ دقیقه حرکت سبک روزانه برای فعال‌سازی سیستم انرژی',
        domain: 'activity',
        priority: 1,
      },
      {
        goal: 'بعد از هر وعده غذایی ۵ دقیقه حرکت آرام داشته باشید',
        domain: 'activity',
        priority: 2,
      },
      {
        goal: 'نشستن طولانی را هر ۶۰ دقیقه قطع کنید',
        domain: 'activity',
        priority: 3,
      },
    ],
    stress: [
      {
        goal: '۳ دقیقه تنفس عمیق در ابتدای روز قبل از هر محرک خارجی',
        domain: 'stress',
        priority: 1,
      },
      {
        goal: 'یک نقطه آرام روزانه بدون ورودی دیجیتال ایجاد کنید',
        domain: 'stress',
        priority: 2,
      },
      {
        goal: 'هفته‌ای یک ارتباط انسانی عمیق داشته باشید',
        domain: 'stress',
        priority: 3,
      },
    ],
    beauty: [
      {
        goal: 'پاکسازی پوست به صورت ثابت قبل از خواب',
        domain: 'beauty',
        priority: 1,
      },
      {
        goal: 'محافظت روزانه از پوست در برابر نور خورشید',
        domain: 'beauty',
        priority: 2,
      },
      {
        goal: '۲ دقیقه ماساژ صورت برای بهبود جریان خون',
        domain: 'beauty',
        priority: 3,
      },
    ],
    medical: [
      {
        goal: 'ثبت یک چکاپ پایه برای شناخت وضعیت بدن',
        domain: 'medical',
        priority: 1,
      },
      {
        goal: 'جمع‌آوری سابقه سلامت خانوادگی',
        domain: 'medical',
        priority: 2,
      },
      {
        goal: 'ثبت علائم تکرارشونده بدن در یک یادداشت',
        domain: 'medical',
        priority: 3,
      },
    ],
    energy: [
      {
        goal: 'شروع روز با نور طبیعی و حرکت سبک',
        domain: 'energy',
        priority: 1,
      },
      {
        goal: 'جلوگیری از افت انرژی بعد از ناهار با حرکت کوتاه',
        domain: 'energy',
        priority: 2,
      },
      {
        goal: 'تنظیم میان‌وعده برای تثبیت انرژی',
        domain: 'energy',
        priority: 3,
      },
    ],
    behavioral: [
      {
        goal: 'یک عادت کوچک ثابت روزانه ایجاد کنید',
        domain: 'behavioral',
        priority: 1,
      },
      {
        goal: 'ثبت یک پیروزی کوچک روزانه',
        domain: 'behavioral',
        priority: 2,
      },
      {
        goal: 'ایجاد یادآوری برای تمرکز ذهنی روزانه',
        domain: 'behavioral',
        priority: 3,
      },
    ],
  }

  return goalsByDomain[weakestDomain] || goalsByDomain.stress
}

// ============================================
// FALLBACK FULL RESPONSE (ADDED TO FIX EXPORT ERROR)
// ============================================

// Helper to determine archetype from scores and answers
function determineArchetype(
  scores: DomainScores,
  answers: Record<string, any>,
): string {
  const stressScore = scores.stress
  const sleepScore = scores.sleep
  const beautyScore = scores.beauty
  const overallScore =
    (scores.sleep +
      scores.nutrition +
      scores.activity +
      scores.stress +
      scores.beauty +
      scores.medical) /
    6

  const healthIdentity = answers[35]
  const confidence = answers[38]
  const energyPattern = answers[4]
  const futureSelf = answers[36]

  if (stressScore < 40 && sleepScore < 50) return 'The Stressed Overachiever'
  if (beautyScore > 70 && stressScore < 50) return 'The Self-Care Seeker'
  if (
    sleepScore < 40 &&
    scores.nutrition < 40 &&
    overallScore < 50 &&
    (confidence === 'زیاد مطمئن نیستم' || confidence === 'اصلاً مطمئن نیستم')
  )
    return 'The Skeptical Beginner'
  if (scores.sleep > 70 && scores.nutrition > 70 && scores.activity > 70)
    return 'The Consistency Queen'
  if (
    healthIdentity === 'معمولاً تلاش می‌کنم اما پایدار نیستم' ||
    healthIdentity === 'هر از گاهی به سلامت خود توجه می‌کنم'
  )
    return 'The Hopeful Restarter'
  if (
    (energyPattern === 'کل روز خسته' ||
      energyPattern === 'صبح خسته، عصر بهتر') &&
    (futureSelf === 'کمی بدتر' || futureSelf === 'بسیار بدتر')
  )
    return 'The Burnout Candidate'
  return 'The Busy Achiever'
}

// Helper to determine readiness stage
function determineReadinessStage(answers: Record<string, any>): string {
  const readiness = answers[34] || answers['L4'] || answers['readiness'] || ''
  const readinessStr = String(readiness).toLowerCase()
  if (readinessStr.includes('همین امروز شروع می‌کنم')) return 'Action'
  if (readinessStr.includes('احتمالاً شروع می‌کنم')) return 'Preparation'
  if (readinessStr.includes('مطمئن نیستم')) return 'Contemplation'
  if (readinessStr.includes('فعلاً آماده نیستم')) return 'Contemplation'
  if (readinessStr.includes('contemplation') || readinessStr.includes('تفکر'))
    return 'Contemplation'
  if (
    readinessStr.includes('preparation') ||
    readinessStr.includes('آماده‌سازی')
  )
    return 'Preparation'
  if (readinessStr.includes('action') || readinessStr.includes('عمل'))
    return 'Action'
  if (readinessStr.includes('maintenance') || readinessStr.includes('نگهداری'))
    return 'Maintenance'
  return 'Preparation'
}

export function getFallbackAnalysis(
  scores: DomainScores,
  answers: Record<string, any>,
): AIAnalysisResult {
  const entries = Object.entries(scores)
  const lowest = entries.reduce((a, b) => (a[1] < b[1] ? a : b))
  const weakestDomain = lowest[0] as keyof DomainScores

  const keyInsights: Record<string, string> = {
    sleep:
      'بازیابی شبانه پایین‌ترین نقطه سیستم است – بهبود آن تمام حلقه‌های انرژی و استرس را آزاد می‌کند.',
    nutrition:
      'تغذیه ناپایدار باعث نوسان انرژی و تضعیف سایر سیستم‌ها می‌شود. تثبیت قند خون نقطه اهرمی اصلی است.',
    activity:
      'کم‌تحرکی چرخه انرژی-بازیابی را قفل کرده است. افزودن حرکت‌های کوتاه روزانه این حلقه را می‌شکند.',
    stress:
      'استرس مزمن به عنوان تعدیل‌کننده اصلی تمام خروجی‌های سیستم عمل می‌کند. کاهش تنش پایه اولویت اول است.',
    beauty:
      'نشانه‌های پوستی آینه وضعیت درونی هستند. تمرکز بر بازیابی داخلی، درخشش بیرونی را به همراه دارد.',
    medical:
      'آگاهی از نقاط ضعف پایه، پیش‌نیاز هر مداخله مؤثر دیگر است. شروع با شناخت وضعیت موجود.',
    energy:
      'انرژی پایین ریشه تمام محدودیت‌های رفتاری است. فعال‌سازی چرخه صبحگاهی اولین اهرم سیستم است.',
    behavioral:
      'ثبات رفتاری مهم‌ترین پیش‌بینی‌کننده موفقیت بلندمدت است. کوچک‌ترین عادت روزانه نقطه شروع است.',
  }

  const causalChains: Record<string, string[]> = {
    sleep: [
      'خواب ناکافی → کاهش بازیابی سیستم عصبی → افت انرژی روزانه → کاهش فعالیت بدنی → افزایش استرس → بدتر شدن کیفیت خواب',
    ],
    nutrition: [
      'الگوی تغذیه نامنظم → نوسان قند خون → خستگی بعد از ناهار → کاهش اراده برای حرکت → افزایش هوس غذایی → چرخه معیوب پایدار',
    ],
    activity: [
      'کم‌تحرکی → کاهش جریان انرژی → احساس خستگی مزمن → اجتناب از حرکت → تحلیل عضلانی → کمتر شدن ظرفیت فعالیت',
    ],
    stress: [
      'استرس پایه بالا → تحریک مداوم سیستم عصبی → اختلال در بازیابی شبانه → کاهش انرژی صبحگاهی → کاهش آستانه تحمل استرس',
    ],
    beauty: [
      'بی‌خوابی و استرس → التهاب سیستمیک → کاهش درخشندگی پوست و ضعیف شدن مو → کاهش اعتماد به نفس → کاهش مراقبت از خود',
    ],
    medical: [
      'عدم آگاهی از وضعیت پایه → مداخلات غیرهدفمند → هدررفت انرژی و انگیزه → توقف تغییرات مثبت',
    ],
    energy: [
      'افت انرژی صبحگاهی → تاخیر در شروع روز → کاهش فعالیت بدنی → کاهش کیفیت خواب → افت بیشتر انرژی روز بعد',
    ],
    behavioral: [
      'ناپایداری در عادات → عدم ایجاد شتاب مثبت → بازگشت به الگوهای قبلی → کاهش اعتماد به توانایی تغییر',
    ],
  }

  return {
    summary: getDefaultSummary(scores),
    diagnosis: getDefaultDiagnosis(weakestDomain, answers),
    goals: getDefaultGoals(scores, weakestDomain, answers),
    healthArchetype: determineArchetype(scores, answers),
    readinessStage: determineReadinessStage(answers),
    keyInsight: keyInsights[weakestDomain] || keyInsights.energy,
    causalChain: causalChains[weakestDomain] || causalChains.energy,
  }
}
