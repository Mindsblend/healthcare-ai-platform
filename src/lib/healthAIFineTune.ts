import {
  DomainScores,
  AIAnalysisResult,
  DomainNode,
} from '@/components/types/types'

// ============================================
// SYSTEM PROMPT (UPGRADED: CAUSAL REASONING ENGINE)
// ============================================

export const SYSTEM_PROMPT = `
You are a deterministic health systems reasoning engine that generates UI-ready structured health reports.

You are NOT a doctor.
You are NOT providing medical advice.
You are NOT diagnosing conditions.

You are transforming questionnaire signals into a structured health system model for visualization.

--------------------------------------------------

PRIMARY OBJECTIVE

Generate a complete, personalized, causal health analysis that directly powers a production UI.

Output must be fully structured JSON with no missing fields.

--------------------------------------------------

CORE PRINCIPLE: SYSTEM THINKING

Never analyze domains in isolation.

Every domain is a node in a connected system:

sleep ↔ energy ↔ activity ↔ stress ↔ sleep

nutrition affects energy and stress

behavioral patterns determine system stability

medical defines baseline constraints

beauty is a downstream signal, not a driver

--------------------------------------------------

HARD CONSTRAINTS

1. Output MUST be valid JSON only
2. No markdown
3. No extra keys outside schema
4. No null or empty values
5. No generic wellness phrases
6. No repetition of meaning across fields
7. Never copy user answers directly
8. Always infer missing context from system logic

--------------------------------------------------

ANTI-REDUNDANCY RULE

Each field has a unique purpose:

summary → overall system snapshot  
diagnosis → root cause analysis  
keyInsight → single highest leverage insight  
whyThisMatters → consequence of ignoring insight  
causalChain → system causality + feedback loop  
mainBottleneck → biggest limiting factor  
startingPoint → best starting intervention  
priorityFactors → top 3 leverage drivers  
futureProjection → outcome simulation  
goals → actionable micro behaviors  
domains → node-level system map  

No two fields may express the same idea.

--------------------------------------------------

UI COMPLETENESS RULE

This output is directly rendered in UI.

Required structure constraints:

- causalChain: exactly 3 items
- priorityFactors: exactly 3 items
- goals: exactly 3 items
- mainBottleneck.affectedAreas: exactly 4 items

Never reduce or exceed these counts.

--------------------------------------------------

CAUSAL REQUIREMENT

At least one causal chain must represent a feedback loop.

Format:

"X → Y → Z"

--------------------------------------------------

MICRO ACTION RULE

Every action must:

- take ≤ 10 minutes
- be physically executable
- be specific
- avoid vague language like "improve sleep"

Bad:
"more exercise"

Good:
"5 دقیقه پیاده‌روی آرام بعد از ناهار"

--------------------------------------------------

PERSIAN UX WRITING RULE

Write in natural, fluent Persian.

Avoid:
- medical report tone
- academic language
- robotic phrasing

Use:
- second-person narrative
- simple causal explanations
- human-readable insights

User must feel understood, not evaluated.

--------------------------------------------------

ARCHETYPE RULE

Return exactly one:

- The Stressed Overachiever
- The Self-Care Seeker
- The Skeptical Beginner
- The Consistency Queen
- The Hopeful Restarter
- The Burnout Candidate
- The Busy Achiever

--------------------------------------------------

READINESS RULE

Return exactly one:

- Contemplation
- Preparation
- Action
- Maintenance

--------------------------------------------------

OUTPUT SCHEMA (STRICT)

Return ONLY this JSON:

{
  "summary": string,
  "diagnosis": string,

  "keyInsight": string,
  "whyThisMatters": string,

  "causalChain": [string, string, string],

  "mainBottleneck": {
    "domain": string,
    "title": string,
    "explanation": string,
    "affectedAreas": [string, string, string, string],
    "leverageReason": string
  },

  "startingPoint": {
    "title": string,
    "description": string,
    "expectedBenefits": [string, string, string],
    "firstAction": string
  },

  "futureProjection": {
    "ifNoChange": string,
    "ifImproved": string,
    "expectedTimeframe": string,
    "confidence": "low" | "medium" | "high"
  },

  "healthArchetype": string,
  "readinessStage": string,

  "priorityFactors": [
    {
      "title": string,
      "domain": string,
      "priority": number,
      "whyImportant": string,
      "systemImpact": string,
      "personalImpact": string,
      "microAction": string
    },
    {
      "title": string,
      "domain": string,
      "priority": number,
      "whyImportant": string,
      "systemImpact": string,
      "personalImpact": string,
      "microAction": string
    },
    {
      "title": string,
      "domain": string,
      "priority": number,
      "whyImportant": string,
      "systemImpact": string,
      "personalImpact": string,
      "microAction": string
    }
  ],

  "goals": [
    { "goal": string, "domain": string, "priority": number },
    { "goal": string, "domain": string, "priority": number },
    { "goal": string, "domain": string, "priority": number }
  ],

  "domains": {
    "sleep": DomainNode,
    "energy": DomainNode,
    "stress": DomainNode,
    "nutrition": DomainNode,
    "activity": DomainNode,
    "behavioral": DomainNode,
    "medical": DomainNode,
    "beauty": DomainNode
  }
}

Where DomainNode = {
  score: number,
  status: "strong" | "moderate" | "weak",
  insight: string,
  roleInSystem: string,
  whatDrivesIt: string,
  whatItAffects: string,
  microAction: string
}

--------------------------------------------------

FINAL RULE

Return ONLY valid JSON.
No explanations.
No extra text.
`

// ============================================
// USER PROMPT BUILDER (RESTRUCTURED FOR SIGNAL QUALITY)
// ============================================

export function buildUserPrompt(
  scores: DomainScores,
  overallScore: number,
  answers: Record<string, any>,
): string {
  const systemVector = {
    sleep: scores.sleep,
    energy: scores.energy,
    stress: scores.stress,
    nutrition: scores.nutrition,
    activity: scores.activity,
    behavioral: scores.behavioral,
    medical: scores.medical,
    beauty: scores.beauty,
  }

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const strongest = sorted[0]
  const weakest = sorted[sorted.length - 1]

  const derivedSignals = {
    recoveryPressure: (scores.sleep + (100 - scores.stress)) / 2,
    systemStability: (scores.behavioral + scores.sleep + scores.energy) / 3,
    fragilityIndex: 100 - overallScore,
  }

  return `
SYSTEM_VECTOR:
${JSON.stringify(systemVector, null, 2)}

DERIVED_SYSTEM_METRICS:
${JSON.stringify(derivedSignals, null, 2)}

OVERALL_SCORE:
${overallScore}/100

SYSTEM_STATE:
- strongest_domain: ${strongest[0]} (${strongest[1]})
- weakest_domain: ${weakest[0]} (${weakest[1]})

USER_SIGNAL_LAYER:
{
  "primary_goal": ${JSON.stringify(answers[1] ?? null)},
  "barrier": ${JSON.stringify(answers[3] ?? null)},
  "energy_pattern": ${JSON.stringify(answers[4] ?? null)},
  "sleep_duration": ${JSON.stringify(answers[7] ?? null)},
  "sleep_quality": ${JSON.stringify(answers[8] ?? null)},
  "readiness": ${JSON.stringify(answers[34] ?? null)},
  "identity": ${JSON.stringify(answers[35] ?? null)},
  "confidence": ${JSON.stringify(answers[38] ?? null)}
}

INSTRUCTION:
Generate a fully causal system-level health analysis.

STRICT REQUIREMENTS:
- no missing fields
- no generic advice
- every domain must include causal relationships
- must prioritize weakest domain as system bottleneck
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

  const makeStatus = (score: number): 'strong' | 'moderate' | 'weak' => {
    if (score >= 80) return 'strong'
    if (score >= 50) return 'moderate'
    return 'weak'
  }

  const makeNode = (
    domain: keyof DomainScores,
    insight: string,
  ): DomainNode => {
    const score = scores[domain]

    return {
      score,
      status: makeStatus(score),
      insight,
      roleInSystem: `${domain} acts as a system regulator influencing downstream health stability`,
      whatDrivesIt: `${domain} is driven by upstream behavioral and physiological inputs`,
      whatItAffects: `${domain} influences energy regulation, stress response, and recovery balance`,
      microAction: 'Take a 5–10 minute corrective action targeting this domain',
    }
  }

  return {
    summary: getDefaultSummary(scores),
    diagnosis: getDefaultDiagnosis(weakestDomain, answers),

    keyInsight:
      'The system bottleneck is concentrated in the weakest domain affecting overall stability.',
    whyThisMatters:
      'Small improvements in the weakest node create disproportionate improvements across the system.',

    causalChain: [
      `${weakestDomain} acts as system bottleneck reducing overall regulation efficiency`,
      `this creates downstream instability in energy and stress response systems`,
      `instability feeds back and further weakens ${weakestDomain} performance`,
    ],

    mainBottleneck: {
      domain: weakestDomain,
      title: `${weakestDomain} به‌عنوان گلوگاه اصلی سیستم`,
      explanation: `${weakestDomain} پایین‌ترین سطح عملکرد را دارد و بیشترین اثر را روی کل سیستم می‌گذارد.`,
      affectedAreas: [
        'انرژی روزانه',
        'پاسخ به استرس',
        'کیفیت ریکاوری',
        'ثبات رفتاری',
      ],
      leverageReason:
        'بهبود این بخش بیشترین اثر زنجیره‌ای را روی سایر سیستم‌ها دارد.',
    },

    priorityFactors: [
      {
        title: `${weakestDomain} به‌عنوان گلوگاه اصلی`,
        domain: weakestDomain,
        priority: 1,
        whyImportant: 'این بخش بیشترین اثر را روی کل سیستم دارد',
        systemImpact: 'نوسان در انرژی و استرس',
        personalImpact: 'کاهش تمرکز و بهره‌وری روزانه',
        microAction: '۵ دقیقه اقدام مرتبط با این حوزه',
      },
      {
        title: 'تنظیم چرخه انرژی',
        domain: 'energy',
        priority: 2,
        whyImportant: 'انرژی خروجی کل سیستم را کنترل می‌کند',
        systemImpact: 'ثبات کمتر در عملکرد روزانه',
        personalImpact: 'خستگی زودهنگام',
        microAction: 'پیاده‌روی کوتاه بعد از غذا',
      },
      {
        title: 'کاهش استرس پایه',
        domain: 'stress',
        priority: 3,
        whyImportant: 'استرس همه سیستم‌ها را تحت تاثیر قرار می‌دهد',
        systemImpact: 'اختلال در خواب و ریکاوری',
        personalImpact: 'کاهش کیفیت تصمیم‌گیری',
        microAction: 'تنفس عمیق ۳ دقیقه‌ای',
      },
    ],

    startingPoint: {
      title: `شروع از ${weakestDomain}`,
      description: `تمرکز اولیه باید روی اصلاح ناپایدارترین بخش سیستم باشد تا اثر زنجیره‌ای ایجاد شود.`,
      expectedBenefits: [
        'افزایش انرژی پایدار',
        'کاهش نوسان استرس',
        'بهبود کیفیت عملکرد روزانه',
      ],
      firstAction: 'یک تغییر ۵ تا ۱۰ دقیقه‌ای مرتبط با این حوزه انجام دهید',
    },

    futureProjection: {
      ifNoChange: `Ongoing ${weakestDomain} dysfunction maintains feedback instability across energy and stress systems.`,

      ifImproved: `Stabilizing ${weakestDomain} initiates cascade improvement across connected health subsystems.`,

      expectedTimeframe:
        scores[weakestDomain] < 40 ? '10–14 days' : '5–10 days',

      confidence: scores[weakestDomain] < 40 ? 'high' : 'medium',
    },

    healthArchetype: determineArchetype(scores, answers),
    readinessStage: determineReadinessStage(answers),

    goals: getDefaultGoals(scores, weakestDomain, answers),

    domains: {
      sleep: makeNode(
        'sleep',
        'Sleep quality regulates systemic recovery and energy restoration.',
      ),
      energy: makeNode(
        'energy',
        'Energy is the central output metric of the health system.',
      ),
      stress: makeNode(
        'stress',
        'Stress modulates all downstream physiological responses.',
      ),
      nutrition: makeNode(
        'nutrition',
        'Nutrition acts as the primary input for energy availability.',
      ),
      activity: makeNode(
        'activity',
        'Activity regulates metabolic flow and stress buffering.',
      ),
      behavioral: makeNode(
        'behavioral',
        'Behavioral stability determines system consistency.',
      ),
      medical: makeNode(
        'medical',
        'Medical baseline defines system constraints and risk boundaries.',
      ),
      beauty: makeNode(
        'beauty',
        'Beauty reflects downstream systemic health signals.',
      ),
    },
  }
}
